use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    near_bindgen, PanicOnDefault,
};
use near_sdk_contract_tools::FungibleToken;

#[derive(BorshSerialize, BorshDeserialize, PanicOnDefault, FungibleToken)]
#[fungible_token(name = "One Zero Short Token", symbol = "OZS", decimals = 24, no_hooks)]
#[near_bindgen]
pub struct ShortToken {}
