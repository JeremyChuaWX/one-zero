use near_contract_standards::fungible_token::metadata::{FungibleTokenMetadata, FT_METADATA_SPEC};
use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    env, require,
    serde::{Deserialize, Serialize},
    serde_json, AccountId, Gas, Promise,
};

const TOKEN_CONTRACT: &[u8] = include_bytes!(
    "../../token/target/wasm32-unknown-unknown/release/one_zero_token_contract.wasm"
);
const NO_DEPOSIT: u128 = 0;
const GAS: Gas = Gas(50_000_000_000_000);

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct TokenArgs {
    pub owner: AccountId,
    pub metadata: FungibleTokenMetadata,
}

impl TokenArgs {
    pub fn new(owner: AccountId, name: String, symbol: String) -> Self {
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

pub fn format_token_account_id(symbol: &str) -> AccountId {
    let token_account_id: AccountId = format!(
        "{}.{}",
        symbol.to_ascii_lowercase(),
        env::current_account_id().to_string(),
    )
    .parse()
    .unwrap_or_else(|_| env::panic_str("Cannot parse token account id"));

    require!(
        env::is_valid_account_id(token_account_id.as_bytes()),
        "Invalid token account id"
    );

    token_account_id
}

pub fn deploy_token(account_id: AccountId, args: &TokenArgs) -> Promise {
    Promise::new(account_id)
        .create_account()
        .deploy_contract(TOKEN_CONTRACT.to_vec())
        .function_call(
            "new".to_string(),
            serde_json::to_vec(args).unwrap(),
            NO_DEPOSIT,
            GAS,
        )
}
