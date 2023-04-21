use crate::factory_contract::TokenArgs;
use near_sdk::{env, serde_json, AccountId, Gas, Promise};

const TOKEN_CONTRACT: &[u8] = include_bytes!(
    "../../token/target/wasm32-unknown-unknown/release/one_zero_token_contract.wasm"
);
const NO_DEPOSIT: u128 = 0;
const GAS: Gas = Gas(50_000_000_000_000);

pub fn format_token_account_id(symbol: &str) -> AccountId {
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
        .unwrap_or_else(|_| env::panic_str("Cannot parse token account id"))
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
