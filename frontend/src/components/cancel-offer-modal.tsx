import { useWalletSelector } from "@/contexts/wallet-selector-context";
import { Offer } from "@/types";
import { useCancelOffer } from "@/utils/contract-methods";
import {
    Button,
    ButtonGroup,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { MouseEventHandler } from "react";

const CancelOfferModal = ({
    offer,
    disabled,
}: {
    offer: Offer;
    disabled: boolean;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const toast = useToast();

    const { accountId, selector } = useWalletSelector();

    const { mutate: cancelOffer } = useCancelOffer();

    const cancelOfferOnClick: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();

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
            cancelOffer({ selector, accountId, offer });
        } catch (err) {
            toast({
                status: "error",
                description: "Error cancelling offer",
                isClosable: true,
                position: "bottom-right",
            });
        }

        onClose();
    };
    return (
        <>
            <Button
                variant="outline"
                colorScheme="red"
                size="sm"
                onClick={onOpen}
                isDisabled={disabled}
            >
                Cancel Offer
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
                <ModalOverlay />

                <ModalContent>
                    <ModalHeader>Cancel Offer</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>Do you want to cancel this offer?</ModalBody>

                    <ModalFooter>
                        <ButtonGroup variant="outline">
                            <Button type="button" onClick={onClose}>
                                Close
                            </Button>

                            <Button
                                type="submit"
                                colorScheme="green"
                                onClick={cancelOfferOnClick}
                            >
                                Cancel Offer
                            </Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CancelOfferModal;
