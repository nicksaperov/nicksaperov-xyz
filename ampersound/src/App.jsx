import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Plus, ArrowRight, Mail, MapPin } from 'lucide-react';

/* STREAMING_CHUNK:Initializing the localization dictionary... */
const CONTENT_DICTIONARY = {
  en: {
    nav: {
      about: "About",
      creator: "The Creator",
      architecture: "Architecture",
      products: "Systems",
      contact: "Contacts"
    },
    hero: {
      title: "AmperSound",
      subtitle: "Pure. Powerful. Immersive Sound.",
      slogan: "Music that unites.",
      cta: "Discover the Architecture"
    },
    about: {
      tag: "The Philosophy",
      title: "Acoustic Architecture",
      p1: "Premium custom acoustic systems for clubs, open-air venues, and concert halls. If you demand pure, highly articulated sound for large audiences, this is your destination.",
      p2: "We specialize in developing architectural acoustic systems tailored to the unique dimensions of each space. Our approach relies on the deep integration of acoustic solutions into industrial design.",
      p3: "Every system is uniquely engineered: from acoustic calculations and driver selection to cabinet design. We create solutions that do not disrupt the architectural concept but organically enhance it.",
      cta: "Read More"
    },
    creator: {
      tag: "The Visionary",
      title: "Vitaly Suprun",
      dates: "1955 . 2021",
      p1: "Ampersound sound stations are built upon the formula of the great physicist Vitaly Suprun. Years ago, after developing electronics and noise suppression units for the space industry, he turned his genius toward sound.",
      p2: "Recognizing that electronic music was becoming a vital social need, he founded the Recreational and Technological Laboratory to create unique sound stations: Ampersound.",
      p3: "'Music is the harmonic oscillation of the air we breathe.' His legacy lives on through our strict adherence to his formulas, unified with modern build quality and components.",
      cta: "Explore the Legacy"
    },
    products: {
      tag: "Ready-to-Use",
      title: "Sound Systems",
      items: [
        {
          id: "chandelier",
          name: "Acoustic Chandelier",
          desc: "A fusion of powerful sound and stylish lighting. 360-degree dispersion.",
          specs: "3x 8-inch LF | 3x 1-inch HF | 36Hz to 20kHz",
          img: "33.jpeg"
        },
        {
          id: "white-4way",
          name: "White 4-Way System",
          desc: "Active separation system with phosphor coating. Immersive, high-density sound.",
          specs: "18-inch Sub | 15-inch Mid | 1.4-inch HF",
          img: "Ampersound white 4way_1.jpg"
        },
        {
          id: "type-o",
          name: "Type O Concept",
          desc: "Conceptual architectural speaker system designed by Yaroslav Rassadin.",
          specs: "Premium Design Concept | 2016",
          img: "25.jpeg"
        },
        {
          id: "sub-hst",
          name: "HST Subwoofer",
          desc: "Hybrid Slot Transmission technology for deep, saturated bass in a compact form.",
          specs: "18-inch driver | 1200W RMS | 26 to 400 Hz",
          img: "21.jpeg"
        },
        {
          id: "sat-15",
          name: "Satellite A&S 15W+1H",
          desc: "Active separation satellite. Maximum sound pressure up to 136 dB.",
          specs: "15-inch LF | 2-inch HF | 1.8kW Program",
          img: "23.jpeg"
        },
        {
          id: "monitor",
          name: "A&S Monitor",
          desc: "Helmholtz resonator design with a 12-inch high-sensitivity broadband speaker.",
          specs: "12-inch LF | 1-inch HF | 130dB Max SPL",
          img: "36.jpg"
        }
      ]
    },
    projects: {
      tag: "Realized",
      title: "Immersive Experiences",
      p1: "For the Futurione Emotions space, we engineered a 14 kW sound system. The four-way architecture, 8 subwoofers, and 4 satellites form a dense, spatial sound that amplifies visual emotions.",
      p2: "Ampersound: Where art meets acoustic technology."
    },
    footer: {
      contact: "Get in Touch",
      email: "info@ampersound.pro",
      location: "Moscow, Russia",
      rights: "© 2026 AmperSound. All rights reserved."
    }
  },
  ru: {
    nav: {
      about: "О нас",
      creator: "Создатель",
      architecture: "Архитектура",
      products: "Системы",
      contact: "Контакты"
    },
    hero: {
      title: "AmperSound",
      subtitle: "Чистый. Мощный. Объемный звук.",
      slogan: "Музыка, которая объединяет.",
      cta: "Изучить Архитектуру"
    },
    about: {
      tag: "Философия",
      title: "Архитектура Звука",
      p1: "Мощные акустические системы по индивидуальному заказу для клубов, открытых площадок и концертных залов. Для тех, кто ценит чистый, разборчивый звук.",
      p2: "Мы специализируемся на разработке архитектурных акустических систем, создаваемых с учетом уникальных особенностей каждого пространства. Наш подход основан на глубокой интеграции акустических решений в промышленный дизайн.",
      p3: "Каждая система разрабатывается индивидуально: от расчетов и подбора излучателей до проектирования формы корпуса. Решения, которые органично дополняют и усиливают пространство.",
      cta: "Узнать больше"
    },
    creator: {
      tag: "Визионер",
      title: "Виталий Супрун",
      dates: "1955 . 2021",
      p1: "Звуковые станции Ampersound собраны по формуле великого физика Супруна Виталия Григорьевича. Разработчик электроники для космической отрасли, он посвятил себя созданию идеального звука.",
      p2: "Осознав потребность общества в качественном звучании, он открыл лабораторию для создания уникальных саунд-станций: Ampersound.",
      p3: "'Музыка: это гармонические колебания воздуха, которым мы дышим.' Мы продолжаем его путь, строго соблюдая формулы и совершенствуя качество сборки.",
      cta: "Изучить Наследие"
    },
    products: {
      tag: "Готовые Решения",
      title: "Акустические Системы",
      items: [
        {
          id: "chandelier",
          name: "Акустическая люстра",
          desc: "Объединение мощного звука и освещения. Круговая направленность 360 градусов.",
          specs: "3x 8-дюйм динамика | 3x 1-дюйм драйвера | 36 Гц до 20 кГц",
          img: "33.jpeg"
        },
        {
          id: "white-4way",
          name: "Ampersound White 4-Way",
          desc: "Четырёхполосный комплект активного разделения в белом цвете с фосфорным покрытием.",
          specs: "18-дюйм Саб | 15-дюйм Мид | 1.4-дюйм ВЧ",
          img: "Ampersound white 4way_1.jpg"
        },
        {
          id: "type-o",
          name: "Концепт Type O",
          desc: "Архитектурная акустическая система. Дизайн концепта: Ярослав Рассадин.",
          specs: "Премиальный дизайн | 2016",
          img: "25.jpeg"
        },
        {
          id: "sub-hst",
          name: "Сабвуфер HST",
          desc: "Технология Hybrid Slot Transmission. Глубокий бас при компактных габаритах.",
          specs: "18-дюйм излучатель | 1200 Вт RMS | 26 до 400 Гц",
          img: "21.jpeg"
        },
        {
          id: "sat-15",
          name: "Сателлит A&S 15W+1H",
          desc: "Сателлит активного разделения. Максимальное звуковое давление 136 дБ.",
          specs: "15-дюйм НЧ | 2-дюйм ВЧ | 1.8 кВт Prog",
          img: "23.jpeg"
        },
        {
          id: "monitor",
          name: "Монитор A&S",
          desc: "Резонатор Гельмгольца с 12-дюймовым широкополосным динамиком.",
          specs: "12-дюйм НЧ | 1-дюйм ВЧ | 130 дБ SPL",
          img: "36.jpg"
        }
      ]
    },
    projects: {
      tag: "Реализованные",
      title: "Проекты и Инсталляции",
      p1: "Для арт-пространства Futurione Emotions мы создали звуковую систему мощностью 14 кВт. Четырехполосная архитектура формирует плотное, пространственное звучание.",
      p2: "Ampersound: Часть искусства и технологии."
    },
    footer: {
      contact: "Свяжитесь с нами",
      email: "info@ampersound.pro",
      location: "Москва, Россия",
      rights: "© 2026 AmperSound. Все права защищены."
    }
  }
};

