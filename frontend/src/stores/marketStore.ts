import { create } from "zustand";
import type { Market } from "~/types";
import type { WalletSelector } from "@near-wallet-selector/core";
import { env } from "~/env.mjs";
import { CodeResult } from "near-api-js/lib/providers/provider";
import { providers } from "near-api-js";

type MarketStore = {
    markets: Market[];
    getMarkets: (selector: WalletSelector) => Promise<void>;
};

const useMarketStore = create<MarketStore>()((set) => ({
    markets: [],
    getMarkets: async (selector) => {
        const { network } = selector.options;
        const provider = new providers.JsonRpcProvider({
            url: network.nodeUrl,
        });

        const res = await provider.query<CodeResult>({
            request_type: "call_function",
            account_id: env.NEXT_PUBLIC_MKTPLC_CONTRACT,
            method_name: "list_markets",
            args_base64: "",
            finality: "optimistic",
        });

        set({
            markets: JSON.parse(Buffer.from(res.result).toString()) as Market[],
        });
    },
}));

export default useMarketStore;
