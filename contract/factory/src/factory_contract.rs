use near_contract_standards::storage_management::StorageBalance;
use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    env, is_promise_success,
    json_types::U128,
    near_bindgen, require,
    serde::{Deserialize, Serialize},
    store::{LookupMap, UnorderedMap, Vector},
    AccountId, Balance, BorshStorageKey, PanicOnDefault, Promise,
};
use near_sdk_contract_tools::{
    event,
    standard::{
        nep141::{ext_nep141, Nep141},
        nep297::Event,
    },
};

use crate::utils;

#[event(standard = "x-one-zero", version = "0.1.0", serde = "near_sdk::serde")]
pub enum FactoryEvent {
    MarketCreated {
        market_id: u32,
        owner: AccountId,
    },
    MarketClosed {
        market_id: u32,
        owner: AccountId,
        is_long: bool,
    },
    OfferCreated {
        offer_id: u32,
        market_id: u32,
        account_id: AccountId,
        is_long: bool,
        amount: U128,
    },
    OfferAccepted {
        offer_id: u32,
        market_id: u32,
        account_id: AccountId,
    },
    WithdrawalMade {
        market_id: u32,
        account_id: AccountId,
        amount: U128,
    },
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct Market {
    pub id: u32,
    pub description: String,
    pub owner: AccountId,
    pub is_open: bool,
    pub is_long: bool,
    pub long_token: AccountId,
    pub short_token: AccountId,
}

impl Market {
    fn dummy(dummy_account: AccountId) -> Self {
        Self {
            id: 0,
            description: "testing".to_string(),
            owner: dummy_account.clone(),
            is_open: false,
            is_long: false,
            long_token: dummy_account.clone(),
            short_token: dummy_account,
        }
    }
}

#[derive(Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct ViewMarket<'a> {
    pub id: u32,
    pub description: &'a str,
    pub owner: &'a AccountId,
    pub is_open: bool,
    pub is_long: bool,
}

impl<'a> From<&'a Market> for ViewMarket<'a> {
    fn from(market: &'a Market) -> Self {
        Self {
            id: market.id,
            description: &market.description,
            owner: &market.owner,
            is_open: market.is_open,
            is_long: market.is_long,
        }
    }
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Debug, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Offer {
    pub id: u32,
    pub market_id: u32,
    pub account_id: AccountId,
    pub is_long: bool,
    pub amount: U128,
}

impl Offer {
    fn dummy(dummy_account: AccountId) -> Self {
        Self {
            id: 0,
            market_id: 0,
            account_id: dummy_account,
            is_long: false,
            amount: U128::from(123),
        }
    }
}

#[derive(BorshSerialize, BorshStorageKey)]
pub enum StorageKey {
    Market,
    Offer,
    Storage,
}

enum CalculateStorageCostParam {
    Market(Market),
    Offer(Offer),
}

#[derive(BorshSerialize, BorshDeserialize, PanicOnDefault)]
#[near_bindgen]
pub struct Factory {
    pub next_offer_id: u32,
    pub markets: Vector<Market>,
    pub offers: UnorderedMap<u32, Offer>,
    pub storage_balances: LookupMap<AccountId, StorageBalance>,
    pub market_storage_cost: Balance,
    pub offer_storage_cost: Balance,
}

#[near_bindgen]
impl Factory {
    #[init]
    pub fn new() -> Self {
        let mut factory = Self {
            next_offer_id: 1,
            markets: Vector::new(StorageKey::Market),
            offers: UnorderedMap::new(StorageKey::Offer),
            storage_balances: LookupMap::new(StorageKey::Storage),
            market_storage_cost: 0,
            offer_storage_cost: 0,
        };

        let dummy_account = env::predecessor_account_id();

        let market = Market::dummy(dummy_account.clone());
        factory.calculate_storage_cost(CalculateStorageCostParam::Market(market));

        let offer = Offer::dummy(dummy_account);
        factory.calculate_storage_cost(CalculateStorageCostParam::Offer(offer));

        factory
    }

    fn calculate_storage_cost(&mut self, param: CalculateStorageCostParam) {
        let storage_usage_before = env::storage_usage();

        match param {
            CalculateStorageCostParam::Market(market) => {
                self.markets.push(market);
                let storage_usage_after = env::storage_usage();
                self.markets.clear();

                let storage_usage: u128 = (storage_usage_after - storage_usage_before).into();
                self.market_storage_cost = storage_usage * env::storage_byte_cost();
            }

            CalculateStorageCostParam::Offer(offer) => {
                self.offers.insert(offer.id, offer);
                let storage_usage_after = env::storage_usage();
                self.offers.clear();

                let storage_usage: u128 = (storage_usage_after - storage_usage_before).into();
                self.offer_storage_cost = storage_usage * env::storage_byte_cost();
            }
        };
    }

    // ----- Market -----

    fn withdraw(&self, market_id: u32) {
        let predecessor = env::predecessor_account_id();

        let market = self
            .markets
            .get(market_id)
            .unwrap_or_else(|| env::panic_str("Market does not exist"));

        require!(!market.is_open, "Cannot withdraw from an open market");

        let token = if market.is_long {
            &market.long_token
        } else {
            &market.short_token
        };

        // let amount = token.ft_balance(predecessor)
        // swap amount of tokens for 2 times the amount of NEAR

        // ContractEvent::WithdrawalMade {
        //     market_id: market.id,
        //     account_id: predecessor.clone(),
        //     amount: amount.into(),
        // }
        // .emit();
        todo!()
    }

