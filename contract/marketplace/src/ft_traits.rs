use near_contract_standards::fungible_token::{
    receiver::FungibleTokenReceiver,
    resolver::{ext_ft_resolver, FungibleTokenResolver},
};
use near_sdk::{
    env, json_types::U128, near_bindgen, require, serde_json, AccountId, Balance, Promise,
    PromiseOrValue,
};

use crate::{
    constants::{gas, ZERO},
    data::FTReceiverMsg,
    Marketplace, MarketplaceExt,
};

#[near_bindgen]
impl FungibleTokenReceiver for Marketplace {
    fn ft_on_transfer(
        &mut self,
        sender_id: AccountId,
        amount: U128,
        msg: String,
    ) -> PromiseOrValue<U128> {
        let msg: FTReceiverMsg =
            serde_json::from_str(&msg).unwrap_or_else(|_| env::panic_str("Cannot parse message"));
        let market = self.get_market(msg.market_id);
        require!(market.is_closed, "Cannot collect rewards on an open market");
        let is_long = match msg.token_id {
            _ if msg.token_id == market.long_token_id => true,
            _ if msg.token_id == market.short_token_id => false,
            _ => env::panic_str("Invalid token and market pair"),
        };
        if is_long == market.is_long {
            PromiseOrValue::Promise(
                Promise::new(sender_id.clone())
                    .transfer(Balance::from(amount) * 2)
                    .then(
                        ext_ft_resolver::ext(env::current_account_id()).ft_resolve_transfer(
                            sender_id,
                            env::current_account_id(),
                            amount,
                        ),
                    ),
            )
        } else {
            PromiseOrValue::Value(U128::from(ZERO))
        }
    }
}

#[near_bindgen]
impl FungibleTokenResolver for Marketplace {
    #[private]
    fn ft_resolve_transfer(
        &mut self,
        _sender_id: AccountId,
        _receiver_id: AccountId,
        amount: U128,
    ) -> U128 {
        amount
    }
}
