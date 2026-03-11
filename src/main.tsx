import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Apply dark mode before render to avoid flash
try {
  const settings = JSON.parse(localStorage.getItem("studyapp-settings") || "{}");
  if (settings.darkMode) document.documentElement.classList.add("dark");
} catch {}

createRoot(document.getElementById("root")!).render(<App />);
