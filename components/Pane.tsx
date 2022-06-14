import { useDrag } from "@use-gesture/react";
import { useEffect, useState } from "react";

export default function Pane() {
  const [pointerDown, setPointerDown] = useState(false);

  const pointerDownHandler = () => {
    setPointerDown(true);
  };

  const pointerUpHandler = () => {
    setPointerDown(false);
  };

  useEffect(() => {
    document.addEventListener("pointerdown", pointerDownHandler);
    document.addEventListener("pointerup", pointerUpHandler);

    return () => {
      document.removeEventListener("pointerdown", pointerDownHandler);
      document.removeEventListener("pointerup", pointerUpHandler);
    };
  }, []);

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const bind = useDrag(({ offset: [currentX, currentY] }) => {
    setX(Math.round(currentX / 24) * 24);
    setY(Math.round(currentY / 24) * 24);
  });

  return (
    <div
      className="w-72 h-56 bg-slate-200 shadow-md hover:shadow-lg transition-shadow"
      style={{ translate: `${x}px ${y}px` }}
    >
      <div
        {...bind()}
        className="w-72 h-8 bg-slate-300"
        style={{ cursor: pointerDown ? "grabbing" : "grab" }}
      />
    </div>
  );
}
