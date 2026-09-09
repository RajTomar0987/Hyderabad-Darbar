import Lenis from "lenis";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import MobileCTA from "./components/MobileCTA";
import Navbar from "./components/Navbar";
import AboutPage from "./pages/AboutPage";
import CateringPage from "./pages/CateringPage";
import ContactPage from "./pages/ContactPage";
import GalleryPage from "./pages/GalleryPage";
import Home from "./pages/Home";
import MenuPage from "./pages/MenuPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function App() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <div className="pb-[72px] md:pb-0">
        <Routes>
          <Route path="/" element={<main id="main"><Home /></main>} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/catering" element={<CateringPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<main id="main"><Home /></main>} />
        </Routes>
      </div>
      <Footer />
      <MobileCTA />
    </BrowserRouter>
  );
}
