import create from "zustand";
import * as THREE from "three";

export type ToolEnum = "" | "Vector" | "Matrix";
export type VectorPane = {
  id: number;
  title: string;
  canvasX: number;
  canvasY: number;
  vector: THREE.Vector3;
};

interface Store {
  x: number;
  setX: (x: number) => void;
  y: number;
  setY: (y: number) => void;
  scale: number;
  setScale: (scale: number) => void;
  setXYS: (x: number, y: number, scale: number) => void;
  tool: ToolEnum;
  setTool: (tool: ToolEnum) => void;
  vectors: VectorPane[];
  addVector: (x: number, y: number, title: string) => void;
  removeVector: (id: number) => void;
  setVectorPane: (id: number, x: number, y: number) => void;
  setVectorX: (id: number, x: number) => void;
  setVectorY: (id: number, y: number) => void;
  setVectorZ: (id: number, z: number) => void;
}

export const useStore = create<Store>((set) => ({
  x: 0,
  setX: (x) => set({ x }),
  y: 0,
  setY: (y) => set({ y }),
  scale: 1,
  setScale: (scale) => set({ scale }),
  setXYS: (x, y, scale) => set({ x, y, scale }),
  tool: "",
  setTool: (tool) => set({ tool }),
  vectors: [],
  addVector: (x, y, title) =>
    set((state) => ({
      vectors: [
        ...state.vectors,
        {
          id: state.vectors.length,
          title,
          canvasX: Math.round(x / (state.scale * 24)) * 24,
          canvasY: Math.round(y / (state.scale * 24)) * 24,
          vector: new THREE.Vector3(
            Math.round(Math.random() * 10 - 5),
            Math.round(Math.random() * 10 - 5),
            Math.round(Math.random() * 10 - 5)
          ),
        },
      ],
    })),
  removeVector: (id) =>
    set((state) => ({
      vectors: state.vectors.filter((v) => v.id !== id),
    })),
  setVectorPane: (id, x, y) =>
    set((state) => ({
      vectors: state.vectors.map((v) =>
        v.id === id ? { ...v, canvasX: x, canvasY: y } : v
      ),
    })),
  setVectorX: (id, x) =>
    set((state) => ({
      vectors: state.vectors.map((v) => {
        if (v.id === id) {
          return { ...v, vector: v.vector.setX(x) };
        }
        return v;
      }),
    })),
  setVectorY: (id, y) =>
    set((state) => ({
      vectors: state.vectors.map((v) => {
        if (v.id === id) {
          return { ...v, vector: v.vector.setY(y) };
        }
        return v;
      }),
    })),
  setVectorZ: (id, z) =>
    set((state) => ({
      vectors: state.vectors.map((v) => {
        if (v.id === id) {
          return { ...v, vector: v.vector.setZ(z) };
        }
        return v;
      }),
    })),
}));
