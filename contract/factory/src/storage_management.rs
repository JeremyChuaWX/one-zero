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

    fn internal_account_is_registered(&self, account_id: &AccountId) -> bool {
        self.storage_balances.contains_key(account_id)
    }

    fn internal_storage_balance_of(&self, account_id: &AccountId) -> Option<StorageBalance> {
        self.storage_balances
            .get(account_id)
            .map(|sb| StorageBalance {
                total: sb.total,
                available: sb.available,
            })
    }

    fn internal_mut_storage_balance_of(
        &mut self,
        account_id: &AccountId,
    ) -> Option<&mut StorageBalance> {
        self.storage_balances.get_mut(account_id)
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

        // If `account_id` is omitted, the deposit MUST go toward predecessor account
        let account_id = account_id.unwrap_or_else(env::predecessor_account_id);
        let registered = self.internal_account_is_registered(&account_id);
        let registration_only = registration_only.unwrap_or(false);

        if registered {
            let storage_balance = self.internal_mut_storage_balance_of(&account_id).unwrap();

            if registration_only {
                // If `registration_only=true`, contract MUST refund full deposit if already registered
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

            let storage_balance = self.internal_mut_storage_balance_of(&account_id).unwrap();

            if registration_only {
                // If `registration_only=true`, contract MUST refund above the minimum balance if the account wasn't registered
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
        // MUST require exactly 1 yoctoNEAR attached balance
        assert_one_yocto();

        // If predecessor account not registered, contract MUST panic
        let storage_balance = self
            .internal_mut_storage_balance_of(&env::predecessor_account_id())
            .unwrap_or_else(|| env::panic_str("Your account is not registered"));

        match amount {
            Some(amount) => {
                // If `amount` exceeds predecessor account's available balance, contract MUST panic
                require!(
                    amount <= storage_balance.available,
                    "Insufficient available balance"
                );

                storage_balance.available = (storage_balance.available.0 - amount.0).into();
            }
            None => {
                // If omitted, contract MUST refund full `available` balance
                storage_balance.available = ZERO.into();
            }
        }

        // Returns the StorageBalance structure showing updated balances
        self.internal_storage_balance_of(&env::predecessor_account_id())
            .unwrap()
    }

    #[payable]
    fn storage_unregister(&mut self, force: Option<bool>) -> bool {
        // MUST require exactly 1 yoctoNEAR attached balance
        assert_one_yocto();

        // If the predecessor account is not registered, the function MUST return `false` without panic
        if !self.internal_account_is_registered(&env::predecessor_account_id()) {
            // Returns `false` if account was not registered before.
            return false;
        }

        match force {
            Some(true) => {
                // Contract MAY panic if it doesn't support forced unregistration
                env::panic_str("Does not support force unregistration");
            }
            _ => {
                let storage_balance = self
                    .internal_storage_balance_of(&env::predecessor_account_id())
                    .unwrap();

                // If `force=false` or `force` is omitted, the contract MUST panic if caller has existing account data
                require!(
                    storage_balance.available.0 == 0,
                    "Cannot unregister account with existing data"
                );

                // Unregisters the predecessor account and returns the storage NEAR deposit
                Promise::new(env::predecessor_account_id()).transfer(storage_balance.total.into());
                self.storage_balances.remove(&env::predecessor_account_id());

                // Returns `true` if the account was successfully unregistered
                true
            }
        }
    }

    fn storage_balance_bounds(&self) -> StorageBalanceBounds {
        let total_min_balance = self.offer_storage_cost + self.market_storage_cost;
        StorageBalanceBounds {
            min: total_min_balance.into(),
            max: None,
        }
    }

    fn storage_balance_of(&self, account_id: near_sdk::AccountId) -> Option<StorageBalance> {
        self.internal_storage_balance_of(&account_id)
    }
}
