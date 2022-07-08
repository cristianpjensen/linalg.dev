import { RecoilState, useRecoilCallback } from "recoil";
import { ids } from "../stores/atoms";
import { NodeType } from "../stores/types";

let id = 0;
const getId = () => id++;

export default function useCreateNode<T>(
  atomFamily: (param: number) => RecoilState<T>,
  type: NodeType,
  defaultValue: () => T
) {
  return useRecoilCallback(
    ({ set }) =>
      (x: number, y: number) => {
        const id = getId();

        set(ids, (ids) => [...ids, { id, type }]);
        set(atomFamily(id), {
          ...defaultValue(),
          position: { x, y },
        });
      },
    []
  );
}
