use near_contract_standards::fungible_token::{
    receiver::FungibleTokenReceiver, resolver::FungibleTokenResolver,
};
use near_sdk::{json_types::U128, near_bindgen, AccountId, PromiseOrValue};

use crate::{Marketplace, MarketplaceExt};

#[near_bindgen]
impl FungibleTokenReceiver for Marketplace {
    fn ft_on_transfer(
        &mut self,
        sender_id: AccountId,
        amount: U128,
        msg: String,
    ) -> PromiseOrValue<U128> {
        // msg = (market, is_long)
        // if winner, transfer amount * 2 to predecessor
        // if loser, burn tokens
        todo!()
    }
}

#[near_bindgen]
impl FungibleTokenResolver for Marketplace {
    #[private]
    fn ft_resolve_transfer(
        &mut self,
        sender_id: AccountId,
        receiver_id: AccountId,
        amount: U128,
    ) -> U128 {
        todo!()
    }
}
