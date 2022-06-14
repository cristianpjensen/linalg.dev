import { createUseGesture, dragAction, pinchAction } from "@use-gesture/react";
import { useSpring, animated } from "@react-spring/web";
import { useEffect, useState } from "react";

const useGesture = createUseGesture([dragAction, pinchAction]);

interface InfiniteGridProps {
  children: React.ReactNode;
}

export default function InfiniteGrid({ children }: InfiniteGridProps) {
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
    scale: 1,
    backgroundSize: 24,
    config: { clamp: true, duration: 1, progress: 1 },
  }));

  const bind = useGesture(
    {
      onDrag: ({ pinching, cancel, offset: [x, y], ...rest }) => {
        console.log(rest);
        if (pinching) return cancel();
        api.start({ x, y });
      },
      onPinch: ({
        first,
        origin: [ox, oy],
        movement: [ms],
        offset: [scale],
        memo,
      }) => {
        if (first) {
          const tx = ox - (style.x.get() + style.scale.get() / 2);
          const ty = oy - (style.y.get() + style.scale.get() / 2);
          memo = [style.x.get(), style.y.get(), tx, ty];
        }

        const x = memo[0] - (ms - 1) * memo[2];
        const y = memo[1] - (ms - 1) * memo[3];
        api.start({ scale, x, y, backgroundSize: scale * 24 });

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
        className="bg-slate-100 absolute top-0 bottom-0 left-0 right-0 bg-repeat touch-none select-none"
        style={{
          backgroundImage:
            "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABxSURBVHgB7dOrEcMwEEBByTYITCkpITA9GaunQJeQUgIN9IkEUoRHu+Tm4L2Ziymlx7qurxjjmXM+9n3/hIks27Y9W2u3Wut9hAiTWcbx/6VHOMNkllLKu0f4jhfo8wgAAAAAAAAAAAAAAAAAAAAX9APY5yL/ZyiGWAAAAABJRU5ErkJggg==)",
          backgroundSize: style.backgroundSize,
          backgroundPositionX: style.x,
          backgroundPositionY: style.y,
          cursor: pointerDown ? "grabbing" : "grab",
        }}
        {...bind()}
      />
      <animated.div
        className="w-0 h-0"
        style={{
          translateX: style.x,
          translateY: style.y,
          scale: style.scale,
        }}
      >
        {children}
      </animated.div>
    </div>
  );
}
