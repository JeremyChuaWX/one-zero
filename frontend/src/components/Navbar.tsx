import { MouseEventHandler } from "react";
import { useWalletSelector } from "~/contexts/WalletSelectorContext";

const AuthButton = () => {
    const { modal, accountId } = useWalletSelector();

    const signInOnClick: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        modal.show();
    };

    return (
        <button
            className="py-1 px-4 text-gray-200 bg-gray-900 rounded-md"
            onClick={signInOnClick}
        >
            {accountId ?? "Sign In"}
        </button>
    );
};

const Navbar = () => {
    return (
        <div className="flex justify-between items-center p-4 w-full border-b border-gray-300">
            <p className="text-2xl font-bold">One Zero</p>
            <div className="flex gap-4 items-center">
                <p>Markets</p>
                <p>Offers</p>
                <AuthButton />
            </div>
        </div>
    );
};

export default Navbar;
