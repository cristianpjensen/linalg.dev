import create from "zustand";
import * as THREE from "three";

export type VectorPane = {
  id: number;
  title: string;
  canvasX: number;
  canvasY: number;
  vector: THREE.Vector3;
};

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

export const useUIStore = create<UIStore>((set) => ({
  x: 0,
  setX: (x) => set({ x }),
  y: 0,
  setY: (y) => set({ y }),
  scale: 1,
  setScale: (scale) => set({ scale }),
  setXYS: (x, y, scale) => set({ x, y, scale }),
  tool: "",
  setTool: (tool) => set({ tool }),
}));
