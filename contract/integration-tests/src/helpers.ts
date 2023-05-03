import { NearAccount, parseNEAR, tGas } from "near-workspaces";

const MAX_GAS = tGas(300);

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
    account_id: string;
    is_long: boolean;
    amount: string;
};

function numberToNEAR(n: number): string {
    return parseNEAR(`${n} N`).toString();
}

async function listMarkets(marketplace: NearAccount): Promise<Market[]> {
    return await marketplace.view("list_markets");
}

async function listOffers(marketplace: NearAccount): Promise<Offer[]> {
    return await marketplace.view("list_offers");
}

async function createMarket(
    marketplace: NearAccount,
    marketOwner: NearAccount,
    description: string,
) {
    await marketOwner.call(
        marketplace,
        "create_market",
        { description },
        { attachedDeposit: numberToNEAR(5), gas: MAX_GAS },
    );
}

async function createOffer(
    marketplace: NearAccount,
    offerMaker: NearAccount,
    market_id: number,
    isLong: boolean,
    amount: number,
) {
    await offerMaker.call(
        marketplace,
        "create_offer",
        {
            market_id,
            is_long: isLong,
            amount: numberToNEAR(amount),
        },
        {
            attachedDeposit: numberToNEAR(amount + 1),
            gas: MAX_GAS,
        },
    );
}

export {
    Market,
    Offer,
    numberToNEAR,
    listMarkets,
    listOffers,
    createMarket,
    createOffer,
};
