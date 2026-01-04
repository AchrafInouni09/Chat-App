import Footer from './ui/Footer';
import Ticker from './ui/Ticker';
import HeroSection from './ui/HeroSection';
import FeaturesSection from './ui/FeaturesSection';
import Nav from './ui/Nav';

const HomePage = () => {
  

  return (
    <div  className="min-h-screen bg-grunge-white font-mono overflow-x-hidden">
      <Nav />
      <HeroSection />
      <Ticker />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default HomePage;
