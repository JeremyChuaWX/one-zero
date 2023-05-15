import { NearAccount, parse, Worker } from "near-workspaces";

export const MAX_GAS = parse("300 Tgas");

export type Market = {
    id: number;
    owner_id: string;
    description: string;
    is_closed: boolean;
    is_long: boolean;
    long_token_id: string;
    short_token_id: string;
};

export type Offer = {
    id: number;
    market_id: number;
    account_id: string;
    is_long: boolean;
    amount: string;
};

export function nearNumberToString(n: number): string {
    return parse(`${n} N`).toString();
}

export async function listMarkets(marketplace: NearAccount): Promise<Market[]> {
    return await marketplace.view("list_markets");
}

export async function listOffers(marketplace: NearAccount): Promise<Offer[]> {
    return await marketplace.view("list_offers");
}

export async function createMarket(
    marketplace: NearAccount,
    marketOwner: NearAccount,
    description: string,
) {
    await marketOwner.call(
        marketplace,
        "create_market",
        { description },
        { attachedDeposit: nearNumberToString(5), gas: MAX_GAS },
    );
}

export async function closeMarket(
    marketplace: NearAccount,
    marketOwner: NearAccount,
    marketId: number,
    isLong: boolean,
) {
    await marketOwner.call(
        marketplace,
        "close_market",
        { market_id: marketId, is_long: isLong },
        { gas: MAX_GAS },
    );
}

export async function createOffer(
    marketplace: NearAccount,
    offerMaker: NearAccount,
    marketId: number,
    isLong: boolean,
    amount: number,
) {
    await offerMaker.call(
        marketplace,
        "create_offer",
        {
            market_id: marketId,
            is_long: isLong,
            amount: nearNumberToString(amount),
        },
        { attachedDeposit: nearNumberToString(amount + 1), gas: MAX_GAS },
    );
}

export async function acceptOffer(
    marketplace: NearAccount,
    offerAccepter: NearAccount,
    offerId: number,
) {
    await offerAccepter.call(
        marketplace,
        "accept_offer",
        { offer_id: offerId },
        { attachedDeposit: nearNumberToString(4), gas: MAX_GAS },
    );
}

export async function getTokenBalance(
    token: string,
    account: NearAccount,
    worker: Worker | undefined,
) {
    if (worker === undefined) throw Error("Worker undefined");
    const tokenAccount = worker.rootAccount.getAccount(token);
    return tokenAccount.view("ft_balance_of", { account_id: account });
}
