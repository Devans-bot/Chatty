import { useEffect } from "react";

export default function useOutsideClick(ref, callback) {
  useEffect(() => {
    const handleOutside = (event) => {
      if (!ref.current) return;
      if (ref.current.contains(event.target)) return;
      callback();
    };

    document.addEventListener("pointerdown", handleOutside);

    return () => {
      document.removeEventListener("pointerdown", handleOutside);
    };
  }, [ref, callback]);
}
