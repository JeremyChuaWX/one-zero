use near_sdk::{env, near_bindgen, require, AccountId, Balance, Promise};

use crate::helpers;
use crate::{Marketplace, MarketplaceExt};

#[near_bindgen]
impl Marketplace {
    pub fn storage_register_account(&mut self, account: Option<AccountId>) {
        self.storage_deposits
            .insert(helpers::valid_account_or_predecessor(account), 0);
    }

    /// get the storage balance of specified account
    pub fn get_storage_deposit(&self, account: AccountId) -> Balance {
        self.storage_deposits
            .get(&account)
            .unwrap_or_else(|| env::panic_str("Account not found"))
            .to_owned()
    }

    pub fn storage_deposit_balance(&mut self, account: Option<AccountId>, amount: Option<Balance>) {
        let account = helpers::valid_account_or_predecessor(account);
        let storage_deposit = self.get_storage_deposit(account.clone());
        let amount = helpers::amount_or_attached_deposit(amount);
        require!(amount > 0, "Cannot deposit zero amount");
        self.storage_deposits
            .set(account.clone(), Some(storage_deposit + amount));
        helpers::refund(account, env::attached_deposit(), amount);
    }

    pub fn storage_withdraw_balance(
        &mut self,
        account: Option<AccountId>,
        amount: Option<Balance>,
    ) {
        let account = helpers::valid_account_or_predecessor(account);
        let storage_deposit = self.get_storage_deposit(account.clone());
        let amount = helpers::amount_or_attached_deposit(amount);
        require!(
            amount <= storage_deposit,
            "Cannot withdraw more than current storage balance"
        );
        self.storage_deposits
            .set(account.clone(), Some(storage_deposit - amount));
        Promise::new(account).transfer(amount);
    }

    pub fn storage_unregister_account(&mut self, account: Option<AccountId>) {
        let account = helpers::valid_account_or_predecessor(account);
        require!(
            self.get_storage_deposit(account.clone()) == 0,
            "Cannot unregister account with non-zero storage balance"
        );
        self.storage_deposits.remove(&account);
    }
}
