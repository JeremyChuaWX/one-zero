pub const TOKEN_BYTES: &[u8] =
    include_bytes!("../../target/wasm32-unknown-unknown/release/token.wasm");
pub const EXTRA_BYTES: u128 = 1000;
pub const ZERO: u128 = 0;

pub mod gas {
    use near_sdk::Gas;

    pub const INIT_TOKEN: Gas = Gas(5_000_000_000_000);
    pub const CREATE_MARKET: Gas = Gas(5_000_000_000_000);
}
