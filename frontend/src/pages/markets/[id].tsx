import { useRouter } from "next/router";
import { useWalletSelector } from "~/contexts/WalletSelectorContext";
import { useGetMarketById } from "~/utils/contract-methods";

const MarketPage = () => {
    const router = useRouter();
    const { id: marketId } = router.query;
    const { selector } = useWalletSelector();
    const {} = useGetMarketById(selector, parseInt(marketId));
};

export default MarketPage;
