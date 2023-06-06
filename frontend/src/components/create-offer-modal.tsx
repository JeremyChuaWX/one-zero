import { useWalletSelector } from "@/contexts/wallet-selector-context";
import { useCreateOffer } from "@/utils/contract-methods";
import {
    Box,
    Button,
    ButtonGroup,
    FormControl,
    FormLabel,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Switch,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { utils } from "near-api-js";
import { Market } from "@/types";

type CreateOfferFormInput = {
    amount: number;
    isLong: boolean;
};

const CreateOfferModal = ({
    market,
    disabled,
}: {
    market: Market;
    disabled: boolean;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const toast = useToast();

    const { handleSubmit, register } = useForm<CreateOfferFormInput>();

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

        const amount = utils.format.parseNearAmount(input.amount.toString());

        if (!amount) {
            toast({
                status: "error",
                description: "Cannot parse amount to NEAR balance",
                isClosable: true,
                position: "bottom-right",
            });
            return;
        }

        createOffer({
            selector,
            accountId,
            market,
            amount,
            isLong: input.isLong,
        });
    });

    return (
        <>
            <Button variant="outline" onClick={onOpen} isDisabled={disabled}>
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
                            <Box display="flex" flexDir="column" gap="8">
                                <FormControl isRequired>
                                    <FormLabel>Amount Offered</FormLabel>
                                    <NumberInput min={1}>
                                        <NumberInputField
                                            {...register("amount")}
                                            placeholder="Enter amount offered here"
                                        />

                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </FormControl>

                                <FormControl
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <FormLabel>Is the market long?</FormLabel>
                                    <Switch {...register("isLong")} />
                                </FormControl>
                            </Box>
                        </form>
                    </ModalBody>

                    <ModalFooter>
                        <ButtonGroup variant="outline">
                            <Button type="button" onClick={onClose}>
                                Close
                            </Button>

                            <Button
                                form="create-offer-form"
                                type="submit"
                                colorScheme="green"
                            >
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
