import { type NextPage } from "next";
import { CreateMarketDialog } from "~/components/CreateMarketDialog";
import MarketCard from "~/components/MarketCard";
import MarketLoadingSkeleton from "~/components/MarketsLoadingSkeleton";
import { useWalletSelector } from "~/contexts/WalletSelectorContext";
import { useGetMarkets } from "~/utils/contract-methods";

const Home: NextPage = () => {
    const { selector } = useWalletSelector();
    const { data: markets, isLoading } = useGetMarkets(selector);

    return (
        <div className="flex gap-8 h-full">
            <div className="flex flex-col gap-4 pr-4 w-min whitespace-nowrap border-r border-gray-300">
                <CreateMarketDialog />
            </div>
            <div className="w-full">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold">Markets</h1>
                </div>
                {isLoading ? (
                    <MarketLoadingSkeleton />
                ) : (
                    <div className="flex flex-col gap-4 items-center">
                        {markets?.map((market) => (
                            <MarketCard key={market.id} market={market} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
