import Head from "next/head";
import { type AppType } from "next/dist/shared/lib/utils";
import Navbar from "~/components/Navbar";
import { WalletSelectorContextProvider } from "~/context/WalletSelectorContext";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <>
            <Head>
                <title>One Zero</title>
            </Head>
            <WalletSelectorContextProvider>
                <Navbar />
                <main className="p-4 w-full h-full text-gray-900 bg-gray-200">
                    <Component {...pageProps} />
                </main>
            </WalletSelectorContextProvider>
        </>
    );
};

export default MyApp;