    pub fn get_market(&self, market_id: u32) -> Option<ViewMarket> {
        self.markets.get(market_id).map(|m| m.into())
    }

    pub fn list_markets(&self) -> Vec<ViewMarket> {
        self.markets.iter().map(|m| m.into()).collect()
    }

    #[payable]
    pub fn create_market(&mut self, description: String) -> Promise {
        let market_id = self.markets.len();
        let owner = env::predecessor_account_id();

        // long token
        let long_args = utils::TokenArgs::new(
            owner.clone(),
            format!("market {} long token", market_id),
            format!("M{}L", market_id),
        );
        let long_account = utils::format_token_account_id(&long_args.metadata.symbol);
        let long_promise = utils::deploy_token(long_account.clone(), &long_args);

        // short token
        let short_args = utils::TokenArgs::new(
            owner.clone(),
            format!("market {} short token", market_id),
            format!("M{}S", market_id),
        );
        let short_account = utils::format_token_account_id(&short_args.metadata.symbol);
        let short_promise = utils::deploy_token(short_account.clone(), &short_args);

        let attached = env::attached_deposit();
        let total_deploy_cost = utils::calculate_deploy_cost() * 2; // TODO: need to add storage costs

        require!(
            attached >= total_deploy_cost,
            "You must attach enough NEAR to create market"
        );

        long_promise
            .and(short_promise)
            .then(Self::ext(env::current_account_id()).activate_market(
                market_id,
                owner,
                description,
                long_account,
                short_account,
                // attached_deposit
            ))
    }

    #[private]
    pub fn activate_market(
        &mut self,
        market_id: u32,
        owner: AccountId,
        description: String,
        long_token: AccountId,
        short_token: AccountId,
        // attached_deposit: u128,
    ) -> bool {
        if !is_promise_success() {
            return false;
        }

        // TODO: check remaining attached deposit?

        let market = Market {
            id: market_id,
            description,
            owner: owner.clone(),
            is_open: false,
            is_long: false,
            long_token,
            short_token,
        };

        self.markets.push(market);

        FactoryEvent::MarketCreated { market_id, owner }.emit();
        true
    }

    pub fn close_market(&mut self, market_id: u32, is_long: bool) {
        let market = self
            .markets
            .get_mut(market_id)
            .unwrap_or_else(|| env::panic_str("Market does not exist!"));

        require!(market.is_open, "Market is already closed");

        let predecessor = env::predecessor_account_id();

        require!(
            market.owner == predecessor,
            "You are not allowed to close a market you did not create"
        );

        market.is_open = false;
        market.is_long = is_long;

        FactoryEvent::MarketClosed {
            market_id: market.id,
            owner: market.owner.clone(),
            is_long,
        }
        .emit();
    }

    // ----- Offer -----

    pub fn list_offers(&self) -> Vec<Offer> {
        self.offers.iter().map(|(_, b)| b.clone()).collect()
    }

    pub fn list_offers_by_market(&self, market_id: u32) -> Vec<Offer> {
        self.offers
            .iter()
            .filter_map(|(_, b)| {
                if b.market_id == market_id {
                    Some(b.clone())
                } else {
                    None
                }
            })
            .collect()
    }

    #[payable]
    pub fn create_offer(&mut self, market_id: u32, is_long: bool) {
        let amount = env::attached_deposit();

        require!(
            amount > 0,
            "You must attach a non-zero amount to make an offer"
        );

        let offer_id = self.next_offer_id;
        let account_id = env::predecessor_account_id();

        let offer = Offer {
            id: offer_id,
            market_id,
            account_id: account_id.clone(),
            is_long,
            amount: amount.into(),
        };

        self.offers.insert(offer_id, offer);
        self.next_offer_id += 1;

        FactoryEvent::OfferCreated {
            offer_id,
            market_id,
            account_id,
            is_long,
            amount: amount.into(),
        }
        .emit();
    }

    #[payable]
    pub fn accept_offer(&mut self, offer_id: u32) {
        let offer = self
            .offers
            .get(&offer_id)
            .unwrap_or_else(|| env::panic_str("Offer does not exist"));

        self.markets
            .get(offer.market_id)
            .unwrap_or_else(|| env::panic_str("Market no longer exists!"));

        let predecessor = env::predecessor_account_id();

        require!(
            predecessor == offer.account_id,
            "You cannot accept your own offer"
        );

        let amount = env::attached_deposit();

        require!(
            amount > 0,
            "You must attach a non-zero amount to make an offer"
        );

        let amount: U128 = amount.into();

        require!(
            offer.amount == amount,
            "You must attach exactly the same amount as the offer you are accepting"
        );

        let offer = self.offers.remove(&offer_id).unwrap();

        FactoryEvent::OfferAccepted {
            offer_id,
            market_id: offer.market_id,
            account_id: predecessor.clone(),
        }
        .emit();

        let (long_account, short_account) = if offer.is_long {
            (offer.account_id, predecessor)
        } else {
            (predecessor, offer.account_id)
        };

        // long_contract.internal_deposit(offer.market_id, long, offer.amount)
        // short_contract.internal_deposit(offer.market_id, short, offer.amount)
        todo!()
    }
}
