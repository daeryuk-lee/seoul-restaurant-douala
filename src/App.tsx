import { LanguageProvider } from './i18n/LanguageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Specialties from './components/Specialties';
import Menu from './components/Menu';
import Reservation from './components/Reservation';
import Footer from './components/Footer';

function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-black font-sans">
        <Navbar />
        <main>
          <Hero />
          <Specialties />
          <Menu />
          <Reservation />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;
