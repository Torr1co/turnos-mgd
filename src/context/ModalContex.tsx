import React, {
  useState,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import Modal from "~/components/_common/Modal";

interface ModalConfig {
  className: string;
  message: string;
  overlay: boolean;
  style: React.CSSProperties;
}

interface ModalContextProps {
  open: boolean;
  setOpen: (o: boolean) => void;
  //   updateConfig: (c: Partial<ModalConfig>) => void;
  handleModal: (c?: JSX.Element, t?: Partial<ModalConfig>) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextProps>({
  open: false,
  //   updateConfig: () => null,
  setOpen: () => null,
  handleModal: () => null,
  closeModal: () => null,
});

export const DEFAULT_CONFIG: ModalConfig = {
  className: "",
  message: "",
  overlay: true,
  style: {},
};

const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig>(DEFAULT_CONFIG);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const closeModal = () => {
    setOpen(false);
    setModalConfig(DEFAULT_CONFIG);
  };

  const hideModal = () => {
    const content = document.getElementById("modal-content");
    if (content) {
      content.style.opacity = "0";
    }
    setTimeout(() => {
      closeModal();
    }, 300);
  };

  const handleModal = (
    content: JSX.Element | null = null,
    tempConfig?: Partial<ModalConfig>
  ) => {
    if (open) {
      hideModal();
    } else {
      setOpen(true);
    }
    content && setModalContent(content);
    tempConfig &&
      setModalConfig((prevConfig) => ({ ...prevConfig, ...tempConfig }));
  };

  return (
    <ModalContext.Provider value={{ open, setOpen, handleModal, closeModal }}>
      {children}
      <Modal {...modalConfig}>{modalContent}</Modal>
    </ModalContext.Provider>
  );
};

const useModal = () => useContext(ModalContext);

export { ModalContext, ModalProvider, useModal };
