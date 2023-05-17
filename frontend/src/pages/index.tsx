import { type NextPage } from "next";
import { useEffect, useState } from "react";
import MarketCard from "~/components/MarketCard";
import { useWalletSelector } from "~/contexts/WalletSelectorContext";
import { type Market } from "~/types";
import { getMarkets } from "~/utils/contract-methods";

const Home: NextPage = () => {
    const { selector } = useWalletSelector();
    const [markets, setMarkets] = useState<Market[]>([]);

    useEffect(() => {
        (async () => {
            const newMarkets = await getMarkets(selector);
            setMarkets(newMarkets);
        })();
    }, []);

    return (
        <div className="flex gap-8">
            <div className="flex flex-col gap-4 w-min whitespace-nowrap">
                <button className="py-1 px-4 text-gray-200 bg-gray-900 rounded-md">
                    Create Market
                </button>
                <button className="py-1 px-4 text-gray-200 bg-gray-900 rounded-md">
                    Create Offer
                </button>
            </div>
            <div className="w-full">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold">Markets</h1>
                </div>
                <div className="flex flex-col gap-4 items-center">
                    {markets.map((market) => (
                        <MarketCard key={market.id} market={market} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
