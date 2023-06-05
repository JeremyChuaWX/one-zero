import { Badge, Box, Text } from "@chakra-ui/react";
import type { Offer } from "@/types";
import { utils } from "near-api-js";
import AcceptOfferModal from "./accept-offer-modal";

const OfferCard = (
    { offer, acceptDisabled }: { offer: Offer; acceptDisabled: boolean },
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
                <Box display="flex" flexDir="column">
                    <Box display="flex" alignItems="center" gap="2">
                        <Text>
                            {utils.format.formatNearAmount(offer.amount)} NEAR
                        </Text>
                        <Badge
                            colorScheme={offer.is_long ? "green" : "yellow"}
                            fontWeight="bold"
                        >
                            {offer.is_long ? "long" : "short"}
                        </Badge>
                    </Box>
                    <Text fontSize="xs">{offer.account_id}</Text>
                </Box>
            </Box>
            <AcceptOfferModal offer={offer} disabled={acceptDisabled} />
        </Box>
    );
};

export default OfferCard;
