import { useWalletSelector } from "@/contexts/wallet-selector-context";
import { useCloseMarket } from "@/utils/contract-methods";
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

const CloseMarketModal = ({ marketId }: { marketId: number }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const toast = useToast();

    const { accountId, selector } = useWalletSelector();

    const { mutate: closeMarket } = useCloseMarket();

    const closeMarketOnClick: MouseEventHandler<HTMLButtonElement> = (e) => {
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

        closeMarket({
            selector,
            accountId,
            marketId,
            isLong: true,
        });
    };

    return (
        <>
            <Button variant="outline" onClick={onOpen}>
                Close Market
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Close Market</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        Are you sure you want to close this market?
                    </ModalBody>

                    <ModalFooter>
                        <ButtonGroup variant="outline">
                            <Button onClick={onClose}>
                                Close
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={closeMarketOnClick}
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
