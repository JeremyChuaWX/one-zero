import CreateOfferModal from "@/components/create-offer-modal";
import OfferCard from "@/components/offer-card";
import { useWalletSelector } from "@/contexts/wallet-selector-context";
import { Market } from "@/types";
import {
    useGetMarketById,
    useGetOffersByMarketId,
} from "@/utils/contract-methods";
import {
    Badge,
    Box,
    Button,
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
                <Spinner size="lg" color="gray.300" />
            </Box>
        );
    }

    return (
        <Box display="flex" flexDir="column" gap="4">
            <MarketInfo market={market} />
            <MarketOffers market={market} />
        </Box>
    );
};

const MarketOffers = ({ market }: { market: Market }) => {
    const { accountId, selector } = useWalletSelector();

    const { data: offers, isLoading } = useGetOffersByMarketId(
        selector,
        market.id,
    );

    if (isLoading || !offers) {
        return (
            <Box display="flex" justifyContent="center">
                <Spinner size="lg" color="gray.300" />
            </Box>
        );
    }

    return (
        <Box display="flex" flexDir="column" gap="4">
            <Box display="flex" justifyContent="space-between">
                <Heading size="md" textTransform="uppercase">
                    Offers
                </Heading>
                <CreateOfferModal
                    marketId={market.id}
                    disabled={market.is_closed}
                />
            </Box>
            <Box display="flex" flexDir="column">
                {offers.map((offer, idx) => (
                    <OfferCard
                        key={idx}
                        offer={offer}
                        isOwner={accountId === market.owner_id}
                        isAccount={accountId === offer.account_id}
                    />
                ))}
            </Box>
        </Box>
    );
};

const MarketInfo = ({ market }: { market: Market }) => {
    const { accountId } = useWalletSelector();

    return (
        <Card display="flex" variant="outline">
            <CardHeader
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <Box display="flex" gap="4" alignItems="center">
                    <Heading size="md" textTransform="uppercase">
                        Market {market.id}
                    </Heading>
                    <Badge
                        colorScheme={market.is_closed ? "red" : "green"}
                        fontSize="md"
                        fontWeight="bold"
                        height="max-content"
                    >
                        {market.is_closed ? "Closed" : "Open"}
                    </Badge>
                </Box>
                {accountId === market.owner_id && (
                    <Button variant="outline">Close Market</Button>
                )}
            </CardHeader>

            <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                    {Object.keys(market).filter((value) =>
                        !["id", "is_closed", "is_long"].includes(value)
                    ).map((key) => (
                        <Box key={key}>
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
