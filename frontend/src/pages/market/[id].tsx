import CreateOfferModal from "@/components/create-offer-modal";
import { useWalletSelector } from "@/contexts/wallet-selector-context";
import { Market } from "@/types";
import { useGetMarketById } from "@/utils/contract-methods";
import {
    Badge,
    Box,
    Card,
    CardBody,
    CardHeader,
    Heading,
    Spinner,
    Stack,
    StackDivider,
    Text,
} from "@chakra-ui/react";
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
            <MarketInfo market={market} />
            <Offers marketId={market.id} />
        </Box>
    );
};

const Offers = ({ marketId }: { marketId: number }) => {
    return (
        <Box display="flex" flexDir="column" gap="4">
            <Box display="flex" justifyContent="space-between">
                <Heading size="md" textTransform="uppercase">
                    Offers
                </Heading>
                <CreateOfferModal marketId={marketId} />
            </Box>
        </Box>
    );
};

const MarketInfo = ({ market }: { market: Market }) => {
    return (
        <Card display="flex" justifyContent="space-between" variant="outline">
            <CardHeader display="flex" justifyContent="space-between">
                <Heading size="md" textTransform="uppercase">
                    Market {market.id}
                </Heading>
                <Badge
                    colorScheme={market.is_closed ? "red" : "green"}
                    fontSize="lg"
                    fontWeight="bold"
                    height="max-content"
                >
                    {market.is_closed ? "Closed" : "Open"}
                </Badge>
            </CardHeader>

            <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                    {Object.keys(market).filter((value) =>
                        !["id", "is_closed", "is_long"].includes(value)
                    ).map((key) => (
                        <Box>
                            <Heading size="xs" textTransform="uppercase">
                                {key}
                            </Heading>
                            <Text>{market[key as keyof Market]}</Text>
                        </Box>
                    ))}
                </Stack>
            </CardBody>
        </Card>
    );
};

export default MarketPage;
