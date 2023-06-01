import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

const Portal = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  const portalElement = document.getElementById("modal");
  return mounted && portalElement
    ? createPortal(children, portalElement)
    : null;
};

export default Portal;
