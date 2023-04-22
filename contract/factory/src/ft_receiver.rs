use near_contract_standards::fungible_token::receiver::FungibleTokenReceiver;
use near_sdk::near_bindgen;

use crate::factory_contract::{Factory, FactoryExt};

#[near_bindgen]
impl FungibleTokenReceiver for Factory {
    fn ft_on_transfer(
        &mut self,
        sender_id: near_sdk::AccountId,
        amount: near_sdk::json_types::U128,
        msg: String,
    ) -> near_sdk::PromiseOrValue<near_sdk::json_types::U128> {
        todo!()
    }
}
