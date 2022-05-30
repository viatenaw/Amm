import { ModalBody, ModalContent, ModelHead, Close, ModalContainer } from "./style";

const CustomModal = (props: any) => {
  const { show, toggleModal, borderRadius, heading, styles } = props;

  const handleClickOutside = (e: any) => {
    if (e.target === e.currentTarget) {
      toggleModal(false);
    }
  };

  return (
    <ModalContainer onMouseDown={handleClickOutside} show={show}>
      <ModalBody style={{ ...styles }}>
        <ModelHead>
          <p>{heading}</p>
          <Close
            onClick={() => toggleModal(!show)}
          />
        </ModelHead>
        <ModalContent borderRadius={borderRadius}>
          {props.children}
        </ModalContent>
      </ModalBody>
    </ModalContainer>
  );
};
export default CustomModal;
