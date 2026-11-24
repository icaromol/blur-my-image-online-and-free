(() => {
  let stored = null;
  try {
    stored = localStorage.getItem("theme");
  } catch {
    // Storage unavailable: follow the system.
  }
  const dark =
    stored === "dark" ||
    (stored !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
})();
