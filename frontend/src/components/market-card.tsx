import { Badge, Box, Link } from "@chakra-ui/react";
import type { Market } from "@/types";
import NextLink from "next/link";

const MarketCard = ({ market }: { market: Market }) => {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            paddingY="4"
            borderBottom="1px"
            borderColor="gray.300"
            _last={{ borderBottom: 0 }}
        >
            <Link as={NextLink} href={`market/${market.id}`}>
                {market.description}
            </Link>
            <Badge
                colorScheme={market.is_closed ? "red" : "green"}
                fontWeight="bold"
                height="max-content"
            >
                {market.is_closed ? "Closed" : "Open"}
            </Badge>
        </Box>
    );
};

export default MarketCard;
