use near_sdk::near_bindgen;
use near_sdk_contract_tools::FungibleToken;

#[derive(FungibleToken)]
#[fungible_token(name = "One Zero Short Token", symbol = "OZS", decimals = 24, no_hooks)]
#[near_bindgen]
struct ShortToken {}
