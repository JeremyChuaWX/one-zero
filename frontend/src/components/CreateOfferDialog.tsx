import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import CreateOfferForm from "./CreateOfferForm";

const CreateOfferDialog = () => {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button className="py-1 px-4 text-gray-200 bg-gray-900 rounded-md">
                    Create Offer
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-gray-900 data-[state=open]:animate-overlayShow" />
                <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-gray-200 p-4 data-[state=open]:animate-contentShow">
                    <Dialog.Title className="mb-4 font-bold text-gray-900">
                        Create Offer
                    </Dialog.Title>
                    <CreateOfferForm />
                    <Dialog.Close asChild>
                        <button
                            className="inline-flex absolute justify-center items-center rounded-full appearance-none focus:outline-none right-[10px] top-[10px] h-[25px] w-[25px]"
                            aria-label="Close"
                        >
                            <Cross2Icon />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default CreateOfferDialog;