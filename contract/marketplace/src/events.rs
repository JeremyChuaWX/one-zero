use near_sdk_contract_tools::event;

#[event(
    standard = "x-marketplace",
    version = "0.1.0",
    serde = "near_sdk::serde"
)]
pub enum MarketplaceEvent {
    // ---------- market events ---------- //
    MarketCreated {},
    MarketClosed {},

    // ---------- offer events ---------- //
    OfferCreated {},
    OfferAccepted {},
}
