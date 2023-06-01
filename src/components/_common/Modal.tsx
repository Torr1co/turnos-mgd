import React, { useEffect, type ReactNode, useRef } from "react";
import { useModal } from "~/context/ModalContex";
import Portal from "./Portal";
import { cn } from "~/utils/styleUtils";
import Box from "./Box";
import { XMarkIcon } from "@heroicons/react/24/solid";

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
        className="fixed inset-0 z-50 m-0 flex h-screen w-screen animate-fadein flex-col items-center justify-center font-custom transition duration-300"
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
              "relative max-h-[90vh] min-w-[100vw] overflow-auto bg-white stroke-0 text-sm shadow-lg sm:min-w-[44rem]"
            )}
            size="px-10 pb-14 rounded-lg"
            style={style}
          >
            <div className="sticky top-0 z-30 -mx-10 h-10 bg-white">
              <button
                className="absolute top-1.5 right-1.5 ml-auto grid h-8 w-8 items-center rounded-full bg-gray-300 p-1"
                onClick={() => {
                  handleModal();
                }}
              >
                <XMarkIcon className="text-gray-600" />
              </button>
            </div>
            <div className="relative">{children}</div>
          </Box>
        </div>
      </div>
    </Portal>
  ) : null;
};

export default Modal;
