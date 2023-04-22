use near_contract_standards::fungible_token::receiver::FungibleTokenReceiver;
use near_sdk::{json_types::U128, near_bindgen, AccountId, PromiseOrValue};

use crate::factory_contract::{Factory, FactoryExt};

#[near_bindgen]
impl Factory {
    #[private]
    pub fn ft_resolve_transfer(
        &mut self,
        sender_id: AccountId,
        receiver_id: AccountId,
        amount: U128,
    ) {
        todo!()
    }
}

#[near_bindgen]
impl FungibleTokenReceiver for Factory {
    fn ft_on_transfer(
        &mut self,
        sender_id: AccountId,
        amount: U128,
        msg: String,
    ) -> PromiseOrValue<U128> {
        /*
        - msg contains: token id, market id, long or short token
        - call FT contract to burn the attached FT
        - transfer associated amount of NEAR
        */
        todo!()
    }
}
