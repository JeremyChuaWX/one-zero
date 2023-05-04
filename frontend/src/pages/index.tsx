import { type NextPage } from "next";
import { type FormEventHandler, useEffect, useState } from "react";
import { useWalletSelector } from "~/contexts/WalletSelectorContext";
import type { Offer, Market } from "~/types";
import { getMarkets, addMarket } from "~/utils/market-methods";
import { addOffer, getOffers } from "~/utils/offer-methods";

const Home: NextPage = () => {
    const { selector, accountId } = useWalletSelector();
    const [markets, setMarkets] = useState<Market[]>([]);
    const [offers, setOffers] = useState<Offer[]>([]);

    useEffect(() => {
        (async () => {
            const newMarkets = await getMarkets(selector);
            setMarkets(newMarkets);

            const newOffers = await getOffers(selector);
            setOffers(newOffers);
        })();
    }, []);

    const addMarketOnSumbit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        if (!accountId) throw Error("not signed in");
        await addMarket(selector, accountId, "testing");
    };

    const addOfferOnSumbit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        if (!accountId) throw Error("not signed in");
        await addOffer(selector, accountId, 0, true, 1);
    };

    return (
        <>
            <div className="flex gap-4 items-center">
                <form
                    onSubmit={addMarketOnSumbit}
                    className="flex flex-col gap-2 w-full"
                >
                    <label className="font-bold">Market Description</label>
                    <input type="text" />
                    <button
                        type="submit"
                        className="py-1 px-4 text-gray-200 bg-gray-900 rounded-md"
                    >
                        Add Market
                    </button>
                </form>
                <form
                    onSubmit={addOfferOnSumbit}
                    className="flex flex-col gap-2 w-full"
                >
                    <button
                        type="submit"
                        className="py-1 px-4 text-gray-200 bg-gray-900 rounded-md"
                    >
                        Add Offer
                    </button>
                </form>
            </div>
            {markets.map((market) => (
                <div key={market.id}>
                    {market.id}: {market.description}
                </div>
            ))}
        </>
    );
};

export default Home;
