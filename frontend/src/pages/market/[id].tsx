import { useWalletSelector } from "@/contexts/wallet-selector-context";
import { useGetMarketById } from "@/utils/contract-methods";
import { Box, Spinner, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

const MarketPage = () => {
    const router = useRouter();
    const { id } = router.query;

    const { selector } = useWalletSelector();

    const { data: market, isLoading } = useGetMarketById(
        selector,
        parseInt(id as string)
    );

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center">
                <Spinner size="xl" />
            </Box>
        );
    }

    return (
        <Box>
            {market !== undefined &&
                Object.entries(market).map(([key, value]) => (
                    <Text>
                        {key} : {value}
                    </Text>
                ))}
        </Box>
    );
};

export default MarketPage;
