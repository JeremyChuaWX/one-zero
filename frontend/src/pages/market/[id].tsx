import CreateOfferModal from "@/components/create-offer-modal";
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
        parseInt(id as string),
    );

    if (isLoading || !market) {
        return (
            <Box display="flex" justifyContent="center">
                <Spinner size="lg" />
            </Box>
        );
    }

    return (
        <Box display="flex" flexDir="column" gap="4">
            <Box>
                {market !== undefined &&
                    Object.entries(market).map(([key, value]) => (
                        <Text key={key}>
                            {key} : {value}
                        </Text>
                    ))}
            </Box>
            <CreateOfferModal marketId={market.id} />
        </Box>
    );
};

export default MarketPage;
