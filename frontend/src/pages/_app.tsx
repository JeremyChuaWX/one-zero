import { WalletSelectorContextProvider } from "@/contexts/WalletSelectorContext";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import Navbar from "@/components/Navbar";
import Head from "next/head";

import "@near-wallet-selector/modal-ui/styles.css";

export default function App({ Component, pageProps }: AppProps) {
    const queryClient = new QueryClient();

    return (
        <>
            <Head>
                <title>One Zero</title>
            </Head>
            <ChakraProvider>
                <QueryClientProvider client={queryClient}>
                    <WalletSelectorContextProvider>
                        <Navbar />
                        <Box as="main" paddingX="4">
                            <Component {...pageProps} />
                        </Box>
                    </WalletSelectorContextProvider>
                </QueryClientProvider>
            </ChakraProvider>
        </>
    );
}
