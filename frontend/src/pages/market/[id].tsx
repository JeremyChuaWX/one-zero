import CloseMarketModal from "@/components/close-market-modal";
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
            <MarketInfoCard market={market} />
            <MarketOffersList market={market} />
        </Box>
    );
};

const MarketInfoCard = ({ market }: { market: Market }) => {
    const { accountId } = useWalletSelector();

    const isOwner = accountId === market.owner_id;

    return (
        <Card display="flex" variant="outline">
            <CardHeader
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <Box display="flex" gap="2" alignItems="center">
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
                <CloseMarketModal
                    marketId={market.id}
                    disabled={!isOwner || market.is_closed}
                />
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

const MarketOffersList = ({ market }: { market: Market }) => {
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
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Heading size="md" textTransform="uppercase">
                    Offers
                </Heading>
                <CreateOfferModal
                    marketId={market.id}
                    disabled={market.is_closed || !accountId}
                />
            </Box>
            <Box display="flex" flexDir="column">
                {offers.map((offer, idx) => (
                    <OfferCard
                        key={idx}
                        offer={offer}
                        acceptDisabled={!accountId ||
                            (accountId === market.owner_id) ||
                            (accountId === offer.account_id)}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default MarketPage;
