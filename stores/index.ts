import create from "zustand";

export type ToolEnum = "" | "Vector" | "Matrix";
export type VectorPane = {
  id: number;
  title: string;
  canvasX: number;
  canvasY: number;
  x: number;
  y: number;
  z: number;
};

interface Store {
  scale: number;
  setScale: (scale: number) => void;
  tool: ToolEnum;
  setTool: (tool: ToolEnum) => void;
  vectors: VectorPane[];
  addVector: (x: number, y: number) => void;
  removeVector: (id: number) => void;
}

export const useStore = create<Store>((set) => ({
  scale: 1,
  setScale: (scale) => set({ scale }),
  tool: "",
  setTool: (tool) => set({ tool }),
  vectors: [],
  addVector: (x, y) =>
    set((state) => ({
      vectors: [
        ...state.vectors,
        {
          id: state.vectors.length,
          title: "",
          canvasX: x,
          canvasY: y,
          x: 0,
          y: 0,
          z: 0,
        },
      ],
    })),
  removeVector: (id) =>
    set((state) => ({
      vectors: state.vectors.filter((v) => v.id !== id),
    })),
}));
