import { createUseGesture, dragAction, pinchAction } from "@use-gesture/react";
import { useSpring, animated } from "@react-spring/web";
import { useEffect, useState } from "react";

const useGesture = createUseGesture([dragAction, pinchAction]);

export default function InfiniteGrid() {
  const [pointerDown, setPointerDown] = useState(false);

  const pointerDownHandler = () => {
    setPointerDown(true);
  };

  const pointerUpHandler = () => {
    setPointerDown(false);
  };

  useEffect(() => {
    const handler = (e: any) => e.preventDefault();
    document.addEventListener("gesturestart", handler);
    document.addEventListener("gesturechange", handler);
    document.addEventListener("gestureend", handler);
    document.addEventListener("wheel", handler, { passive: false });
    document.addEventListener("pointerdown", pointerDownHandler);
    document.addEventListener("pointerup", pointerUpHandler);

    return () => {
      document.removeEventListener("gesturestart", handler);
      document.removeEventListener("gesturechange", handler);
      document.removeEventListener("gestureend", handler);
      document.removeEventListener("wheel", handler);
      document.removeEventListener("pointerdown", pointerDownHandler);
      document.removeEventListener("pointerup", pointerUpHandler);
    };
  }, []);

  const [style, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 32,
    config: { clamp: true, duration: 1, progress: 1 },
  }));

  const bind = useGesture(
    {
      onDrag: ({ pinching, cancel, offset: [x, y] }) => {
        if (pinching) return cancel();
        api.start({ x, y });
      },
      onPinch: ({
        first,
        origin: [ox, oy],
        movement: [ms],
        offset: [s],
        memo,
      }) => {
        if (first) {
          const tx = ox - (style.x.get() + style.scale.get() / 2);
          const ty = oy - (style.y.get() + style.scale.get() / 2);
          memo = [style.x.get(), style.y.get(), tx, ty];
        }

        const x = memo[0] - (ms - 1) * memo[2];
        const y = memo[1] - (ms - 1) * memo[3];
        api.start({ scale: s * 32, x, y });

        return memo;
      },
    },
    {
      pinch: { scaleBounds: { min: 0.5, max: 4 } },
    }
  );

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      <animated.div
        className="bg-neutral-200 absolute top-0 bottom-0 left-0 right-0 bg-repeat touch-none select-none"
        style={{
          backgroundImage:
            "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACTSURBVHgB7dSxDcIwEAVQO1AwACVDUFJQICUFM2WAZCUK0lFQMgKDoIRzQZMNkN+TLH39ztLd5RTGcbzknE8lz/P86vv+liqxGYbhGp8/R96WF/nQdV2apumdKtCE47r8TUMNmlS5ZlmW57osdyBVYlN2vW3bXazCPkb/E90jjuA9AQAAAAAAAAAAAAAAAADAX/kC44AeIErC7QEAAAAASUVORK5CYII=)",
          backgroundSize: style.scale,
          backgroundPositionX: style.x,
          backgroundPositionY: style.y,
          cursor: pointerDown ? "grabbing" : "grab",
        }}
        {...bind()}
      />
    </div>
  );
}
