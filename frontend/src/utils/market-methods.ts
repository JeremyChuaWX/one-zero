import { WalletSelector } from "@near-wallet-selector/core";
import { callMethod, viewMethod } from "./rpc-calls";
import { env } from "~/env.mjs";
import { Market } from "~/types";

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

export { getMarkets, addMarket };
