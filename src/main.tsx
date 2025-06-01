import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Main app
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Stagewise toolbar (development only)
if (import.meta.env.DEV) {
  import("@stagewise/toolbar-react")
    .then(({ StagewiseToolbar }) => {
      const stagewiseConfig = {
        plugins: [],
      };

      // Create a separate container for the toolbar
      const toolbarContainer = document.createElement("div");
      toolbarContainer.id = "stagewise-toolbar-root";
      document.body.appendChild(toolbarContainer);

      // Create separate React root for toolbar
      createRoot(toolbarContainer).render(
        <StagewiseToolbar config={stagewiseConfig} />
      );
    })
    .catch(() => {
      // Silently fail if stagewise is not available
    });
}
