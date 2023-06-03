import { useWalletSelector } from "@/contexts/wallet-selector-context";
import { useGetMarketById } from "@/utils/contract-methods";
import { Box, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";

const MarketPage = () => {
    const router = useRouter();
    const { id } = router.query;

    const { selector } = useWalletSelector();

    const { data: market, isLoading } = useGetMarketById(
        selector,
        parseInt(id as string)
    );

    if (isLoading) return <Spinner />;

    return <Box>{market === undefined ? "waiting" : market.description}</Box>;
};

export default MarketPage;
