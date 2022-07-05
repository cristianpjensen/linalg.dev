import create from "zustand";

interface UIStore {
  x: number;
  setX: (x: number) => void;
  y: number;
  setY: (y: number) => void;
  scale: number;
  setScale: (scale: number) => void;
  setXYS: (x: number, y: number, scale: number) => void;
  tool: string;
  setTool: (tool: string) => void;
}

const useUIStore = create<UIStore>((set) => ({
  x: 10,
  setX: (x) => set({ x }),
  y: 58,
  setY: (y) => set({ y }),
  scale: 1,
  setScale: (scale) => set({ scale }),
  setXYS: (x, y, scale) => set({ x, y, scale }),
  tool: "",
  setTool: (tool) => set({ tool }),
}));

export default useUIStore;