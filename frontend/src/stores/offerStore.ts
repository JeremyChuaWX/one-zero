import { create } from "zustand";
import type { Offer } from "~/types";
import type { WalletSelector } from "@near-wallet-selector/core";
import { env } from "~/env.mjs";
import { CodeResult } from "near-api-js/lib/providers/provider";
import { providers } from "near-api-js";

type OfferStore = {
    offers: Offer[];
    getOffers: (selector: WalletSelector) => Promise<void>;
};

const useOfferStore = create<OfferStore>()((set) => ({
    offers: [],
    getOffers: async (selector) => {
        const { network } = selector.options;
        const provider = new providers.JsonRpcProvider({
            url: network.nodeUrl,
        });

        const res = await provider.query<CodeResult>({
            request_type: "call_function",
            account_id: env.NEXT_PUBLIC_MKTPLC_CONTRACT,
            method_name: "list_offers",
            args_base64: "",
            finality: "optimistic",
        });

        set({
            offers: JSON.parse(Buffer.from(res.result).toString()) as Offer[],
        });
    },
}));

export default useOfferStore;
