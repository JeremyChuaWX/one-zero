use near_contract_standards::fungible_token::{
    receiver::FungibleTokenReceiver, resolver::FungibleTokenResolver,
};
use near_sdk::near_bindgen;

use crate::{Marketplace, MarketplaceExt};

#[near_bindgen]
impl FungibleTokenReceiver for Marketplace {
    fn ft_on_transfer(
        &mut self,
        sender_id: near_sdk::AccountId,
        amount: near_sdk::json_types::U128,
        msg: String,
    ) -> near_sdk::PromiseOrValue<near_sdk::json_types::U128> {
        todo!()
    }
}

#[near_bindgen]
impl FungibleTokenResolver for Marketplace {
    fn ft_resolve_transfer(
        &mut self,
        sender_id: near_sdk::AccountId,
        receiver_id: near_sdk::AccountId,
        amount: near_sdk::json_types::U128,
    ) -> near_sdk::json_types::U128 {
        todo!()
    }
}
