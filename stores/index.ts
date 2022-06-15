import create from "zustand";

export type ToolEnum = "" | "Vector" | "Matrix"

interface Store {
  scale: number;
  setScale: (scale: number) => void;
  tool: ToolEnum;
  setTool: (tool: ToolEnum) => void;
}

export const useStore = create<Store>((set) => ({
  scale: 1,
  setScale: (scale) => set({ scale }),
  tool: "",
  setTool: (tool) => set({ tool }),
}));
