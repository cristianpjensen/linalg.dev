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
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
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
  darkMode: false,
  setDarkMode: (darkMode) => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

    set({ darkMode });
  },
}));

export default useUIStore;
