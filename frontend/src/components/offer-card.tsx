import { Badge, Box, Button, Text } from "@chakra-ui/react";
import type { Offer } from "@/types";
import { formatNearAmount } from "near-api-js/lib/utils/format";

const OfferCard = (
    { offer, acceptEnabled }: { offer: Offer; acceptEnabled: boolean },
) => {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            padding="4"
            borderBottom="1px"
            borderColor="gray.300"
            _last={{ borderBottom: 0 }}
        >
            <Box display="flex" alignItems="center" gap="2">
                <Text>
                    {formatNearAmount(offer.amount)} NEAR
                </Text>
                <Badge
                    colorScheme={offer.is_long ? "green" : "yellow"}
                    fontWeight="bold"
                >
                    {offer.is_long ? "long" : "short"}
                </Badge>
            </Box>
            <Box opacity={acceptEnabled ? "100" : "0"}>
                <Button size="sm" isDisabled={acceptEnabled}>
                    Accept Offer
                </Button>
            </Box>
        </Box>
    );
};

export default OfferCard;
