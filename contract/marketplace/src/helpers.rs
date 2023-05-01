use near_sdk::{env, require, serde_json, AccountId, Balance, Promise};

use crate::constants::{gas, EXTRA_BYTES, TOKEN_BYTES, ZERO};
use crate::data::TokenInitArgs;

pub fn token_storage_stake() -> Balance {
    (TOKEN_BYTES.to_vec().len() as u128 + EXTRA_BYTES) * env::storage_byte_cost()
}

pub fn format_token_account_id(symbol: &str, owner: AccountId) -> AccountId {
    let token_account_id: AccountId = format!("{}.{}", symbol.to_ascii_lowercase(), owner)
        .parse()
        .unwrap_or_else(|_| env::panic_str("Cannot parse token account id"));
    require!(
        env::is_valid_account_id(token_account_id.as_bytes()),
        "Invalid token account id"
    );
    token_account_id
}

pub fn format_deploy_token_promise(account_id: AccountId, args: &TokenInitArgs) -> Promise {
    Promise::new(account_id)
        .create_account()
        .transfer(token_storage_stake())
        .deploy_contract(TOKEN_BYTES.to_vec())
        .function_call(
            "new".to_string(),
            serde_json::to_vec(args).unwrap(),
            ZERO,
            gas::INIT_TOKEN,
        )
}

pub fn refund(account: AccountId, attached_deposit: Balance, amount: Balance) {
    let refund = attached_deposit - amount;
    if refund > 0 {
        Promise::new(account).transfer(refund);
    }
}

/// if account id passed is valid, return it, else return predecessor
pub fn valid_account_or_predecessor(account: Option<AccountId>) -> AccountId {
    match account {
        Some(account) if env::is_valid_account_id(account.as_bytes()) => account,
        _ => env::predecessor_account_id(),
    }
}

/// if amount is defined, return it, else return entire attached deposit
pub fn amount_or_attached_deposit(amount: Option<Balance>) -> Balance {
    match amount {
        Some(amount) => amount,
        None => env::attached_deposit(),
    }
}
