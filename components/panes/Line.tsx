import { getArrow } from "perfect-arrows";


export function Line() {
  const { x1, y1, x2, y2 } = { x1: 0, y1: 0, x2: 0, y2: 0 };
  const [sx, sy, cx, cy, ex, ey, ae, as, ac] = getArrow(x1, y1, x2, y2);

  return
}
