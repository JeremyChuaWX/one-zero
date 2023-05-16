import Head from "next/head";
import { type AppType } from "next/dist/shared/lib/utils";
import Navbar from "~/components/Navbar";
import { WalletSelectorContextProvider } from "~/contexts/WalletSelectorContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "~/styles/globals.css";
import "@near-wallet-selector/modal-ui/styles.css";

const queryClient = new QueryClient();

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <>
            <Head>
                <title>One Zero</title>
            </Head>
            <WalletSelectorContextProvider>
                <QueryClientProvider client={queryClient}>
                    <Navbar />
                    <main className="p-4 w-full h-full">
                        <Component {...pageProps} />
                    </main>
                </QueryClientProvider>
            </WalletSelectorContextProvider>
        </>
    );
};

export default MyApp;
