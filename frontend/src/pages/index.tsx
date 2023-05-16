import { type NextPage } from "next";
import { type FormEventHandler, useEffect, useState } from "react";
import { useWalletSelector } from "~/contexts/WalletSelectorContext";
import type { Offer, Market } from "~/types";
import { getMarkets, createMarket } from "~/utils/contract-methods";
import { getOffers, createOffer } from "~/utils/contract-methods";

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
        const target = e.target as typeof e.target & {
            description: { value: string };
        };
        await createMarket({
            selector,
            accountId,
            description: target.description.value,
        });
    };

    const addOfferOnSumbit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        if (!accountId) throw Error("not signed in");
        const target = e.target as typeof e.target & {
            marketId: { value: string };
            isLong: { checked: boolean };
            amount: { value: string };
        };
        await createOffer({
            selector,
            accountId,
            marketId: parseInt(target.marketId.value),
            isLong: target.isLong.checked,
            amount: parseInt(target.amount.value),
        });
    };

    return (
        <>
            <div className="flex gap-4 items-center">
                <form
                    onSubmit={addMarketOnSumbit}
                    className="flex flex-col gap-2 w-full"
                >
                    <label className="font-bold">
                        Market Description
                        <input type="text" name="description" />
                    </label>
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
                    <label className="font-bold">
                        Market ID
                        <input type="number" name="marketId" />
                    </label>
                    <label className="font-bold">
                        is long
                        <input type="checkbox" name="isLong" />
                    </label>
                    <label className="font-bold">
                        Amount offered
                        <input type="number" name="amount" />
                    </label>
                    <button
                        type="submit"
                        className="py-1 px-4 text-gray-200 bg-gray-900 rounded-md"
                    >
                        Add Offer
                    </button>
                </form>
            </div>
            <h1>Markets</h1>
            {markets.map((market) => (
                <div key={market.id}>
                    {`${market.id}: ${market.description}`}
                </div>
            ))}
            <h1>Offers</h1>
            {offers.map((offer) => (
                <div key={offer.id}>
                    {`${offer.id}: market ${offer.market_id} for ${offer.amount} (${offer.is_long})`}
                </div>
            ))}
        </>
    );
};

export default Home;
