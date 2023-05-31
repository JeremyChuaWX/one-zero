import { useWalletSelector } from "@/contexts/WalletSelectorContext";
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { MouseEventHandler } from "react";

function AuthButton() {
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
}

function Navbar() {
    return (
        <Box
            display="flex"
            paddingX="8"
            paddingY="4"
            alignItems="center"
            justifyContent="space-between"
        >
            <Heading size="md">One-Zero</Heading>
            <Box display="flex" gap="4" alignItems="center">
                <Text>Markets</Text>
                <Text>Offers</Text>
                <AuthButton />
            </Box>
        </Box>
    );
}

export default Navbar;
