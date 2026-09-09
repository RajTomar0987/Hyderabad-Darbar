import About from "../components/About";
import CateringCTA from "../components/CateringCTA";
import FeaturedDishes from "../components/FeaturedDishes";
import Features from "../components/Features";
import Gallery from "../components/Gallery";
import Hero from "../components/Hero";
import Intro from "../components/Intro";
import Location from "../components/Location";
import MenuSection from "../components/MenuSection";
import Testimonials from "../components/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <FeaturedDishes />
      <MenuSection compact />
      <About />
      <Gallery />
      <Features />
      <Testimonials />
      <CateringCTA />
      <Location />
    </>
  );
}
