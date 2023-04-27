use near_contract_standards::fungible_token::metadata::{FungibleTokenMetadata, FT_METADATA_SPEC};
use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    json_types::U128,
    serde::{Deserialize, Serialize},
    AccountId,
};

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Market {
    pub id: u32,
    pub is_closed: bool,
    pub is_long: bool,
    pub owner: AccountId,
    pub long_token: AccountId,
    pub short_token: AccountId,
    pub description: String,
}

impl Market {
    pub fn new(
        id: u32,
        owner: AccountId,
        long_token: AccountId,
        short_token: AccountId,
        description: String,
    ) -> Self {
        Self {
            id,
            is_closed: false,
            is_long: false,
            owner,
            long_token,
            short_token,
            description,
        }
    }

    pub fn dummy() -> Self {
        Self {
            id: 0,
            is_closed: false,
            is_long: false,
            owner: "".parse().unwrap(),
            long_token: "".parse().unwrap(),
            short_token: "".parse().unwrap(),
            description: "".to_string(),
        }
    }
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Offer {
    pub id: u32,
    pub market: u32,
    pub is_long: bool,
    pub account: AccountId,
    pub amount: U128,
}

impl Offer {
    pub fn dummy() -> Self {
        Self {
            id: 0,
            market: 0,
            is_long: false,
            account: "".parse().unwrap(),
            amount: U128::from(123),
        }
    }
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct TokenInitArgs {
    pub owner: AccountId,
    pub metadata: FungibleTokenMetadata,
}

impl TokenInitArgs {
    pub fn new(owner: AccountId, name: String, symbol: String) -> Self {
        Self {
            owner,
            metadata: FungibleTokenMetadata {
                spec: FT_METADATA_SPEC.to_string(),
                name,
                symbol,
                decimals: 24,
                icon: None,
                reference: None,
                reference_hash: None,
            },
        }
    }
}
