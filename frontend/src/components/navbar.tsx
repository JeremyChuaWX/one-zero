import { useWalletSelector } from "@/contexts/wallet-selector-context";
import { Box, Button, ButtonGroup, Heading, Link } from "@chakra-ui/react";
import { MouseEventHandler } from "react";
import NextLink from "next/link";

const AuthButton = () => {
    const { modal, selector, accountId } = useWalletSelector();

    const signInOnClick: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        modal.show();
    };

    const signOutOnClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
        e.preventDefault();
        const wallet = await selector.wallet();
        await wallet.signOut();
    };

    return (
        <ButtonGroup size="sm">
            <Button onClick={signInOnClick}>
                {accountId ?? "Connect Wallet"}
            </Button>
            {accountId !== null && (
                <Button onClick={signOutOnClick}>Sign Out</Button>
            )}
        </ButtonGroup>
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
            borderBottom="1px"
            borderColor="gray.300"
        >
            <Link as={NextLink} href="/">
                <Heading size="md">One-Zero</Heading>
            </Link>
            <AuthButton />
        </Box>
    );
};

export default Navbar;
