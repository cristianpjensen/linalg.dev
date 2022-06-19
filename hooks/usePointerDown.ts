import { useCallback, useEffect, useState } from "react";

export function usePointerDown() {
  const [pointerDown, setPointerDown] = useState(false);

  const pointerDownHandler = useCallback(() => setPointerDown(true), []);
  const pointerUpHandler = useCallback(() => setPointerDown(false), []);

  useEffect(() => {
    document.addEventListener("pointerdown", pointerDownHandler);
    document.addEventListener("pointerup", pointerUpHandler);

    return () => {
      document.removeEventListener("pointerdown", pointerDownHandler);
      document.removeEventListener("pointerup", pointerUpHandler);
    };
  }, []);

  return pointerDown;
}
