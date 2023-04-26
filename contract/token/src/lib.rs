use near_contract_standards::{
    fungible_token::{
        metadata::{FungibleTokenMetadata, FungibleTokenMetadataProvider},
        FungibleToken,
    },
    impl_fungible_token_core, impl_fungible_token_storage,
};
use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    collections::LazyOption,
    env,
    json_types::U128,
    log, near_bindgen, AccountId, Balance, BorshStorageKey, PanicOnDefault, PromiseOrValue,
};

#[derive(BorshSerialize, BorshStorageKey)]
enum StorageKey {
    Token,
    Metadata,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    token: FungibleToken,
    metadata: LazyOption<FungibleTokenMetadata>,
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new(owner: AccountId, metadata: FungibleTokenMetadata) -> Self {
        assert!(!env::state_exists(), "Already initialised");
        metadata.assert_valid();
        let mut this = Self {
            token: FungibleToken::new(StorageKey::Token),
            metadata: LazyOption::new(StorageKey::Metadata, Some(&metadata)),
        };
        this.token.internal_register_account(&owner);
        this
    }

    fn on_account_closed(&mut self, account_id: AccountId, balance: Balance) {
        log!(&format!("Closed @{} with {}", account_id, balance));
    }

    fn on_tokens_burned(&mut self, account_id: AccountId, amount: Balance) {
        log!(&format!("Account @{} burned {}", account_id, amount));
    }
}

impl_fungible_token_core!(Contract, token, on_tokens_burned);
impl_fungible_token_storage!(Contract, token, on_account_closed);

#[near_bindgen]
impl FungibleTokenMetadataProvider for Contract {
    fn ft_metadata(&self) -> FungibleTokenMetadata {
        self.metadata.get().unwrap()
    }
}
