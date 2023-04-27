pub const TOKEN_BYTES: &[u8] =
    include_bytes!("../../target/wasm32-unknown-unknown/release/token.wasm");
pub const ZERO: u128 = 0;

pub mod gas {
    use near_sdk::Gas;

    pub const DEPLOY_TOKEN: Gas = Gas(50_000_000_000_000);
    pub const INIT_TOKEN: Gas = Gas(10_000_000_000_000);
    pub const CREATE_MARKET: Gas = Gas(10_000_000_000_000);
}
