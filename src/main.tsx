import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Clear potentially corrupted localStorage on startup
if (typeof localStorage !== 'undefined') {
  try {
    localStorage.removeItem('prd-agent-data');
  } catch (e) {
    console.error("Could not clear localStorage:", e);
  }
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found");
} else {
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
  } catch (error) {
    console.error("Failed to mount React app:", error);
    // Show error in the DOM
    rootElement.innerHTML = `<div style="padding: 20px; color: red;">
      <h1>Error loading app</h1>
      <pre>${error instanceof Error ? error.message : String(error)}</pre>
    </div>`;
  }
}
