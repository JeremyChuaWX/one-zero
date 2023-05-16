import type { WalletSelector } from "@near-wallet-selector/core";
import type { Market, Offer } from "~/types";
import { callMethod, viewMethod } from "./rpc-methods";
import { env } from "~/env.mjs";
import { utils } from "near-api-js";

const getMarkets = async (selector: WalletSelector) => {
    return (await viewMethod(
        selector,
        env.NEXT_PUBLIC_MKTPLC_CONTRACT,
        "list_markets"
    )) as Market[];
};

const addMarket = async (
    selector: WalletSelector,
    accountId: string,
    description: string
) => {
    callMethod(
        selector,
        accountId,
        env.NEXT_PUBLIC_MKTPLC_CONTRACT,
        "create_market",
        { description },
        { deposit: "5000000000000000000000000" }
    );
};

const closeMarket = async () => {};

const getOffers = async (selector: WalletSelector) => {
    return (await viewMethod(
        selector,
        env.NEXT_PUBLIC_MKTPLC_CONTRACT,
        "list_offers"
    )) as Offer[];
};

const createOffer = async (
    selector: WalletSelector,
    accountId: string,
    marketId: number,
    isLong: boolean,
    amount: number
) => {
    const amountInYocto = utils.format.parseNearAmount(amount.toString());

    if (!amountInYocto) throw Error("cannot parse near amount");

    callMethod(
        selector,
        accountId,
        env.NEXT_PUBLIC_MKTPLC_CONTRACT,
        "create_offer",
        { market_id: marketId, is_long: isLong, amount: amountInYocto },
        { deposit: amountInYocto }
    );
};

const acceptOffer = async () => {};

const cancelOffer = async () => {};

const transferTokens = async () => {};

export {
    getMarkets,
    addMarket,
    closeMarket,
    getOffers,
    createOffer,
    acceptOffer,
    cancelOffer,
    transferTokens,
};
