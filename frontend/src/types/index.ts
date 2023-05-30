type Market = {
    id: number;
    is_closed: boolean;
    is_long: boolean;
    owner_id: string;
    long_token_id: string;
    short_token_id: string;
    description: string;
};

type Offer = {
    id: number;
    market_id: number;
    is_long: boolean;
    account_id: string;
    amount: string;
};

export type { Market, Offer };
