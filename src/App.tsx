import { useState } from "react";
import Landing from "./components/Landing";
import Leads from "./components/Leads";
import { Button } from "./components/ui/button";
import "./App.css";

function App() {
  const [currentView, setCurrentView] = useState<"landing" | "leads">(
    "landing"
  );

  return (
    <div className="min-h-screen">
      {/* Navigation buttons - only show when on landing page */}
      {currentView === "landing" && (
        <div className="fixed top-4 right-4 z-50">
          <Button
            onClick={() => setCurrentView("leads")}
            variant="outline"
            className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20"
          >
            Admin Panel
          </Button>
        </div>
      )}

      {/* Back button for leads view */}
      {currentView === "leads" && (
        <div className="fixed top-4 right-4 z-50">
          <Button
            onClick={() => setCurrentView("landing")}
            variant="outline"
            className="bg-purple-600 text-white hover:bg-purple-700"
          >
            Back to Landing
          </Button>
        </div>
      )}

      {/* Render current view */}
      {currentView === "landing" ? <Landing /> : <Leads />}
    </div>
  );
}

export default App;
