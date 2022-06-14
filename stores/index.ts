import create from "zustand";

interface Store {
  scale: number;
  setScale: (scale: number) => void;
}

export const useStore = create<Store>((set) => ({
  scale: 1,
  setScale: (scale) => set({ scale }),
}));
