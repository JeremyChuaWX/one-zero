import { type FormEventHandler } from "react";
import { useWalletSelector } from "~/contexts/WalletSelectorContext";
import { useCreateOffer } from "~/utils/contract-methods";

const CreateOfferForm = () => {
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
            <div className="flex gap-4 items-center">
                <label className="text-right whitespace-nowrap">
                    Market ID
                </label>
                <input
                    type="text"
                    name="marketId"
                    className="w-full leading-none rounded-md outline outline-1 outline-gray-500"
                />
            </div>
            <div className="flex gap-4 items-center">
                <label className="text-right whitespace-nowrap">Is Long</label>
                <input
                    type="text"
                    name="isLong"
                    className="w-full leading-none rounded-md outline outline-1 outline-gray-500"
                />
            </div>
            <div className="flex gap-4 items-center">
                <label className="text-right whitespace-nowrap">
                    Amount Offered
                </label>
                <input
                    type="text"
                    name="amount"
                    className="w-full leading-none rounded-md outline outline-1 outline-gray-500"
                />
            </div>
            <button
                type="submit"
                className="py-1 px-4 text-gray-200 bg-gray-900 rounded-md"
            >
                Create Offer
            </button>
        </form>
    );
};

export default CreateOfferForm;
