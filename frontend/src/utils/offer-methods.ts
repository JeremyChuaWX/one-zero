import { WalletSelector } from "@near-wallet-selector/core";
import { callMethod, viewMethod } from "./rpc-calls";
import { env } from "~/env.mjs";
import { Offer } from "~/types";
import { utils } from "near-api-js";

const getOffers = async (selector: WalletSelector) => {
    return (await viewMethod(
        selector,
        env.NEXT_PUBLIC_MKTPLC_CONTRACT,
        "list_offers"
    )) as Offer[];
};

const addOffer = async (
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

export { getOffers, addOffer };
