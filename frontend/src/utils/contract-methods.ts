import type { WalletSelector } from "@near-wallet-selector/core";
import type { Market, Offer } from "@/types";
import { callMethod, viewMethod } from "./rpc-methods";
import { env } from "@/env.mjs";
import { utils } from "near-api-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const FIVE_NEAR = "5000000000000000000000000";

/**
 * Calls `get_market` method on the Marketplace smart contract
 */
const getMarketById = async (selector: WalletSelector, marketId: number) => {
    return (await viewMethod({
        selector,
        contractId: env.NEXT_PUBLIC_MKTPLC_CONTRACT,
        method: "get_market",
        args: { market_id: marketId },
    })) as Market;
};

/**
 * Query hook for `getMarketById`
 */
const useGetMarketById = (selector: WalletSelector, marketId: number) => {
    return useQuery({
        queryKey: ["get-market", marketId],
        queryFn: () => getMarketById(selector, marketId),
    });
};

/**
 * Calls `list_markets` method on the Marketplace smart contract
 */
const getMarkets = async (selector: WalletSelector) => {
    return (await viewMethod({
        selector,
        contractId: env.NEXT_PUBLIC_MKTPLC_CONTRACT,
        method: "list_markets",
    })) as Market[];
};

/**
 * Query hook for `getMarkets`
 */
const useGetMarkets = (selector: WalletSelector) => {
    return useQuery({
        queryKey: ["get-markets"],
        queryFn: () => getMarkets(selector),
    });
};

/**
 * Calls `create_market` method on the Marketplace smart contract
 */
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

/**
 * Mutation hook for `createMarket`
 */
const useCreateMarket = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createMarket,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-markets"] });
        },
    });
};

/**
 * Calls `close_market` method on the Marketplace smart contract
 */
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

/**
 * Mutation hook for `closeMarket`
 */
const useCloseMarket = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: closeMarket,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-markets"] });
        },
    });
};

/**
 * Calls `list_offers` method on the Marketplace smart contract
 */
const getOffers = async (selector: WalletSelector) => {
    return (await viewMethod({
        selector,
        contractId: env.NEXT_PUBLIC_MKTPLC_CONTRACT,
        method: "list_offers",
    })) as Offer[];
};

/**
 * Query hook for `getOffers`
 */
const useGetOffers = (selector: WalletSelector) => {
    return useQuery({
        queryKey: ["get-offers"],
        queryFn: () => getOffers(selector),
    });
};

/**
 * Calls `list_offers_by_market` method on the Marketplace smart contract
 */
const getOffersByMarketId = async (
    selector: WalletSelector,
    marketId: number,
) => {
    return (await viewMethod({
        selector,
        contractId: env.NEXT_PUBLIC_MKTPLC_CONTRACT,
        method: "list_offers_by_market",
        args: { market_id: marketId },
    })) as Offer[];
};

/**
 * Query hook for `getOffersByMarketId`
 */
const useGetOffersByMarketId = (selector: WalletSelector, marketId: number) => {
    return useQuery({
        queryKey: ["get-offers", marketId],
        queryFn: () => getOffersByMarketId(selector, marketId),
    });
};

type CreateOfferArgs = {
    selector: WalletSelector;
    accountId: string;
    marketId: number;
    isLong: boolean;
    amount: number;
};

/**
 * Calls `create_offer` method on the Marketplace smart contract
 */
const createOffer = async ({
    selector,
    accountId,
    marketId,
    isLong,
    amount,
}: CreateOfferArgs) => {
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

/**
 * Mutation hook for `createOffer`
 */
const useCreateOffer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (createOfferArgs: CreateOfferArgs) =>
            createOffer(createOfferArgs),
        onSuccess: (_, vars) => {
            queryClient.invalidateQueries({ queryKey: ["get-offers"] });
            queryClient.invalidateQueries({
                queryKey: ["get-offers", vars.marketId],
            });
        },
    });
};

/**
 * Calls `accept_offer` method on the Marketplace smart contract
 */
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

/**
 * Calls `cancel_offer` method on the Marketplace smart contract
 */
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

/**
 * Transfers FT from account to marketplace
 * Rewards are distributed according to result and FT transferred
 */
const transferTokens = async () => {};

export {
    acceptOffer,
    cancelOffer,
    closeMarket,
    transferTokens,
    useCloseMarket,
    useCreateMarket,
    useCreateOffer,
    useGetMarketById,
    useGetMarkets,
    useGetOffers,
    useGetOffersByMarketId,
};
