import type { WalletSelector } from "@near-wallet-selector/core";
import type { Market, Offer } from "@/types";
import { callMethod, viewMethod } from "./rpc-methods";
import { env } from "@/env.mjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const FIVE_NEAR = "5000000000000000000000000";

const getMarket = async (selector: WalletSelector, marketId: number) => {
    return (await viewMethod({
        selector,
        contractId: env.NEXT_PUBLIC_MKTPLC_CONTRACT,
        method: "get_market",
        args: { market_id: marketId },
    })) as Market;
};

const useGetMarket = (selector: WalletSelector, marketId: number) => {
    return useQuery({
        queryKey: ["get-market", marketId],
        queryFn: () => getMarket(selector, marketId),
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

const closeMarket = async (
    { selector, accountId, market, isLong }: {
        selector: WalletSelector;
        accountId: string;
        market: Market;
        isLong: boolean;
    },
) => {
    callMethod({
        selector,
        accountId,
        contractId: env.NEXT_PUBLIC_MKTPLC_CONTRACT,
        method: "close_market",
        args: { market_id: market.id, is_long: isLong },
        partialOptions: {},
    });
};

const useCloseMarket = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: closeMarket,
        onSuccess: (_, vars) => {
            queryClient.invalidateQueries({ queryKey: ["get-markets"] });
            queryClient.invalidateQueries({
                queryKey: ["get-market", vars.market.id],
            });
        },
    });
};

const getOffersByMarket = async (selector: WalletSelector, market: Market) => {
    return (await viewMethod({
        selector,
        contractId: env.NEXT_PUBLIC_MKTPLC_CONTRACT,
        method: "list_offers_by_market",
        args: { market_id: market.id },
    })) as Offer[];
};

const useGetOffersByMarket = (selector: WalletSelector, market: Market) => {
    return useQuery({
        queryKey: ["get-offers", market.id],
        queryFn: () => getOffersByMarket(selector, market),
    });
};

const createOffer = async ({
    selector,
    accountId,
    market,
    isLong,
    amount,
}: {
    selector: WalletSelector;
    accountId: string;
    market: Market;
    isLong: boolean;
    amount: string;
}) => {
    callMethod({
        selector,
        accountId,
        contractId: env.NEXT_PUBLIC_MKTPLC_CONTRACT,
        method: "create_offer",
        args: { market_id: market.id, is_long: isLong, amount: amount },
        partialOptions: { deposit: amount },
    });
};

const useCreateOffer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createOffer,
        onSuccess: (_, vars) => {
            queryClient.invalidateQueries({
                queryKey: ["get-market", vars.market.id],
            });
        },
    });
};

const acceptOffer = async ({ selector, accountId, offer }: {
    selector: WalletSelector;
    accountId: string;
    offer: Offer;
}) => {
    callMethod({
        selector,
        accountId,
        contractId: env.NEXT_PUBLIC_MKTPLC_CONTRACT,
        method: "accept_offer",
        args: { offer_id: offer.id },
        partialOptions: { deposit: offer.amount },
    });
};

const useAcceptOffer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: acceptOffer,
        onSuccess: (_, vars) => {
            queryClient.invalidateQueries({
                queryKey: ["get-market", vars.offer.market_id],
            });
        },
    });
};

const cancelOffer = async ({ selector, accountId, offer }: {
    selector: WalletSelector;
    accountId: string;
    offer: Offer;
}) => {
    callMethod({
        selector,
        accountId,
        contractId: env.NEXT_PUBLIC_MKTPLC_CONTRACT,
        method: "cancel_offer",
        args: { offer_id: offer.id },
    });
};

const useCancelOffer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cancelOffer,
        onSuccess: (_, vars) => {
            queryClient.invalidateQueries({
                queryKey: ["get-market", vars.offer.market_id],
            });
        },
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
    useGetMarket,
    useGetMarkets,
    useGetOffersByMarket,
};
