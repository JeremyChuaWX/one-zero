use near_contract_standards::fungible_token::metadata::{FungibleTokenMetadata, FT_METADATA_SPEC};
use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    env,
    json_types::U128,
    near_bindgen, require,
    serde::{Deserialize, Serialize},
    serde_json,
    store::{LookupMap, UnorderedMap, Vector},
    AccountId, Balance, BorshStorageKey, Gas, PanicOnDefault, Promise, PromiseError,
};
use near_sdk_contract_tools::{
    event,
    standard::{
        nep141::{ext_nep141, Nep141},
        nep297::Event,
    },
};

const TOKEN_CONTRACT: &[u8] = include_bytes!(
    "../../token/target/wasm32-unknown-unknown/release/one_zero_token_contract.wasm"
);

const NO_DEPOSIT: u128 = 0;
const GAS: Gas = Gas(50_000_000_000_000);

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct TokenArgs {
    owner: AccountId,
    metadata: FungibleTokenMetadata,
}

impl TokenArgs {
    fn new(owner: AccountId, name: String, symbol: String) -> Self {
        Self {
            owner,
            metadata: FungibleTokenMetadata {
                spec: FT_METADATA_SPEC.to_string(),
                name,
                symbol,
                icon: None,
                reference: None,
                reference_hash: None,
                decimals: 8,
            },
        }
    }
}

#[event(standard = "x-one-zero", version = "0.1.0", serde = "near_sdk::serde")]
enum FactoryEvent {
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
struct Market {
    id: u32,
    description: String,
    owner: AccountId,
    is_open: bool,
    is_long: bool,
    long_token: AccountId,
    short_token: AccountId,
}

#[derive(Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct ViewMarket<'a> {
    id: u32,
    description: &'a str,
    owner: &'a AccountId,
    is_open: bool,
    is_long: bool,
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
    id: u32,
    market_id: u32,
    account_id: AccountId,
    is_long: bool,
    amount: U128,
}

#[derive(BorshSerialize, BorshStorageKey)]
enum StorageKey {
    Market,
    Offer,
    Storage,
}

#[derive(BorshSerialize, BorshDeserialize, PanicOnDefault)]
#[near_bindgen]
pub struct Factory {
    next_offer_id: u32,
    markets: Vector<Market>,
    offers: UnorderedMap<u32, Offer>,
    storage_deposits: LookupMap<AccountId, Balance>,
}

#[near_bindgen]
impl Factory {
    #[init]
    pub fn new() -> Self {
        Self {
            next_offer_id: 1,
            markets: Vector::new(StorageKey::Market),
            offers: UnorderedMap::new(StorageKey::Offer),
            storage_deposits: LookupMap::new(StorageKey::Storage),
        }
    }

    // ----- Utils -----

    fn format_token_account_id(symbol: &str) -> AccountId {
        let token_account_id = format!(
            "{}.{}",
            symbol.to_ascii_lowercase(),
            env::current_account_id()
        );
        assert!(
            env::is_valid_account_id(token_account_id.as_bytes()),
            "Invalid token account id"
        );
        token_account_id
            .parse()
            .unwrap_or_else(|_| env::panic_str("Invalid token account id"))
    }

    fn deploy_token(account: AccountId, args: &TokenArgs) -> Promise {
        Promise::new(account)
            .create_account()
            .deploy_contract(TOKEN_CONTRACT.to_vec())
            .function_call(
                "new".to_string(),
                serde_json::to_vec(args).unwrap(),
                NO_DEPOSIT,
                GAS,
            )
    }

    // ----- Markets -----

    pub fn get_market(&self, market_id: u32) -> Option<ViewMarket> {
        self.markets.get(market_id).map(|m| m.into())
    }

    pub fn list_markets(&self) -> Vec<ViewMarket> {
        self.markets.iter().map(|m| m.into()).collect()
    }

    pub fn create_market(&mut self, description: String) -> Promise {
        let market_id = self.markets.len();
        let owner = env::predecessor_account_id();

        let long_token_args = TokenArgs::new(
            owner.clone(),
            format!("market {} long token", market_id),
            format!("M{}L", market_id),
        );
        let long_token_account = Self::format_token_account_id(&long_token_args.metadata.symbol);
        let long_token_promise = Self::deploy_token(long_token_account.clone(), &long_token_args);

        let short_token_args = TokenArgs::new(
            owner.clone(),
            format!("market {} short token", market_id),
            format!("M{}S", market_id),
        );
        let short_token_account = Self::format_token_account_id(&short_token_args.metadata.symbol);
        let short_token_promise =
            Self::deploy_token(short_token_account.clone(), &short_token_args);

        long_token_promise.and(short_token_promise).then(
            Self::ext(env::current_account_id()).activate_market(
                market_id,
                owner,
                description,
                long_token_account,
                short_token_account,
            ),
        )
    }

    #[private]
    pub fn activate_market(
        &mut self,
        #[callback_result] long_result: Result<(), PromiseError>,
        #[callback_result] short_result: Result<(), PromiseError>,
        market_id: u32,
        owner: AccountId,
        description: String,
        long_token: AccountId,
        short_token: AccountId,
    ) {
        if long_result.is_ok() && short_result.is_ok() {
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
        }
    }

    pub fn close_market(&mut self, market_id: u32, is_long: bool) {
        let market = self
            .markets
            .get_mut(market_id)
            .unwrap_or_else(|| env::panic_str("Market does not exist!"));

        require!(market.is_open, "Market is already closed.");

        let predecessor = env::predecessor_account_id();

        require!(
            market.owner == predecessor,
            "You are not allowed to close a market you did not create."
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

    // ----- Offers -----

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
            "You must attach a non-zero amount to make an offer."
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
        let offer = self.offers.get(&offer_id).unwrap_or_else(|| {
            env::panic_str("Offer does not exist. Maybe someone already accepted it?")
        });

        self.markets
            .get_mut(offer.market_id)
            .unwrap_or_else(|| env::panic_str("Market no longer exists!"));

        let predecessor = env::predecessor_account_id();

        require!(
            predecessor == offer.account_id,
            "You cannot accept your own offer."
        );

        let amount = env::attached_deposit();

        require!(
            amount > 0,
            "You must attach a non-zero amount to make an offer."
        );

        let amount: U128 = amount.into();

        require!(
            offer.amount == amount,
            "You must attach exactly the same amount as the offer you are accepting."
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

    // ----- Tokens -----

    pub fn withdraw(&self, market_id: u32) {
        let predecessor = env::predecessor_account_id();

        let market = self
            .markets
            .get(market_id)
            .unwrap_or_else(|| env::panic_str("Market does not exist."));

        require!(!market.is_open, "Cannot withdraw from an open market.");

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
}
