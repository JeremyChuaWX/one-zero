import type { WalletSelector } from "@near-wallet-selector/core";
import type { Market, Offer } from "@/types";
import { callMethod, viewMethod } from "./rpc-methods";
import { env } from "@/env.mjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const FIVE_NEAR = "5000000000000000000000000";

const getMarketById = async (selector: WalletSelector, marketId: number) => {
    return (await viewMethod({
        selector,
        contractId: env.NEXT_PUBLIC_MKTPLC_CONTRACT,
        method: "get_market",
        args: { market_id: marketId },
    })) as Market;
};

const useGetMarketById = (selector: WalletSelector, marketId: number) => {
    return useQuery({
        queryKey: ["get-market", marketId],
        queryFn: () => getMarketById(selector, marketId),
    });
};

const getMarkets = async (selector: WalletSelector) => {
    return (await viewMethod({
        selector,
        contractId: env.NEXT_PUBLIC_MKTPLC_CONTRACT,
        method: "list_markets",
    })) as Market[];
};

const useGetMarkets = (selector: WalletSelector) => {
    return useQuery({
        queryKey: ["get-markets"],
        queryFn: () => getMarkets(selector),
    });
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

const useCreateMarket = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createMarket,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-markets"] });
        },
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

const useCloseMarket = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: closeMarket,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-markets"] });
        },
    });
};

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

const useGetOffersByMarketId = (selector: WalletSelector, marketId: number) => {
    return useQuery({
        queryKey: ["get-offers", marketId],
        queryFn: () => getOffersByMarketId(selector, marketId),
    });
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
    amount: string;
}) => {
    callMethod({
        selector,
        accountId,
        contractId: env.NEXT_PUBLIC_MKTPLC_CONTRACT,
        method: "create_offer",
        args: { market_id: marketId, is_long: isLong, amount: amount },
        partialOptions: { deposit: amount },
    });
};

const useCreateOffer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createOffer,
        onSuccess: (_, vars) => {
            queryClient.invalidateQueries({
                queryKey: ["get-offers", vars.marketId],
            });
        },
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
    amount: string;
}) => {
    callMethod({
        selector,
        accountId,
        contractId: env.NEXT_PUBLIC_MKTPLC_CONTRACT,
        method: "accept_offer",
        args: { offer_id: offerId },
        partialOptions: { deposit: amount },
    });
};

const useAcceptOffer = () => {
    return useMutation({
        mutationFn: acceptOffer,
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

const useCancelOffer = () => {
    return useMutation({
        mutationFn: cancelOffer,
    });
};

const transferTokens = async () => {};

export {
    acceptOffer,
    cancelOffer,
    closeMarket,
    transferTokens,
    useAcceptOffer,
    useCancelOffer,
    useCloseMarket,
    useCreateMarket,
    useCreateOffer,
    useGetMarketById,
    useGetMarkets,
    useGetOffersByMarketId,
};
