import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";

const DialogDemo = () => (
    <Dialog.Root>
        <Dialog.Trigger asChild>
            <button className="py-1 px-4 text-gray-200 bg-gray-900 rounded-md">
                Create Market
            </button>
        </Dialog.Trigger>
        <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-gray-900 data-[state=open]:animate-overlayShow" />
            <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-gray-200 p-4 data-[state=open]:animate-contentShow">
                <Dialog.Title className="m-0 font-medium text-gray-900">
                    Edit profile
                </Dialog.Title>
                <Dialog.Description className="mb-5 leading-normal text-mauve11 mt-[10px] text-[15px]">
                    Make changes to your profile here. Click save when you're
                    done.
                </Dialog.Description>
                <fieldset className="flex gap-5 items-center mb-[15px]">
                    <label
                        className="text-right text-violet11 w-[90px] text-[15px]"
                        htmlFor="name"
                    >
                        Name
                    </label>
                    <input
                        className="inline-flex flex-1 justify-center items-center w-full leading-none outline-none text-violet11 shadow-violet7 h-[35px] rounded-[4px] px-[10px] text-[15px] shadow-[0_0_0_1px] focus:shadow-violet8 focus:shadow-[0_0_0_2px]"
                        id="name"
                        defaultValue="Pedro Duarte"
                    />
                </fieldset>
                <fieldset className="flex gap-5 items-center mb-[15px]">
                    <label
                        className="text-right text-violet11 w-[90px] text-[15px]"
                        htmlFor="username"
                    >
                        Username
                    </label>
                    <input
                        className="inline-flex flex-1 justify-center items-center w-full leading-none outline-none text-violet11 shadow-violet7 h-[35px] rounded-[4px] px-[10px] text-[15px] shadow-[0_0_0_1px] focus:shadow-violet8 focus:shadow-[0_0_0_2px]"
                        id="username"
                        defaultValue="@peduarte"
                    />
                </fieldset>
                <div className="flex justify-end mt-[25px]">
                    <Dialog.Close asChild>
                        <button className="inline-flex justify-center items-center font-medium leading-none focus:outline-none bg-green4 text-green11 h-[35px] rounded-[4px] px-[15px] hover:bg-green5 focus:shadow-green7 focus:shadow-[0_0_0_2px]">
                            Save changes
                        </button>
                    </Dialog.Close>
                </div>
                <Dialog.Close asChild>
                    <button
                        className="inline-flex absolute justify-center items-center rounded-full appearance-none focus:outline-none text-violet11 right-[10px] top-[10px] h-[25px] w-[25px] hover:bg-violet4 focus:shadow-violet7 focus:shadow-[0_0_0_2px]"
                        aria-label="Close"
                    >
                        <Cross2Icon />
                    </button>
                </Dialog.Close>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
);

export default DialogDemo;
