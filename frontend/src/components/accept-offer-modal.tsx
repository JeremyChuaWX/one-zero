import { useWalletSelector } from "@/contexts/wallet-selector-context";
import { Offer } from "@/types";
import { useAcceptOffer } from "@/utils/contract-methods";
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

const AcceptOfferModal = ({
    offer,
    disabled,
}: {
    offer: Offer;
    disabled: boolean;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const toast = useToast();

    const { accountId, selector } = useWalletSelector();

    const { mutate: acceptOffer } = useAcceptOffer();

    const acceptOfferOnClick: MouseEventHandler<HTMLButtonElement> = (e) => {
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

        acceptOffer({ selector, accountId, offer });
    };
    return (
        <>
            <Button
                variant="outline"
                colorScheme="green"
                size="sm"
                onClick={onOpen}
                isDisabled={disabled}
            >
                Accept Offer
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
                <ModalOverlay />

                <ModalContent>
                    <ModalHeader>Accept Offer</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>Do you want to accept this offer?</ModalBody>

                    <ModalFooter>
                        <ButtonGroup variant="outline">
                            <Button type="button" onClick={onClose}>
                                Close
                            </Button>

                            <Button
                                type="submit"
                                colorScheme="green"
                                onClick={acceptOfferOnClick}
                            >
                                Accept Offer
                            </Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default AcceptOfferModal;
