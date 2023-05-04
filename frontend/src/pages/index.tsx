import { type NextPage } from "next";
import { FormEventHandler, useEffect } from "react";
import { useWalletSelector } from "~/contexts/WalletSelectorContext";
import useMarketStore from "~/stores/marketStore";

const Home: NextPage = () => {
    const { selector } = useWalletSelector();
    const { markets, getMarkets } = useMarketStore();

    useEffect(() => {
        getMarkets(selector).catch(console.error);
    }, []);

    const addMarketOnSumbit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
    };

    return (
        <>
            <form onSubmit={addMarketOnSumbit}>
                <label>Market Description</label>
                <input type="text" />
                <button type="submit">Add Market</button>
            </form>
            {markets.map((market) => {
                <div>
                    {market.id}: {market.description}
                </div>;
            })}
        </>
    );
};

export default Home;
