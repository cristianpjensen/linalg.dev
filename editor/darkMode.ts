export function setDarkMode(darkMode: boolean | null) {
  if (darkMode === null) {
    localStorage.removeItem("theme");
  } else {
    localStorage.theme = darkMode ? "dark" : "light";
  }

  addDarkClass();
}

function addDarkClass() {
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }
}

addDarkClass();
