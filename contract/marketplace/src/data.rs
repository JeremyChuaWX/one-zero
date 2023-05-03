use near_contract_standards::fungible_token::{
    core::FungibleTokenCore,
    metadata::{FungibleTokenMetadata, FT_METADATA_SPEC},
};
use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    ext_contract,
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
    pub owner_id: AccountId,
    pub long_token_id: AccountId,
    pub short_token_id: AccountId,
    pub description: String,
}

impl Market {
    pub fn new(
        id: u32,
        owner_id: AccountId,
        long_token_id: AccountId,
        short_token_id: AccountId,
        description: String,
    ) -> Self {
        Self {
            id,
            is_closed: false,
            is_long: false,
            owner_id,
            long_token_id,
            short_token_id,
            description,
        }
    }

    pub fn dummy() -> Self {
        Self {
            id: 0,
            is_closed: false,
            is_long: false,
            owner_id: "one-zero.testnet".parse().unwrap(),
            long_token_id: "one-zero.testnet".parse().unwrap(),
            short_token_id: "one-zero.testnet".parse().unwrap(),
            description: "one-zero.testnet".to_string(),
        }
    }
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Offer {
    pub id: u32,
    pub market_id: u32,
    pub is_long: bool,
    pub account_id: AccountId,
    pub amount: U128,
}

impl Offer {
    pub fn dummy() -> Self {
        Self {
            id: 0,
            market_id: 0,
            is_long: false,
            account_id: "one-zero.testnet".parse().unwrap(),
            amount: U128::from(123),
        }
    }
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct TokenInitArgs {
    pub owner_id: AccountId,
    pub metadata: FungibleTokenMetadata,
}

impl TokenInitArgs {
    pub fn new(owner: AccountId, name: String, symbol: String) -> Self {
        Self {
            owner_id: owner,
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

#[ext_contract(ext_token)]
pub trait TokenExt: FungibleTokenCore {
    /// registers account
    /// internal deposits the specified amount into account
    fn ft_mint(&mut self, account: AccountId, amount: U128);
}

#[derive(Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct FTReceiverMsg {
    pub market_id: u32,
    pub token_id: AccountId,
}
