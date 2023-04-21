use near_contract_standards::storage_management::{
    StorageBalance, StorageBalanceBounds, StorageManagement,
};
use near_sdk::{assert_one_yocto, env, json_types::U128, log, near_bindgen, AccountId, Promise};

use crate::factory_contract::{Factory, FactoryExt};

const ZERO: u128 = 0;

#[near_bindgen]
impl Factory {
    fn internal_register_account(&mut self, account_id: AccountId) {
        self.storage_balances.insert(account_id, 0);
    }

    fn internal_storage_balance_of(&self, account_id: &AccountId) -> Option<StorageBalance> {
        // TODO: set values of StorageBalance properly

        if self.storage_balances.contains_key(account_id) {
            Some(StorageBalance {
                total: ZERO.into(),
                available: ZERO.into(),
            })
        } else {
            None
        }
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
        // TODO: deal with registration_only

        let amount = env::attached_deposit();
        let account_id = account_id.unwrap_or_else(env::predecessor_account_id);
        if self.storage_balances.contains_key(&account_id) {
            log!("The account is already registered, refunding the deposit");
            if amount > 0 {
                Promise::new(env::predecessor_account_id()).transfer(amount);
            }
        } else {
            let min_balance = self.storage_balance_bounds().min.0;
            if amount < min_balance {
                env::panic_str("The attached deposit is less than the minimum storage balance");
            }
            self.internal_register_account(account_id.clone());
            let refund = amount - min_balance;
            if refund > 0 {
                Promise::new(env::predecessor_account_id()).transfer(refund);
            }
        }
        self.internal_storage_balance_of(&account_id).unwrap()
    }

    #[payable]
    fn storage_withdraw(&mut self, amount: Option<U128>) -> StorageBalance {
        assert_one_yocto();
        let predecessor_account_id = env::predecessor_account_id();
        if let Some(storage_balance) = self.internal_storage_balance_of(&predecessor_account_id) {
            match amount {
                Some(amount) if amount.0 > 0 => {
                    env::panic_str("The amount is greater than the available storage balance");
                }
                _ => storage_balance,
            }
        } else {
            env::panic_str(
                format!("The account {} is not registered", &predecessor_account_id).as_str(),
            );
        }
    }

    #[payable]
    fn storage_unregister(&mut self, force: Option<bool>) -> bool {
        assert_one_yocto();
        let account_id = env::predecessor_account_id();
        let force = force.unwrap_or(false);
        if let Some(balance) = self.storage_balances.get(&account_id) {
            if *balance == 0 || force {
                self.storage_balances.remove(&account_id);
                Promise::new(account_id.clone()).transfer(self.storage_balance_bounds().min.0 + 1);
                true
            } else {
                env::panic_str(
                    "Can't unregister the account with the positive balance without force",
                )
            }
        } else {
            log!("The account {} is not registered", &account_id);
            false
        }
    }

    fn storage_balance_bounds(&self) -> StorageBalanceBounds {
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
