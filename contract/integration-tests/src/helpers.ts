import { NearAccount } from "near-workspaces";

type Market = {
    id: number;
    owner_id: string;
    description: string;
    is_closed: boolean;
    is_long: boolean;
    long_token_id: string;
    short_token_id: string;
};

type Offer = {
    id: number;
    market_id: number;
};

async function listMarkets(marketplace: NearAccount): Promise<Market[]> {
    return await marketplace.view("list_markets");
}

async function listOffers(marketplace: NearAccount): Promise<Offer[]> {
    return await marketplace.view("list_offers");
}

export { Market, Offer, listMarkets, listOffers };
