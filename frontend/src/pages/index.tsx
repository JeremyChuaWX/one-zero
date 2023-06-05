import MarketCard from "@/components/market-card";
import { useWalletSelector } from "@/contexts/wallet-selector-context";
import { useGetMarkets } from "@/utils/contract-methods";
import { Box, Heading, Spinner } from "@chakra-ui/react";
import CreateMarketModal from "@/components/create-market-modal";

const Home = () => {
    const { selector } = useWalletSelector();

    const { data: markets, isLoading } = useGetMarkets(selector);

    return (
        <Box display="flex" flexDir="column" gap="4">
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <Heading size="md" textTransform="uppercase">
                    Markets
                </Heading>
                <CreateMarketModal />
            </Box>

            <Box display="flex" flexDir="column">
                {isLoading
                    ? (
                        <Spinner
                            size="lg"
                            alignSelf="center"
                            margin="4"
                            color="gray.300"
                        />
                    )
                    : (
                        markets?.map((market, idx) => (
                            <MarketCard market={market} key={idx} />
                        ))
                    )}
            </Box>
        </Box>
    );
};

export default Home;
