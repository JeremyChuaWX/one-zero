use near_contract_standards::fungible_token::{
    receiver::FungibleTokenReceiver, resolver::FungibleTokenResolver,
};
use near_sdk::{
    json_types::U128, log, near_bindgen, serde::Deserialize, serde_json, AccountId, Promise,
    PromiseOrValue,
};

use crate::factory_contract::{Factory, FactoryExt};

#[near_bindgen]
impl FungibleTokenResolver for Factory {
    #[private]
    fn ft_resolve_transfer(
        &mut self,
        sender_id: AccountId,
        receiver_id: AccountId,
        amount: U128,
    ) -> U128 {
        // Finalize an `ft_transfer_call` chain of cross-contract calls.
        //
        // The `ft_transfer_call` process:
        //
        // 1. Sender calls `ft_transfer_call` on FT contract
        // 2. FT contract transfers `amount` tokens from sender to receiver
        // 3. FT contract calls `ft_on_transfer` on receiver contract
        // 4+. [receiver contract may make other cross-contract calls]
        // N. FT contract resolves promise chain with `ft_resolve_transfer`, and may
        //    refund sender some or all of original `amount`
        //
        // Requirements:
        // * Contract MUST forbid calls to this function by any account except self
        // * If promise chain failed, contract MUST revert token transfer
        // * If promise chain resolves with a non-zero amount given as a string,
        //   contract MUST return this amount of tokens to `sender_id`
        //
        // Arguments:
        // * `sender_id`: the sender of `ft_transfer_call`
        // * `receiver_id`: the `receiver_id` argument given to `ft_transfer_call`
        // * `amount`: the `amount` argument given to `ft_transfer_call`
        //
        // Returns a string representing a string version of an unsigned 128-bit
        // integer of how many total tokens were spent by sender_id. Example: if sender
        // calls `ft_transfer_call({ "amount": "100" })`, but `receiver_id` only uses
        // 80, `ft_on_transfer` will resolve with `"20"`, and `ft_resolve_transfer`
        // will return `"80"`.
        todo!()
    }
}

#[derive(Deserialize)]
#[serde(crate = "near_sdk::serde")]
struct FTOnTransferMsg {
    token_account_id: AccountId,
    market_id: u32,
}

fn transfer_reward(sender_id: AccountId, amount: U128) -> PromiseOrValue<U128> {
    let promise = Promise::new(sender_id).transfer(amount.into());
    PromiseOrValue::Promise(promise)
}

#[near_bindgen]
impl FungibleTokenReceiver for Factory {
    fn ft_on_transfer(
        &mut self,
        sender_id: AccountId,
        amount: U128,
        msg: String,
    ) -> PromiseOrValue<U128> {
        let msg = serde_json::from_str::<FTOnTransferMsg>(&msg);
        if msg.is_err() {
            log!("Invalid message");
            return PromiseOrValue::Value(amount);
        };
        let msg = msg.unwrap();

        let market = self.markets.get(msg.market_id);
        if market.is_none() {
            log!("Market does not exist");
            return PromiseOrValue::Value(amount);
        }
        let market = market.unwrap();

        if market.is_open {
            log!("Cannot withdraw from an open market");
            return PromiseOrValue::Value(amount);
        }

        if market.is_long {
            match msg.token_account_id {
                token_account_id if token_account_id == market.long_token => {
                    return transfer_reward(sender_id, amount);
                }
                token_account_id if token_account_id == market.short_token => {
                    // burn FTs
                    return PromiseOrValue::Value(U128::from(0));
                }
                _ => {}
            }
        } else {
            match msg.token_account_id {
                token_account_id if token_account_id == market.short_token => {
                    return transfer_reward(sender_id, amount);
                }
                token_account_id if token_account_id == market.long_token => {
                    // burn FTs
                    return PromiseOrValue::Value(U128::from(0));
                }
                _ => {}
            }
        }

        log!("This token is not related to any market");
        PromiseOrValue::Value(amount)
    }
}
