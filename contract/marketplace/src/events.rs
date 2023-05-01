use near_sdk::json_types::U128;
use near_sdk_contract_tools::event;

#[event(
    standard = "x-marketplace",
    version = "0.1.0",
    serde = "near_sdk::serde"
)]
pub enum MarketplaceEvent {
    // ---------- market events ---------- //
    MarketCreated {
        id: u32,
        description: String,
    },
    MarketClosed {
        id: u32,
        description: String,
        is_long: bool,
    },

    // ---------- offer events ---------- //
    OfferCreated {
        id: u32,
        market: u32,
        amount: U128,
        is_long: bool,
    },
    OfferAccepted {
        id: u32,
        market: u32,
        amount: U128,
        is_long: bool,
    },
}
