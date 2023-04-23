use near_contract_standards::storage_management::{
    StorageBalance, StorageBalanceBounds, StorageManagement,
};
use near_sdk::{
    assert_one_yocto, env, json_types::U128, log, near_bindgen, require, AccountId, Promise,
};

use crate::factory_contract::{Factory, FactoryExt};

const ZERO: u128 = 0;

#[near_bindgen]
impl Factory {
    fn internal_register_account(&mut self, account_id: AccountId) {
        self.storage_balances.insert(
            account_id,
            StorageBalance {
                total: ZERO.into(),
                available: ZERO.into(),
            },
        );
    }

    fn internal_storage_balance_of(&self, account_id: &AccountId) -> Option<StorageBalance> {
        self.storage_balances
            .get(account_id)
            .map(|sb| StorageBalance {
                total: sb.total,
                available: sb.available,
            })
    }
}

#[near_bindgen]
impl StorageManagement for Factory {
    #[payable]
    fn storage_deposit(
        &mut self,
        account_id: Option<AccountId>,
        registration_only: Option<bool>,
    ) -> StorageBalance {
        let amount = env::attached_deposit();
        let account_id = account_id.unwrap_or_else(env::predecessor_account_id);
        let registered = self.storage_balances.contains_key(&account_id);
        let registration_only = registration_only.unwrap_or(false);

        if registered {
            let storage_balance = self.storage_balances.get_mut(&account_id).unwrap();

            if registration_only {
                log!("The account is already registered, refunding the deposit");
                if amount > 0 {
                    Promise::new(env::predecessor_account_id()).transfer(amount);
                }
            } else {
                storage_balance.total = (storage_balance.total.0 + amount).into();
                storage_balance.available = (storage_balance.available.0 + amount).into();
            }
        } else {
            self.internal_register_account(account_id.clone());
            let min_balance = self.storage_balance_bounds().min.0;

            require!(
                amount > min_balance,
                "The attached deposit is less than the minimum storage balance"
            );

            let storage_balance = self.storage_balances.get_mut(&account_id).unwrap();

            if registration_only {
                storage_balance.total = min_balance.into();
                let refund = amount - min_balance;
                if refund > 0 {
                    Promise::new(env::predecessor_account_id()).transfer(refund);
                }
            } else {
                let available = amount - min_balance;
                storage_balance.total = amount.into();
                storage_balance.available = available.into();
            }
        }

        self.internal_storage_balance_of(&account_id).unwrap()
    }

    #[payable]
    fn storage_withdraw(&mut self, amount: Option<U128>) -> StorageBalance {
        assert_one_yocto();
        todo!()
    }

    #[payable]
    fn storage_unregister(&mut self, force: Option<bool>) -> bool {
        assert_one_yocto();
        todo!()
    }

    fn storage_balance_bounds(&self) -> StorageBalanceBounds {
        // TODO: define required_storage_balance properly
        let required_storage_balance = env::storage_byte_cost();
        StorageBalanceBounds {
            min: required_storage_balance.into(),
            max: None,
        }
    }

    fn storage_balance_of(&self, account_id: near_sdk::AccountId) -> Option<StorageBalance> {
        self.internal_storage_balance_of(&account_id)
    }
}
