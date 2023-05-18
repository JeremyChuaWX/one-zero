import { type FormEventHandler } from "react";
import { useWalletSelector } from "~/contexts/WalletSelectorContext";
import { useCreateMarket } from "~/utils/contract-methods";

const CreateMarketForm = () => {
    const { selector, accountId } = useWalletSelector();
    const { mutate: createMarket } = useCreateMarket();

    const onSumbit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        if (!accountId) throw Error("not signed in");
        const target = e.target as typeof e.target & {
            description: { value: string };
        };
        createMarket({
            selector,
            accountId,
            description: target.description.value,
        });
    };

    return (
        <form onSubmit={onSumbit} className="flex flex-col gap-4 w-full">
            <div className="flex gap-4 items-center">
                <label className="text-right whitespace-nowrap">
                    Market Description
                </label>
                <input
                    type="text"
                    name="description"
                    className="w-full leading-none rounded-md outline outline-1 outline-gray-500"
                />
            </div>
            <button
                type="submit"
                className="py-1 px-4 text-gray-200 bg-gray-900 rounded-md"
            >
                Create Market
            </button>
        </form>
    );
};

export default CreateMarketForm;
