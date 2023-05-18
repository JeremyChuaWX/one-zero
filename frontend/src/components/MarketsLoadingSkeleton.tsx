const MarketCardSkeleton = () => {
    return (
        <div className="flex justify-between p-4 w-full h-14 bg-gray-300 rounded-md border-2 border-gray-300"></div>
    );
};

const MarketLoadingSkeleton = () => {
    return (
        <div className="flex flex-col gap-4 items-center w-full animate-pulse">
            <MarketCardSkeleton />
            <MarketCardSkeleton />
            <MarketCardSkeleton />
        </div>
    );
};

export default MarketLoadingSkeleton;
