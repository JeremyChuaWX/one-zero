import { useWalletSelector } from "@/contexts/wallet-selector-context";
import { Market } from "@/types";
import { useCloseMarket } from "@/utils/contract-methods";
import {
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
    Switch,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

type CloseMarketFormInput = {
    isLong: boolean;
};

const CloseMarketModal = ({
    market,
    disabled,
}: {
    market: Market;
    disabled: boolean;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const toast = useToast();

    const { handleSubmit, register } = useForm<CloseMarketFormInput>();

    const { accountId, selector } = useWalletSelector();

    const { mutate: closeMarket } = useCloseMarket();

    const closeMarketOnSubmit = handleSubmit((input) => {
        if (accountId === null) {
            toast({
                status: "error",
                description: "No wallet connected",
                isClosable: true,
                position: "bottom-right",
            });
            return;
        }

        try {
            closeMarket({
                selector,
                accountId,
                market,
                isLong: input.isLong,
            });
        } catch (err) {
            toast({
                status: "error",
                description: "Error closing market",
                isClosable: true,
                position: "bottom-right",
            });
        }

        onClose();
    });

    return (
        <>
            <Button variant="outline" onClick={onOpen} isDisabled={disabled}>
                Close Market
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Close Market</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <form>
                            <FormControl
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <FormLabel>Is the market long?</FormLabel>
                                <Switch {...register("isLong")} />
                            </FormControl>
                        </form>
                    </ModalBody>

                    <ModalFooter>
                        <ButtonGroup variant="outline">
                            <Button onClick={onClose}>Close</Button>
                            <Button
                                colorScheme="red"
                                onClick={closeMarketOnSubmit}
                            >
                                Close Market
                            </Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CloseMarketModal;
