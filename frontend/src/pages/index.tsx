import MarketCard from "@/components/market-card";
import { useWalletSelector } from "@/contexts/wallet-selector-context";
import { useGetMarkets } from "@/utils/contract-methods";
import { Box, Button, ButtonGroup, Heading, Spinner } from "@chakra-ui/react";
import CreateMarketModal from "@/components/add-market-modal";

const Home = () => {
    const { selector } = useWalletSelector();

    const { data: markets, isLoading } = useGetMarkets(selector);

    return (
        <Box display="flex" flexDir="column" gap="8">
            <ButtonGroup variant="outline">
                <CreateMarketModal />
                <Button>Create Offer</Button>
            </ButtonGroup>
            <Box>
                <Heading size="md" marginBottom="4">
                    Markets
                </Heading>
                {isLoading ? (
                    <Box display="flex" flexDir="column" alignItems="center">
                        <Spinner size="lg" />
                    </Box>
                ) : (
                    <Box display="flex" flexDir="column">
                        {markets?.map((market, idx) => (
                            <MarketCard market={market} key={idx} />
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default Home;
