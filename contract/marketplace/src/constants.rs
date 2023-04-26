use near_sdk::Gas;

pub const TOKEN_CONTRACT: &[u8] =
    include_bytes!("../../target/wasm32-unknown-unknown/release/token.wasm");
pub const ZERO: u128 = 0;
pub const GAS: Gas = Gas(50_000_000_000_000);
