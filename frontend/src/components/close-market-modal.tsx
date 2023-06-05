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
} from "@chakra-ui/react";
import { MouseEventHandler } from "react";

const CloseMarketModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    // const {} = useCloseMarket();

    const closeMarketOnClick: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
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
