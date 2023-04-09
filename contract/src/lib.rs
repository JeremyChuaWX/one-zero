/*
Questions:
- for Contract.credit the LookupMap why not use U128? is it because we don't serialise/deserialise?
*/

use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    json_types::U128,
    near_bindgen,
    serde::{Deserialize, Serialize},
    store::{LookupMap, UnorderedMap, Vector},
    AccountId, BorshStorageKey, PanicOnDefault,
};

// a pair of users going long and short by the same amount
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
struct SharePair {
    long: AccountId,
    short: AccountId,
    amount: u128,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
struct Market {
    id: u32,
    is_open: bool,
    desciption: String,
    owner: AccountId,
    shares: Vector<SharePair>,
}

// public view of the Market struct
#[derive(Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct ViewMarket<'a> {
    id: u32,
    is_open: bool,
    desciption: &'a str,
    owner: &'a AccountId,
    shares: u32,
}

impl<'a> From<&'a Market> for ViewMarket<'a> {
    fn from(m: &'a Market) -> Self {
        Self {
            id: m.id,
            is_open: m.is_open,
            desciption: &m.desciption,
            owner: &m.owner,
            shares: m.shares.len(),
        }
    }
}

// basically an ad to look for matching half to create a SharePair
#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Debug, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Offer {
    id: u32,
    market_id: u32,
    is_long: bool,
    account_id: AccountId,
    amount: U128,
}

#[derive(BorshSerialize, BorshDeserialize, PanicOnDefault)]
#[near_bindgen]
pub struct Contract {
    next_offer_id: u32, // used to generate ids when creating new offers
    markets: Vector<Market>,
    credit: LookupMap<AccountId, u128>,
    offers: UnorderedMap<u32, Offer>,
}

#[derive(BorshSerialize, BorshStorageKey)]
pub enum StorageKey {
    Markets,
    Credit,
    Offers,
    MarketShares(u32),
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            next_offer_id: 0,
            markets: Vector::new(StorageKey::Markets),
            credit: LookupMap::new(StorageKey::Credit),
            offers: UnorderedMap::new(StorageKey::Offers),
        }
    }
}
