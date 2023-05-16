import type { WalletSelector } from "@near-wallet-selector/core";
import type { Market, Offer } from "~/types";
import { callMethod, viewMethod } from "./rpc-methods";
import { env } from "~/env.mjs";
import { utils } from "near-api-js";

const FIVE_NEAR = "5000000000000000000000000";

const getMarkets = async (selector: WalletSelector) => {
    return (await viewMethod({
        selector,
        contractId: env.NEXT_PUBLIC_MKTPLC_CONTRACT,
        method: "list_markets",
    })) as Market[];
};

const createMarket = async ({
    selector,
    accountId,
    description,
}: {
    selector: WalletSelector;
    accountId: string;
    description: string;
}) => {
    callMethod({
        selector,
        accountId,
        contractId: env.NEXT_PUBLIC_MKTPLC_CONTRACT,
        method: "create_market",
        args: { description },
        partialOptions: { deposit: FIVE_NEAR },
    });
};

const closeMarket = async ({
    selector,
    accountId,
    marketId,
    isLong,
}: {
    selector: WalletSelector;
    accountId: string;
    marketId: number;
    isLong: boolean;
}) => {
    callMethod({
        selector,
        accountId,
        contractId: env.NEXT_PUBLIC_MKTPLC_CONTRACT,
        method: "close_market",
        args: { market_id: marketId, is_long: isLong },
        partialOptions: {},
    });
};

const getOffers = async (selector: WalletSelector) => {
    return (await viewMethod({
        selector,
        contractId: env.NEXT_PUBLIC_MKTPLC_CONTRACT,
        method: "list_offers",
    })) as Offer[];
};

const createOffer = async ({
    selector,
    accountId,
    marketId,
    isLong,
    amount,
}: {
    selector: WalletSelector;
    accountId: string;
    marketId: number;
    isLong: boolean;
    amount: number;
}) => {
    const amountInYocto = utils.format.parseNearAmount(amount.toString());

    if (!amountInYocto) throw Error("cannot parse near amount");

    callMethod({
        selector,
        accountId,
        contractId: env.NEXT_PUBLIC_MKTPLC_CONTRACT,
        method: "create_offer",
        args: { market_id: marketId, is_long: isLong, amount: amountInYocto },
        partialOptions: { deposit: amountInYocto },
    });
};

const acceptOffer = async ({
    selector,
    accountId,
    offerId,
    amount,
}: {
    selector: WalletSelector;
    accountId: string;
    offerId: number;
    amount: number;
}) => {
    const amountInYocto = utils.format.parseNearAmount(amount.toString());

    if (!amountInYocto) throw Error("cannot parse near amount");

    callMethod({
        selector,
        accountId,
        contractId: env.NEXT_PUBLIC_MKTPLC_CONTRACT,
        method: "accept_offer",
        args: { offer_id: offerId },
        partialOptions: { deposit: amountInYocto },
    });
};

const cancelOffer = async ({
    selector,
    accountId,
    offerId,
}: {
    selector: WalletSelector;
    accountId: string;
    offerId: number;
}) => {
    callMethod({
        selector,
        accountId,
        contractId: env.NEXT_PUBLIC_MKTPLC_CONTRACT,
        method: "cancel_offer",
        args: { offer_id: offerId },
    });
};

const transferTokens = async () => {};

export {
    getMarkets,
    createMarket,
    closeMarket,
    getOffers,
    createOffer,
    acceptOffer,
    cancelOffer,
    transferTokens,
};
