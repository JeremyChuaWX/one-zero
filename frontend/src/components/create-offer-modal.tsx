import { useWalletSelector } from "@/contexts/wallet-selector-context";
import { useCreateOffer } from "@/utils/contract-methods";
import {
    useDisclosure,
    useToast,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    ButtonGroup,
    FormControl,
    FormLabel,
    Switch,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";

type CreateOfferFormInput = {
    amount: number;
    isLong: boolean;
};

const CreateOfferModal = ({ marketId }: { marketId: number }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const toast = useToast();

    const { control, handleSubmit } = useForm<CreateOfferFormInput>();

    const { selector, accountId } = useWalletSelector();

    const { mutate: createOffer } = useCreateOffer();

    const createOfferOnSumbit = handleSubmit((input) => {
        if (accountId === null) {
            toast({
                status: "error",
                description: "No wallet connected",
                isClosable: true,
                position: "bottom-right",
            });
            return;
        }

        createOffer({
            selector,
            accountId,
            marketId,
            amount: input.amount,
            isLong: input.isLong,
        });
    });

    return (
        <>
            <Button variant="outline" onClick={onOpen}>
                Create Offer
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
                <ModalOverlay />

                <ModalContent>
                    <ModalHeader>Create Offer</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <form
                            id="create-offer-form"
                            onSubmit={createOfferOnSumbit}
                        >
                            <FormControl isRequired>
                                <FormLabel>Amount Offered</FormLabel>
                                <NumberInput min={1}>
                                    <Controller
                                        name="amount"
                                        control={control}
                                        render={({ field }) => (
                                            <NumberInputField
                                                {...field}
                                                placeholder="Enter amount offered here"
                                            />
                                        )}
                                    />

                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Is the offer long?</FormLabel>
                                <Controller
                                    name="isLong"
                                    control={control}
                                    render={({ field }) => (
                                        <Switch
                                            {...field}
                                            placeholder="Enter market description here"
                                        />
                                    )}
                                />
                            </FormControl>
                        </form>
                    </ModalBody>

                    <ModalFooter>
                        <ButtonGroup variant="outline">
                            <Button type="button" onClick={onClose}>
                                Close
                            </Button>

                            <Button form="create-offer-form" type="submit">
                                Create Offer
                            </Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CreateOfferModal;
