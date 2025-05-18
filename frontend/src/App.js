import React from "react";
import { Routes, Route } from "react-router-dom";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import HomePage from "./pages/HomePage";
import StoryGenerationPage from "./pages/StoryGenerationPage";
import ReportGenerationPage from "./pages/ReportGenerationPage";
import ResultsPage from "./pages/ResultsPage";
import ModelProviderPage from "./pages/settings/ModelProviderPage";
import SearchProviderPage from "./pages/settings/SearchProviderPage";
import AboutPage from "./pages/AboutPage";
import HistoryPage from "./pages/HistoryPage";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

function App() {
  return (
    <HeroUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="light">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Header />
          <div style={{ flexGrow: 1 }} className="p-6">
            <HomePage />
          </div>
          <Footer />
        </div>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}

export default App;
