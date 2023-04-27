use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    env, is_promise_success, near_bindgen, require,
    store::{UnorderedMap, Vector},
    AccountId, Balance, BorshStorageKey, Promise,
};
use near_sdk_contract_tools::standard::nep297::Event;

use constants::gas;
use data::{Market, Offer, TokenInitArgs};
use events::MarketplaceEvent;
use utils::format_refund_deposit_promise;

pub mod constants;
pub mod data;
pub mod events;
pub mod utils;

#[derive(BorshSerialize, BorshDeserialize, BorshStorageKey)]
enum StorageKey {
    Market,
    Offer,
}

#[near_bindgen]
#[derive(BorshSerialize, BorshDeserialize)]
pub struct Marketplace {
    markets: Vector<Market>,
    offers: UnorderedMap<u32, Offer>,
    market_storage_stake: Balance,
    offer_storage_stake: Balance,
}

impl Default for Marketplace {
    fn default() -> Self {
        env::panic_str("Not initialised yet");
    }
}

#[near_bindgen]
impl Marketplace {
    fn calculate_storage_stake(&mut self) {
        // market
        let storage_usage_before = env::storage_usage();
        self.markets.push(Market::dummy());
        let storage_usage_after = env::storage_usage();
        self.markets.clear();
        let storage_usage: u64 = (storage_usage_after - storage_usage_before).into();
        self.market_storage_stake = storage_usage as u128 * env::storage_byte_cost();

        // offer
        let storage_usage_before = env::storage_usage();
        self.offers.insert(0, Offer::dummy());
        let storage_usage_after = env::storage_usage();
        self.offers.clear();
        let storage_usage: u64 = (storage_usage_after - storage_usage_before).into();
        self.offer_storage_stake = storage_usage as u128 * env::storage_byte_cost();
    }

    #[init]
    pub fn new() -> Self {
        let mut this = Self {
            markets: Vector::new(StorageKey::Market),
            offers: UnorderedMap::new(StorageKey::Offer),
            market_storage_stake: 0,
            offer_storage_stake: 0,
        };
        this.calculate_storage_stake();
        this
    }
}

// ---------- market methods ---------- //
#[near_bindgen]
impl Marketplace {
    // ---------- view methods ---------- //

    // get market with given id
    pub fn get_market(&self, market_id: u32) -> &Market {
        self.markets
            .get(market_id)
            .unwrap_or_else(|| env::panic_str("Market not found"))
    }

    // get all markets in the markeplace
    pub fn list_markets(&self) -> Vec<&Market> {
        self.markets.iter().collect()
    }

    // get the id that the next market would take
    fn get_current_market_id(&self) -> u32 {
        self.markets.len()
    }

    // get the min deposit for creating a market
    fn get_create_market_min_deposit(&self) -> Balance {
        utils::token_storage_stake() + self.market_storage_stake
    }

    // ---------- mutate methods ---------- //

    // get mutable reference to market with given id
    fn get_mut_market(&mut self, market_id: u32) -> &mut Market {
        self.markets
            .get_mut(market_id)
            .unwrap_or_else(|| env::panic_str("Market not found"))
    }

    // `create_market` checks that attached deposit is sufficient before
    // parsing given market metadata, and generate a new market from it
    // !! market owner == predecessor
    #[payable]
    pub fn create_market(&mut self, description: String) -> Promise {
        let market_id = self.get_current_market_id();
        let market_owner = env::predecessor_account_id();
        let marketplace = env::current_account_id();
        let attached_deposit = env::attached_deposit();
        require!(
            attached_deposit >= self.get_create_market_min_deposit(),
            "Insufficient attached balance for storage stakes"
        );

        // long token
        let long_args = TokenInitArgs::new(
            env::current_account_id(),
            format!("market {} long token", market_id),
            format!("M{}L", market_id),
        );
        let long_account_id =
            utils::format_token_account_id(&long_args.metadata.symbol, marketplace.clone());
        let long_promise = utils::format_deploy_token_promise(long_account_id.clone(), &long_args);

        // short token
        let short_args = TokenInitArgs::new(
            env::current_account_id(),
            format!("market {} short token", market_id),
            format!("M{}S", market_id),
        );
        let short_account_id =
            utils::format_token_account_id(&short_args.metadata.symbol, marketplace.clone());
        let short_promise =
            utils::format_deploy_token_promise(short_account_id.clone(), &short_args);

        // deploy tokens
        long_promise.and(short_promise).then(
            Self::ext(marketplace)
                .with_static_gas(gas::CREATE_MARKET)
                .on_create_market(
                    market_id,
                    market_owner,
                    long_account_id,
                    short_account_id,
                    description,
                    attached_deposit,
                ),
        )
    }

    // handle callback of market creation
    #[private]
    pub fn on_create_market(
        &mut self,
        market_id: u32,
        market_owner: AccountId,
        long_token: AccountId,
        short_token: AccountId,
        description: String,
        attached_deposit: Balance,
    ) {
        if is_promise_success() {
            let market = Market::new(
                market_id,
                market_owner,
                long_token,
                short_token,
                description,
            );
            self.markets.push(market);
            MarketplaceEvent::MarketCreated {}.emit();
            format_refund_deposit_promise(
                market_owner,
                attached_deposit - self.get_create_market_min_deposit(),
            );
        } else {
            format_refund_deposit_promise(
                market_owner,
                attached_deposit - utils::token_storage_stake(),
            );
        }
    }

    // `close_market` checks that market is open and predecessor
    // owns it before closing the market and setting the market result
    pub fn close_market(&mut self, market_id: u32, is_long: bool) {
        let market = self.get_mut_market(market_id);
        require!(
            !market.is_closed,
            "Cannot close a market that is already closed"
        );
        require!(
            market.owner == env::predecessor_account_id(),
            "Cannot close a market that you do not own"
        );
        market.is_closed = true;
        market.is_long = is_long;

        MarketplaceEvent::MarketClosed {}.emit();
    }
}

// ---------- offer methods ---------- //
#[near_bindgen]
impl Marketplace {
    // ---------- view methods ---------- //

    // get offer with given id
    pub fn get_offer(&self, offer_id: u32) -> &Offer {
        self.offers
            .get(&offer_id)
            .unwrap_or_else(|| env::panic_str("Offer not found"))
    }

    // get all offers in the marketplace
    pub fn list_offers(&self) -> Vec<&Offer> {
        self.offers.iter().map(|(_id, offer)| offer).collect()
    }

    // get all offers in a given market
    pub fn list_offers_by_market(&self, market: u32) -> Vec<&Offer> {
        self.offers
            .iter()
            .filter_map(|(_id, offer)| {
                if offer.market == market {
                    Some(offer)
                } else {
                    None
                }
            })
            .collect()
    }

    // ---------- mutate methods ---------- //

    // `create_offer` checks that attached deposit is sufficient before
    // parsing given offer metadata, and generate a new offer from it
    // !! offer owner == predecessor
    #[payable]
    pub fn create_offer(&mut self) {
        MarketplaceEvent::OfferCreated {}.emit();
        todo!()
    }

    // `accept_offer` checks that offer is open, attached deposit is sufficient,
    // and predecessor does not own it before accepting the offer and removing it
    #[payable]
    pub fn accept_offer(&mut self) {
        MarketplaceEvent::OfferAccepted {}.emit();
        todo!()
    }
}
