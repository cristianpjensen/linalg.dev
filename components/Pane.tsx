import { useDrag } from "@use-gesture/react";
import { useSpring, animated } from "@react-spring/web";
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

  const [{ x, y }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    config: { clamp: true, duration: 1, progress: 1 },
  }));

  const bind = useDrag(({ offset: [x, y] }) => {
    const gridX = Math.round(x / 24) * 24;
    const gridY = Math.round(y / 24) * 24;
    api.start({ x: gridX, y: gridY });
  });

  return (
    <animated.div
      className="w-72 h-56 bg-slate-200 shadow-md hover:shadow-lg transition-shadow"
      style={{ x, y }}
    >
      <div
        {...bind()}
        className="w-72 h-8 bg-slate-300"
        style={{ cursor: pointerDown ? "grabbing" : "grab" }}
      />
    </animated.div>
  );
}
