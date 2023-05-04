import Head from "next/head";
import { type AppType } from "next/dist/shared/lib/utils";
import Navbar from "~/components/Navbar";
import { WalletSelectorContextProvider } from "~/contexts/WalletSelectorContext";

import "~/styles/globals.css";
import "@near-wallet-selector/modal-ui/styles.css";

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <>
            <Head>
                <title>One Zero</title>
            </Head>
            <WalletSelectorContextProvider>
                <Navbar />
                <main className="p-4 w-full h-full">
                    <Component {...pageProps} />
                </main>
            </WalletSelectorContextProvider>
        </>
    );
};

export default MyApp;
