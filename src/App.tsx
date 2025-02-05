import React, { useState, useEffect } from "react";
import Visualizer from "./visualizer"; // ✅ Fixed capitalization
import Catalogue from "./Catalougue"; // ✅ Fixed spelling
import Login from "./login"; // ✅ Fixed capitalization
import AboutPage from "./AboutPage";
import Navbar from "./Navbar";
import Footer from "./footer"; // ✅ Fixed capitalization
import "./styles.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLandingPage, setIsLandingPage] = useState(true);
  const [activePage, setActivePage] = useState("information");
  const [selectedModel, setSelectedModel] = useState<string | null>(null); // ✅ Correct type

  useEffect(() => {
    const timer = setTimeout(() => setIsLandingPage(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {!isLoggedIn ? (
        <Login onLoginSuccess={() => setIsLoggedIn(true)} /> // ✅ Now correctly typed
      ) : isLandingPage ? (
        <div className="landing-page">
          <div className="loader"></div>
          <h1>Welcome to A.M.O.S.</h1>
          <p>Adaptable Modular Organization System</p>
        </div>
      ) : (
        <>
          <Navbar setActivePage={setActivePage} />
          <div className="content-container">
            {activePage === "information" && <AboutPage />}
            {activePage === "visualizer" && (
              <Visualizer selectedModel={selectedModel} />
            )}
            {activePage === "catalogue" && (
              <Catalogue
                setActivePage={setActivePage}
                setSelectedModel={setSelectedModel} // ✅ Now correctly typed
              />
            )}
          </div>
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
