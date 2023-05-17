import { type FormEventHandler } from "react";
import { useWalletSelector } from "~/contexts/WalletSelectorContext";
import { createMarket } from "~/utils/contract-methods";

const CreateMarketForm = () => {
    const { selector, accountId } = useWalletSelector();

    const onSumbit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        if (!accountId) throw Error("not signed in");
        const target = e.target as typeof e.target & {
            description: { value: string };
        };
        await createMarket({
            selector,
            accountId,
            description: target.description.value,
        });
    };

    return (
        <form onSubmit={onSumbit} className="flex flex-col gap-2 w-full">
            <label className="font-bold">
                Market Description
                <input type="text" name="description" />
            </label>
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
