import { useWalletSelector } from "@/contexts/wallet-selector-context";
import { useCreateMarket } from "@/utils/contract-methods";
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
    Textarea,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";

type CreateMarketFormInput = {
    description: string;
};

const CreateMarketModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const toast = useToast();

    const { control, handleSubmit } = useForm<CreateMarketFormInput>();

    const { selector, accountId } = useWalletSelector();

    const { mutate: createMarket } = useCreateMarket();

    const createMarketOnSumbit = handleSubmit((input) => {
        if (accountId === null) {
            toast({
                status: "error",
                description: "No wallet connected",
                isClosable: true,
                position: "bottom-right",
            });
            return;
        }

        createMarket({
            selector,
            accountId,
            description: input.description,
        });
    });

    return (
        <>
            <Button variant="outline" onClick={onOpen}>
                Create Market
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
                <ModalOverlay />

                <ModalContent>
                    <ModalHeader>Create Market</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <form
                            id="create-market-form"
                            onSubmit={createMarketOnSumbit}
                        >
                            <FormControl isRequired>
                                <FormLabel>Market Description</FormLabel>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <Textarea
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
                            <Button form="create-market-form" type="submit">
                                Create Market
                            </Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CreateMarketModal;
