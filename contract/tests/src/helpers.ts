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

export async function createMarket({
    marketplace,
    marketOwner,
    description,
}: {
    marketplace: NearAccount;
    marketOwner: NearAccount;
    description: string;
}) {
    await marketOwner.call(
        marketplace,
        "create_market",
        { description },
        { attachedDeposit: nearNumberToString(5), gas: MAX_GAS },
    );
}

export async function closeMarket({
    marketplace,
    marketOwner,
    marketId,
    isLong,
}: {
    marketplace: NearAccount;
    marketOwner: NearAccount;
    marketId: number;
    isLong: boolean;
}) {
    await marketOwner.call(
        marketplace,
        "close_market",
        { market_id: marketId, is_long: isLong },
        { gas: MAX_GAS },
    );
}

export async function createOffer({
    marketplace,
    offerMaker,
    marketId,
    isLong,
    amount,
}: {
    marketplace: NearAccount;
    offerMaker: NearAccount;
    marketId: number;
    isLong: boolean;
    amount: number;
}) {
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

export async function acceptOffer({
    marketplace,
    offerAccepter,
    offerId,
}: {
    marketplace: NearAccount;
    offerAccepter: NearAccount;
    offerId: number;
}) {
    await offerAccepter.call(
        marketplace,
        "accept_offer",
        { offer_id: offerId },
        { attachedDeposit: nearNumberToString(4), gas: MAX_GAS },
    );
}

export async function cancelOffer({
    marketplace,
    offerMaker,
    offerId,
}: {
    marketplace: NearAccount;
    offerMaker: NearAccount;
    offerId: number;
}) {
    await offerMaker.call(
        marketplace,
        "cancel_offer",
        { offer_id: offerId },
        { gas: MAX_GAS },
    );
}

export async function getTokenBalance({
    token,
    account,
    worker,
}: {
    token: string;
    account: NearAccount;
    worker: Worker;
}) {
    const tokenAccount = worker.rootAccount.getAccount(token);
    return tokenAccount.view("ft_balance_of", { account_id: account });
}

export async function getRewards({
    token,
    marketId,
    account,
    marketplace,
    amount,
}: {
    token: string;
    marketId: number;
    account: NearAccount;
    marketplace: NearAccount;
    amount: number;
}) {
    const msg = {
        market_id: marketId,
        token_id: token,
    };
    account.call(token, "ft_transfer_call", {
        receiver_id: marketplace,
        amount: nearNumberToString(amount),
        msg: JSON.stringify(msg),
    });
}