/* STREAMING_CHUNK:Building the Navigation Component... */
const Navbar = ({ lang, setLang, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-4 cursor-pointer">
          <img src="logo.png" alt="AmperSound Logo" className={`h-8 transition-all ${scrolled ? 'invert' : 'invert-0'}`} />
          <span className={`text-xl tracking-widest font-light uppercase ${scrolled ? 'text-zinc-900' : 'text-white'}`}>
            AmperSound
          </span>
        </div>

        {/* Desktop Nav */}
        <div className={`hidden md:flex items-center gap-8 text-sm tracking-wide font-light ${scrolled ? 'text-zinc-800' : 'text-zinc-200'}`}>
          <a href="#about" className="hover:text-yellow-500 transition-colors">{t.nav.about}</a>
          <a href="#creator" className="hover:text-yellow-500 transition-colors">{t.nav.creator}</a>
          <a href="#architecture" className="hover:text-yellow-500 transition-colors">{t.nav.architecture}</a>
          <a href="#products" className="hover:text-yellow-500 transition-colors">{t.nav.products}</a>
          <a href="#contact" className="hover:text-yellow-500 transition-colors">{t.nav.contact}</a>
          
          <button 
            onClick={() => setLang(lang === 'en' ? 'ru' : 'en')}
            className="flex items-center gap-1 hover:text-yellow-500 transition-colors ml-4"
          >
            <Globe size={16} />
            <span className="uppercase">{lang}</span>
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className={`md:hidden ${scrolled ? 'text-zinc-900' : 'text-white'}`} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg py-6 px-6 flex flex-col gap-6 md:hidden">
          <a href="#about" onClick={() => setIsOpen(false)} className="text-zinc-900 text-lg font-light">{t.nav.about}</a>
          <a href="#creator" onClick={() => setIsOpen(false)} className="text-zinc-900 text-lg font-light">{t.nav.creator}</a>
          <a href="#architecture" onClick={() => setIsOpen(false)} className="text-zinc-900 text-lg font-light">{t.nav.architecture}</a>
          <a href="#products" onClick={() => setIsOpen(false)} className="text-zinc-900 text-lg font-light">{t.nav.products}</a>
          <a href="#contact" onClick={() => setIsOpen(false)} className="text-zinc-900 text-lg font-light">{t.nav.contact}</a>
          <button 
            onClick={() => { setLang(lang === 'en' ? 'ru' : 'en'); setIsOpen(false); }}
            className="flex items-center gap-2 text-zinc-900 text-lg font-light"
          >
            <Globe size={20} />
            <span className="uppercase">{lang === 'en' ? 'Switch to Russian' : 'Switch to English'}</span>
          </button>
        </div>
      )}
    </nav>
  );
};

