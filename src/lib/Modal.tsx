import React, { useEffect, type ReactNode, useRef } from "react";
import { useModal } from "~/context/ModalContex";
import Portal from "./Portal";
import { cn } from "~/utils/styles";
import Box from "./Box";

const Modal = ({
  children,
  className,
  message,
  overlay,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  message?: string;
  overlay?: boolean;
}) => {
  const { open, closeModal, setOpen, handleModal } = useModal();
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closeModal();
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => closeModal(), [setOpen]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return open ? (
    <Portal>
      <div
        className="animate-fadein fixed inset-0 z-50 m-0 flex h-screen w-screen flex-col items-center justify-center transition duration-300"
        id="modal-content"
        ref={ref}
        onTransitionEnd={(e) => {
          e.target === ref.current && closeModal();
        }}
      >
        <div
          className={cn(
            "flex h-full w-full cursor-auto select-none",
            overlay && "bg-black bg-opacity-30"
          )}
          onKeyDown={handleClick}
          onClick={() => {
            handleModal();
          }}
        />
        {message && (
          <div
            className="z-5 absolute top-10 h-auto select-none text-center text-white"
            onClick={() => handleModal()}
          >
            {message}
          </div>
        )}
        <div className="absolute z-50 flex h-auto">
          <Box
            className={cn(
              className,
              "max-h-[90vh] min-w-[40rem] overflow-auto bg-white stroke-0 shadow-lg"
            )}
            style={style}
          >
            {children}
          </Box>
        </div>
      </div>
    </Portal>
  ) : null;
};

export default Modal;
