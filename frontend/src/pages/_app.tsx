import { WalletSelectorContextProvider } from "@/contexts/wallet-selector-context";
import { ChakraProvider, Container, CSSReset } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import Navbar from "@/components/navbar";
import Head from "next/head";

import "@near-wallet-selector/modal-ui/styles.css";

const App = ({ Component, pageProps }: AppProps) => {
    const queryClient = new QueryClient();

    return (
        <>
            <CSSReset />
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
                        <Container as="main" marginTop="8">
                            <Component {...pageProps} />
                        </Container>
                    </WalletSelectorContextProvider>
                </QueryClientProvider>
            </ChakraProvider>
        </>
    );
};

export default App;
