import { Market } from "~/types";

type MarketCardProps = {
    market: Market;
};

const MarketCard = ({ market }: MarketCardProps) => {
    return (
        <div className="flex justify-between p-4 w-full rounded-md border-2 border-gray-500">
            <span>{market.description}</span>
            {market.is_closed ? (
                <span className="font-bold text-red-700">closed</span>
            ) : (
                <span className="font-bold text-green-700">open</span>
            )}
        </div>
    );
};

export default MarketCard;
