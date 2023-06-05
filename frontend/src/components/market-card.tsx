import { Box, Link } from "@chakra-ui/react";
import type { Market } from "@/types";
import NextLink from "next/link";

const MarketCard = ({ market }: { market: Market }) => {
    return (
        <Box
            padding="4"
            borderBottom="1px"
            borderColor="gray.300"
            _last={{ borderBottom: 0 }}
        >
            <Link as={NextLink} href={`market/${market.id}`}>
                {market.description}
            </Link>
        </Box>
    );
};

export default MarketCard;
