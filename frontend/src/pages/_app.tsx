import { WalletSelectorContextProvider } from "@/contexts/wallet-selector-context";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import Navbar from "@/components/navbar";
import Head from "next/head";

import "@near-wallet-selector/modal-ui/styles.css";

const App = ({ Component, pageProps }: AppProps) => {
    const queryClient = new QueryClient();

    return (
        <>
            <Head>
                <title>One Zero</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
            </Head>
            <ChakraProvider>
                <QueryClientProvider client={queryClient}>
                    <WalletSelectorContextProvider>
                        <Navbar />
                        <Box as="main" width="70%" marginX="auto" marginTop="8">
                            <Component {...pageProps} />
                        </Box>
                    </WalletSelectorContextProvider>
                </QueryClientProvider>
            </ChakraProvider>
        </>
    );
};

export default App;
