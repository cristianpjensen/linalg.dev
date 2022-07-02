import { useEffect, useState } from "react";

export function Mouse() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const onMouseMove = (e: MouseEvent) => {
    setX(e.clientX);
    setY(e.clientY);
  };

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
  });

  return (
    <div
      className="mouse absolute w-0 h-0"
      style={{ translate: `${x}px ${y}px` }}
    />
  );
}
