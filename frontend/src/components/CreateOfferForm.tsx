import { type FormEventHandler } from "react";
import { useWalletSelector } from "~/contexts/WalletSelectorContext";
import { useCreateOffer } from "~/utils/contract-methods";

export const CreateOfferForm = () => {
    const { selector, accountId } = useWalletSelector();
    const { mutate: createOffer } = useCreateOffer();

    const onSumbit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        if (!accountId) throw Error("not signed in");
        const target = e.target as typeof e.target & {
            marketId: { value: string };
            isLong: { checked: boolean };
            amount: { value: string };
        };
        createOffer({
            selector,
            accountId,
            marketId: parseInt(target.marketId.value),
            isLong: target.isLong.checked,
            amount: parseInt(target.amount.value),
        });
    };

    return (
        <form onSubmit={onSumbit} className="flex flex-col gap-2 w-full">
            <label className="font-bold">
                Market ID
                <input type="number" name="marketId" />
            </label>
            <label className="font-bold">
                is long
                <input type="checkbox" name="isLong" />
            </label>
            <label className="font-bold">
                Amount offered
                <input type="number" name="amount" />
            </label>
            <button
                type="submit"
                className="py-1 px-4 text-gray-200 bg-gray-900 rounded-md"
            >
                Add Offer
            </button>
        </form>
    );
};
