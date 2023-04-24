use near_contract_standards::fungible_token::{
    receiver::FungibleTokenReceiver, resolver::FungibleTokenResolver,
};
use near_sdk::{
    json_types::U128, near_bindgen, serde::Deserialize, serde_json, AccountId, PromiseOrValue,
};

use crate::factory_contract::{Factory, FactoryExt};

#[near_bindgen]
impl FungibleTokenResolver for Factory {
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
struct FTMsg {
    token_id: AccountId,
    market_id: AccountId,
    is_long: bool,
}

#[near_bindgen]
impl FungibleTokenReceiver for Factory {
    fn ft_on_transfer(
        &mut self,
        sender_id: AccountId,
        amount: U128,
        msg: String,
    ) -> PromiseOrValue<U128> {
        // As mentioned, the `msg` argument contains information necessary for the receiving contract
        // to know how to process the request. This may include method names and/or arguments.

        /*
        - msg contains: token id, market id, long or short token
        - call FT contract to burn the attached FT
        - transfer associated amount of NEAR
        */

        let msg: FTMsg = serde_json::from_str(&msg).unwrap();

        // Returns a value, or a promise which resolves with a value. The value is the
        // number of unused tokens in string form. For instance, if `amount` is 10 but only 9 are
        // needed, it will return "1".
        todo!()
    }
}