/* STREAMING_CHUNK:Constructing the Hero Section... */
const Hero = ({ t }) => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-zinc-900">
      <div className="absolute inset-0 z-0">
        <img 
          src="31.jpeg" 
          alt="AmperSound Wall Complex" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-zinc-50"></div>
      </div>
      
      <div className="relative z-10 text-center px-6 mt-20">
        <h1 className="text-5xl md:text-8xl text-white font-light tracking-tighter mb-6">
          AmperSound
        </h1>
        <p className="text-xl md:text-2xl text-zinc-200 font-light tracking-wide mb-2">
          {t.hero.subtitle}
        </p>
        <p className="text-yellow-500 text-lg md:text-xl font-medium tracking-widest uppercase mb-12">
          {t.hero.slogan}
        </p>
        
        <a href="#about" className="inline-flex items-center gap-3 border border-white text-white px-8 py-4 hover:bg-white hover:text-zinc-900 transition-all duration-300">
          <span className="text-sm tracking-widest uppercase">{t.hero.cta}</span>
          <ArrowRight size={16} />
        </a>
      </div>
    </section>
  );
};

/* STREAMING_CHUNK:Developing the About and Architecture Sections... */
const AboutSection = ({ t }) => {
  return (
    <section id="about" className="py-24 md:py-40 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="order-2 md:order-1 relative">
          <img src="35.jpg" alt="Acoustic Architecture Event" className="w-full h-auto object-cover shadow-sm hover:shadow-md transition-all duration-700" />
          <div className="absolute inset-0 bg-black/5 hover:bg-transparent transition-all duration-700"></div>
        </div>
        <div className="order-1 md:order-2">
          <p className="text-yellow-600 tracking-widest uppercase text-xs font-semibold mb-4">{t.about.tag}</p>
          <h2 className="text-4xl md:text-5xl font-light text-zinc-900 tracking-tight mb-8">
            {t.about.title}
          </h2>
          <div className="space-y-6 text-zinc-600 font-light leading-relaxed">
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
            <p>{t.about.p3}</p>
          </div>
          <button className="mt-10 flex items-center gap-2 text-zinc-900 hover:text-yellow-600 transition-colors uppercase tracking-widest text-sm border-b border-zinc-300 pb-1">
            {t.about.cta} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

/* STREAMING_CHUNK:Implementing the Creator Tribute Section... */
const CreatorSection = ({ t }) => {
  return (
    <section id="creator" className="py-24 md:py-40 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-yellow-600 tracking-widest uppercase text-xs font-semibold mb-4">{t.creator.tag}</p>
          <h2 className="text-4xl md:text-5xl font-light text-zinc-900 tracking-tight mb-2">
            {t.creator.title}
          </h2>
          <p className="text-zinc-400 tracking-widest text-sm mb-8">{t.creator.dates}</p>
          <div className="space-y-6 text-zinc-600 font-light leading-relaxed">
            <p>{t.creator.p1}</p>
            <p>{t.creator.p2}</p>
            <p className="pl-6 border-l-2 border-yellow-500 italic text-zinc-800">{t.creator.p3}</p>
          </div>
          <button className="mt-10 flex items-center gap-2 text-zinc-900 hover:text-yellow-600 transition-colors uppercase tracking-widest text-sm border-b border-zinc-300 pb-1">
            {t.creator.cta} <ArrowRight size={16} />
          </button>
        </div>
        <div>
          <img src="22.jpeg" alt="Vitaly Suprun : AmperSound Visionary" className="w-full h-auto object-cover shadow-sm rounded-sm grayscale hover:grayscale-0 transition-all duration-700" />
        </div>
      </div>
    </section>
  );
};

const ArchitectureSection = ({ t }) => {
  return (
    <section id="architecture" className="py-24 md:py-40 bg-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-yellow-500 tracking-widest uppercase text-xs font-semibold mb-4">{t.projects.tag}</p>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-8">
            {t.projects.title}
          </h2>
          <div className="space-y-6 text-zinc-400 font-light leading-relaxed">
            <p>{t.projects.p1}</p>
            <p className="text-white font-medium border-l-2 border-yellow-500 pl-4">{t.projects.p2}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="mt-12">
            <img src="30.jpeg" alt="Acoustic Architecture Structure" className="w-full h-auto object-cover shadow-lg hover:scale-[1.02] transition-transform duration-700" />
          </div>
          <div>
            <img src="16.jpeg" alt="System in Action Forest" className="w-full h-auto object-cover shadow-lg hover:scale-[1.02] transition-transform duration-700" />
          </div>
        </div>
      </div>
    </section>
  );
};

const ProductGrid = ({ t }) => {
  return (
    <section id="products" className="py-24 md:py-40 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-yellow-600 tracking-widest uppercase text-xs font-semibold mb-4">{t.products.tag}</p>
          <h2 className="text-4xl md:text-5xl font-light text-zinc-900 tracking-tight">
            {t.products.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {t.products.items.map((item) => (
            <div key={item.id} className="group cursor-pointer flex flex-col h-full">
              <div className="bg-white p-8 mb-6 flex-grow flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.02] shadow-sm hover:shadow-md">
                {/* Fallback pattern to ensure grid integrity even if image mapping changes */}
                <img src={item.img} alt={item.name} className="max-h-72 object-contain mix-blend-multiply" />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-zinc-900 mb-1">{item.name}</h3>
                  <p className="text-sm text-zinc-500 font-light mb-3 leading-relaxed">{item.desc}</p>
                  <p className="text-xs text-zinc-400 tracking-wide font-medium">{item.specs}</p>
                </div>
                <button className="text-zinc-300 group-hover:text-yellow-500 transition-colors p-1 ml-4 flex-shrink-0">
                  <Plus size={24} strokeWidth={1} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* STREAMING_CHUNK:Finalizing with the Footer and App Assembly... */
const Footer = ({ t }) => {
  return (
    <footer id="contact" className="bg-zinc-900 text-zinc-400 py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-zinc-800 pb-16 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <img src="logo.png" alt="AmperSound Logo" className="h-6 invert opacity-50" />
            <span className="text-lg tracking-widest font-light uppercase text-zinc-300">AmperSound</span>
          </div>
          <p className="font-light text-sm max-w-xs leading-relaxed">
            {t.projects.p2}
          </p>
        </div>
        
        <div>
          <h4 className="text-zinc-200 uppercase tracking-widest text-sm mb-6">{t.footer.contact}</h4>
          <ul className="space-y-4 font-light text-sm">
            <li className="flex items-center gap-3 hover:text-white cursor-pointer transition-colors">
              <Mail size={16} /> {t.footer.email}
            </li>
            <li className="flex items-center gap-3 hover:text-white cursor-pointer transition-colors">
              <MapPin size={16} /> {t.footer.location}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-zinc-200 uppercase tracking-widest text-sm mb-6">Social</h4>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 border border-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-800 hover:text-white transition-all">
              <span className="text-xs font-bold tracking-widest">IG</span>
            </a>
            <a href="#" className="w-10 h-10 border border-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-800 hover:text-white transition-all">
              <Globe size={18} />
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 text-center text-xs font-light tracking-wide">
        {t.footer.rights}
      </div>
    </footer>
  );
};

export default function App() {
  const [lang, setLang] = useState('ru'); // Defaulting to Russian based on source text

  // Defensive programming: Verify language exists in dictionary
  const t = CONTENT_DICTIONARY[lang] || CONTENT_DICTIONARY['en'];

  return (
    <div className="min-h-screen font-sans selection:bg-yellow-500 selection:text-white bg-zinc-50">
      <Navbar lang={lang} setLang={setLang} t={t} />
      <main>
        <Hero t={t} />
        <AboutSection t={t} />
        <CreatorSection t={t} />
        <ArchitectureSection t={t} />
        <ProductGrid t={t} />
      </main>
      <Footer t={t} />
    </div>
  );
}