import { Badge, Box, Button, Text } from "@chakra-ui/react";
import type { Offer } from "@/types";
import { formatNearAmount } from "near-api-js/lib/utils/format";

const OfferCard = (
    { offer, isAccount, isOwner }: {
        offer: Offer;
        isAccount: boolean;
        isOwner: boolean;
    },
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
            <Box>
                <Text>
                    {formatNearAmount(offer.amount)}N
                </Text>
                <Badge
                    colorScheme={offer.is_long ? "green" : "yellow"}
                    fontWeight="bold"
                >
                    {offer.is_long ? "long" : "short"}
                </Badge>
            </Box>
            {!(isOwner || isAccount) &&
                (
                    <Button size="sm" isDisabled={isOwner || isAccount}>
                        Accept Offer
                    </Button>
                )}
        </Box>
    );
};

export default OfferCard;
