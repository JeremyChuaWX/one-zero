import Link from "next/link";
import { Market } from "~/types";

type MarketCardProps = {
    market: Market;
};

const MarketCard = ({ market }: MarketCardProps) => {
    return (
        <div className="flex justify-between p-4 w-full bg-gray-100 rounded-md outline outline-1 outline-gray-500">
            <Link href={`/markets/${market.id}`}>{market.description}</Link>
            {market.is_closed ? (
                <span className="font-bold text-red-700">closed</span>
            ) : (
                <span className="font-bold text-green-700">open</span>
            )}
        </div>
    );
};

export default MarketCard;
