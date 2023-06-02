import { useWalletSelector } from "@/contexts/wallet-selector-context";
import { Box, Button, Heading, Link } from "@chakra-ui/react";
import { MouseEventHandler } from "react";
import NextLink from "next/link";

const AuthButton = () => {
    const { modal, accountId } = useWalletSelector();

    const signInOnClick: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        modal.show();
    };

    return (
        <Button onClick={signInOnClick} size="sm">
            {accountId ?? "Connect Wallet"}
        </Button>
    );
};

const Navbar = () => {
    return (
        <Box
            display="flex"
            paddingX="8"
            paddingY="4"
            alignItems="center"
            justifyContent="space-between"
        >
            <Link as={NextLink} href="/">
                <Heading size="md">One-Zero</Heading>
            </Link>
            <Box display="flex" gap="4" alignItems="center">
                <Link as={NextLink} href="/">
                    Markets
                </Link>
                <Link as={NextLink} href="/">
                    Offers
                </Link>
                <AuthButton />
            </Box>
        </Box>
    );
};

export default Navbar;
