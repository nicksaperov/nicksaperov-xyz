import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Menu, X, Globe, Plus, ArrowRight, Mail, MapPin, Shield, Trash2, ArrowLeft, Upload, Loader2, LogOut } from 'lucide-react';

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

const getFirebaseConfig = () => {
  return {
    apiKey: "AIzaSyCK2nTz6xHoaYPRUmUyFXpu7-l9u1Hilug",
    authDomain: "nicksaperov-portfolio-2026.firebaseapp.com",
    projectId: "nicksaperov-portfolio-2026",
    storageBucket: "nicksaperov-portfolio-2026.firebasestorage.app",
    messagingSenderId: "769848303631",
    appId: "1:769848303631:web:45a79dfe197fdb1a20c37a"
  };
};

const app = initializeApp(getFirebaseConfig());
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const COLLECTION_PATH = 'artifacts/ampersound/public/data/products';
const STORAGE_FOLDER = 'ampersound-media';

const CONTENT_DICTIONARY = {
  ru: {
    nav: { about: "О нас", creator: "Создатель", philosophy: "Философия", products: "Производство", projects: "Инсталляции", contact: "Контакты" },
    hero: { title: "AmperSound", subtitle: "Чистый. Мощный. Объемный звук.", slogan: "Музыка, которая объединяет.", cta: "Изучить Архитектуру" },
    about: { tag: "Философия", title: "Архитектура Звука", p1: "Мощные акустические системы по индивидуальному заказу для клубов, открытых площадок и концертных залов.", p2: "Мы специализируемся на разработке архитектурных акустических систем, создаваемых с учетом уникальных особенностей каждого пространства. Наш подход основан на глубокой интеграции акустических решений в промышленный дизайн.", p3: "Каждая система разрабатывается индивидуально: от расчетов и подбора излучателей до проектирования формы корпуса.", cta: "Узнать больше о философии" },
    creator: { tag: "Визионер", title: "Виталий Супрун", dates: "1955 . 2021", p1: "Звуковые станции Ampersound собраны по формуле великого физика Супруна Виталия Григорьевича. Разработчик электроники для космической отрасли, он посвятил себя созданию идеального звука.", p2: "Осознав потребность общества в качественном звучании, он открыл лабораторию для создания уникальных саунд-станций: Ampersound.", p3: "«Музыка — это гармонические колебания воздуха, которым мы дышим.» Мы продолжаем его путь, строго соблюдая формулы и совершенствуя качество сборки.", cta: "Изучить Наследие" },
    projects: { tag: "Реализованные", title: "Инсталляции", p1: "От концептуальных арт-пространств до массивных опен-эйров. Наши системы работают там, где требуется бескомпромиссное качество.", p2: "Ampersound: Часть искусства и технологии." },
    footer: { contact: "Свяжитесь с нами", email: "info@ampersound.pro", location: "Москва, Россия", rights: "© 2026 AmperSound. Все права защищены." }
  }
};

const INITIAL_PRODUCTS = [
  {
    id: "chandelier",
    name: "Акустические люстры",
    category: "Архитектурные",
    desc: "Акустические люстры Ampersound усовершенствованного поколения. Собраны для ресторана “Gussi“ на Красной Поляне. Решение, объединяющее мощный звук и стильное освещение. Полностью круговая диаграмма направленности в 360°.",
    specs: "3x 8″ (200Вт) | 3x 1″ (50Вт) | 360°",
    power: "750",
    dimensions: "Индивидуальные",
    price: "По запросу",
    img: "/33.jpeg"
  },
  {
    id: "sub-hst",
    name: "Сабвуфер HST",
    category: "Сабвуферы",
    desc: "Технология Hybrid Slot Transmission (HST) сочетает эффективность щелевого фазоинвертора и оптимизированную конструкцию воздушного канала. Глубокий и насыщенный бас при компактных габаритах.",
    specs: "18″ НЧ | 26-400 Гц | 130 дБ | 8 Ом",
    power: "1200",
    dimensions: "Компакт",
    price: "По запросу",
    img: "/21.jpeg"
  },
  {
    id: "white-4way",
    name: "White 4-Way",
    category: "Системы",
    desc: "Новый четырёхполосный комплект активного разделения. Выполнен в белом цвете с фосфорным покрытием. Сабвуферы Transmission Line, сателлиты с 15” мидбасовым драйвером и компрессионный рупор.",
    specs: "18” Сабвуферы | 15” Мидбас | 1.4” ВЧ",
    power: "14000",
    dimensions: "Архитектурная сборка",
    price: "По запросу",
    img: "/Ampersound white 4way_4.jpg"
  },
  {
    id: "sat-15w",
    name: "Сателлит A&S (15W+1H)",
    category: "Активные",
    desc: "Сателлит активного разделения. Максимальный уровень звукового давления – 136 дБ. Компрессионный ВЧ драйвер с шёлковой диафрагмой. Стальная решётка с порошковым покрытием.",
    specs: "15″ НЧ | 1″ Твиттер | 48Гц-20кГц | 90°х40°",
    power: "1800",
    dimensions: "Custom",
    price: "По запросу",
    img: "/23_2.jpeg"
  },
  {
    id: "monitor-12w",
    name: "Монитор A&S (12W+1H)",
    category: "Пассивные",
    desc: "Монитор конструктивно выполнен в виде резонатора Гельмгольца с выходом тоннеля на задней панели. 12-дюймовый широкополосный динамик и кольцевой драйвер с тканевой диафрагмой.",
    specs: "12″ НЧ | 1″ Твиттер | 62-20000 Гц | 130дБ",
    power: "900",
    dimensions: "Custom",
    price: "По запросу",
    img: "/36_2.jpg"
  },
  {
    id: "horn-as",
    name: "Рупор A&S",
    category: "Рупорные",
    desc: "Рупор широкодиапазонный свёрнутый компрессионный с мощным драйвером. Драйвер с легчайшей майларовой диафрагмой оптимально нагружен на трактрисный рупор и замкнутый демпфированный объём.",
    specs: "2″ СЧ | 200Гц-7кГц | 45°х45° | 16 Ом",
    power: "100",
    dimensions: "Custom",
    price: "По запросу",
    img: "/19_2.jpeg"
  },
  {
    id: "front-fill",
    name: "Фронт-филл (212+Hi)",
    category: "Пассивные",
    desc: "Акустическая система включает два широкополосных 12″ динамика и центральный твиттер. Конструкция корпуса направляет звуковую энергию, минимизируя паразитные отражения от поверхностей.",
    specs: "2х 12″ ШП | 1.4″ Твиттер | 65Гц-20кГц",
    power: "700",
    dimensions: "375x900 мм",
    price: "По запросу",
    img: "/12.jpeg"
  },
  {
    id: "sub-tl",
    name: "Сабвуфер Trans-Line",
    category: "Сабвуферы",
    desc: "Выполнен в виде трансмиссионной линии в прямоугольном корпусе. Позволяет существенно расширить диапазон в область самых низких частот и достичь высочайшего давления без резонансов.",
    specs: "18″ НЧ | 26-400 Гц | 130 дБ | 8 Ом",
    power: "2000",
    dimensions: "Custom",
    price: "По запросу",
    img: "/27.jpeg"
  }
];

// --- UTILS ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const Navbar = ({ lang, setLang, t, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDark = isHome ? !scrolled : false;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${!isDark ? 'bg-white/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-4 cursor-pointer">
          <img src="/logo.png" alt="AmperSound Logo" className={`h-8 transition-all ${!isDark ? 'invert' : 'invert-0'}`} />
          <span className={`text-xl tracking-widest font-bold uppercase ${!isDark ? 'text-zinc-900' : 'text-white'}`}>
            AmperSound
          </span>
        </Link>

        <div className={`hidden md:flex items-center gap-8 text-sm tracking-wide font-bold uppercase ${!isDark ? 'text-zinc-800' : 'text-zinc-200'}`}>
          <Link to="/philosophy" className="hover:text-yellow-500 transition-colors">{t.nav.philosophy}</Link>
          <Link to="/creator" className="hover:text-yellow-500 transition-colors">{t.nav.creator}</Link>
          <Link to="/production" className="hover:text-yellow-500 transition-colors">{t.nav.products}</Link>
          <Link to="/projects" className="hover:text-yellow-500 transition-colors">{t.nav.projects}</Link>
          
          {user && (
             <Link to="/admin" className="flex items-center gap-1 text-yellow-600 hover:text-yellow-500 transition-colors ml-2 font-black bg-yellow-500/10 px-3 py-1 rounded">
               <Shield size={16} /> CMS
             </Link>
          )}
        </div>

        <button className={`md:hidden ${!isDark ? 'text-zinc-900' : 'text-white'}`} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg py-6 px-6 flex flex-col gap-6 md:hidden border-t border-zinc-100">
          <Link to="/philosophy" onClick={() => setIsOpen(false)} className="text-zinc-900 text-lg font-medium">{t.nav.philosophy}</Link>
          <Link to="/creator" onClick={() => setIsOpen(false)} className="text-zinc-900 text-lg font-medium">{t.nav.creator}</Link>
          <Link to="/production" onClick={() => setIsOpen(false)} className="text-zinc-900 text-lg font-medium">{t.nav.products}</Link>
          <Link to="/projects" onClick={() => setIsOpen(false)} className="text-zinc-900 text-lg font-medium">{t.nav.projects}</Link>
          {user && (
            <Link to="/admin" onClick={() => setIsOpen(false)} className="text-yellow-600 text-lg font-medium flex items-center gap-2">
              <Shield size={20} /> CMS Admin
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

const ProductGrid = ({ products, title, tag, showAllLink = false }) => {
  const navigate = useNavigate();
  return (
    <div className="w-full">
      {(title || tag) && (
        <div className="text-center mb-16">
          {tag && <p className="text-yellow-600 tracking-widest uppercase text-xs font-bold mb-4">{tag}</p>}
          {title && <h2 className="text-4xl md:text-5xl font-light text-zinc-900 tracking-tight">{title}</h2>}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {products.map((item) => (
          <div key={item.id} onClick={() => navigate(`/product/${item.id}`)} className="group cursor-pointer flex flex-col h-full bg-white border border-zinc-100 hover:shadow-2xl transition-all duration-500 rounded-sm">
            <div className="p-8 mb-6 flex-grow flex items-center justify-center overflow-hidden bg-zinc-50">
              <img src={item.img} alt={item.name} className="max-h-72 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="p-6 pt-0 flex justify-between items-start mt-auto">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-yellow-600 block mb-2">{item.category}</span>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">{item.name}</h3>
                <p className="text-sm text-zinc-500 font-light line-clamp-2 leading-relaxed">{item.desc}</p>
              </div>
              <button className="text-zinc-300 group-hover:text-yellow-500 transition-colors p-2 mt-2 ml-4 flex-shrink-0 bg-zinc-50 rounded-full group-hover:bg-yellow-50">
                <Plus size={20} strokeWidth={2} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {showAllLink && (
        <div className="mt-16 flex justify-center">
          <Link to="/production" className="inline-flex items-center gap-3 border border-zinc-300 text-zinc-900 px-8 py-4 rounded-sm hover:border-yellow-500 hover:text-yellow-600 transition-colors font-medium text-sm tracking-widest uppercase">
            Смотреть все системы <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
};

const Footer = ({ t }) => (
  <footer className="bg-zinc-900 text-zinc-400 py-20 border-t-4 border-yellow-500">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <img src="/logo.png" alt="AmperSound Logo" className="h-6 invert opacity-50" />
          <span className="text-lg tracking-widest font-bold uppercase text-zinc-300">AmperSound</span>
        </div>
        <p className="font-light text-sm max-w-xs leading-relaxed">Глубокая интеграция акустических решений в промышленный дизайн и архитектуру объекта.</p>
      </div>
      <div>
        <h4 className="text-zinc-200 uppercase tracking-widest text-sm mb-6 font-bold">{t.footer.contact}</h4>
        <ul className="space-y-4 font-light text-sm">
          <li className="flex items-center gap-3 hover:text-white transition-colors"><Mail size={16} /> {t.footer.email}</li>
          <li className="flex items-center gap-3 hover:text-white transition-colors"><MapPin size={16} /> {t.footer.location}</li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 text-center text-xs font-light tracking-wide flex justify-between items-center border-t border-zinc-800 pt-8">
      <span>{t.footer.rights}</span>
      <Link to="/admin" className="opacity-10 hover:opacity-100 transition-opacity uppercase tracking-widest font-bold">CMS</Link>
    </div>
  </footer>
);

const HomePage = ({ t, displayProducts }) => (
  <div className="animate-in fade-in duration-700">
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-zinc-900">
      <div className="absolute inset-0 z-0">
        <img src="/31.jpeg" alt="Background" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-zinc-50"></div>
      </div>
      <div className="relative z-10 text-center px-6 mt-20 max-w-5xl">
        <h1 className="text-5xl md:text-8xl lg:text-9xl text-yellow-500 font-black tracking-[0.2em] uppercase mb-6 drop-shadow-2xl">
          AmperSound
        </h1>
        <p className="text-xl md:text-3xl text-zinc-100 font-light tracking-wide mb-4 drop-shadow-md">
          {t.hero.subtitle}
        </p>
        <p className="text-yellow-400 text-lg md:text-xl font-medium tracking-widest uppercase mb-12 drop-shadow-md">
          {t.hero.slogan}
        </p>
        <Link to="/philosophy" className="inline-flex items-center gap-4 border-2 border-yellow-500 text-white px-10 py-5 rounded-md hover:bg-yellow-500 hover:text-zinc-900 transition-all duration-300 backdrop-blur-sm shadow-lg">
          <span className="text-sm md:text-base tracking-[0.15em] font-bold uppercase">{t.hero.cta}</span>
          <ArrowRight size={20} />
        </Link>
      </div>
    </section>
    
    <section className="py-24 md:py-40 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="order-2 md:order-1 relative"><img src="/35.jpg" alt="Acoustic" className="w-full h-auto object-cover shadow-2xl rounded-sm" /></div>
        <div className="order-1 md:order-2">
          <p className="text-yellow-600 tracking-widest uppercase text-xs font-bold mb-4">{t.about.tag}</p>
          <h2 className="text-4xl md:text-5xl font-light text-zinc-900 tracking-tight mb-8">{t.about.title}</h2>
          <div className="space-y-6 text-zinc-600 font-light leading-relaxed"><p>{t.about.p1}</p><p>{t.about.p2}</p></div>
          <Link to="/philosophy" className="mt-10 inline-flex items-center gap-3 border border-zinc-300 text-zinc-900 px-8 py-4 rounded-sm hover:border-yellow-500 hover:text-yellow-600 transition-colors font-medium text-sm tracking-widest uppercase">
            {t.about.cta} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>

    {/* RESTORED: Top 3 Products Grid on Home Page */}
    <section className="py-24 md:py-40 bg-white border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-6">
        <ProductGrid 
          products={displayProducts.slice(0, 3)} 
          title="Флагманские Системы" 
          tag="Готовые Решения" 
          showAllLink={true} 
        />
      </div>
    </section>

    <section className="py-24 md:py-40 bg-zinc-50 border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-yellow-600 tracking-widest uppercase text-xs font-bold mb-4">{t.creator.tag}</p>
          <h2 className="text-4xl md:text-5xl font-light text-zinc-900 tracking-tight mb-2">{t.creator.title}</h2>
          <p className="text-zinc-400 tracking-widest text-sm mb-8 font-medium">{t.creator.dates}</p>
          <div className="space-y-6 text-zinc-600 font-light leading-relaxed"><p>{t.creator.p1}</p><p className="pl-6 border-l-4 border-yellow-500 italic text-zinc-800 font-medium">{t.creator.p3}</p></div>
          <Link to="/creator" className="mt-10 inline-flex items-center gap-3 bg-zinc-900 text-white px-8 py-4 rounded-sm hover:bg-yellow-600 transition-colors font-medium text-sm tracking-widest uppercase">
            {t.creator.cta} <ArrowRight size={16} />
          </Link>
        </div>
        <div><img src="/22.jpeg" alt="Vitaly" className="w-full h-auto object-cover shadow-2xl rounded-sm grayscale hover:grayscale-0 transition-all duration-700" /></div>
      </div>
    </section>

    <section id="architecture" className="py-24 md:py-40 bg-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-yellow-500 tracking-widest uppercase text-xs font-bold mb-4">{t.projects.tag}</p>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-8">{t.projects.title}</h2>
          <div className="space-y-6 text-zinc-400 font-light leading-relaxed">
            <p>{t.projects.p1}</p>
            <p className="text-white font-medium border-l-2 border-yellow-500 pl-4">{t.projects.p2}</p>
          </div>
          <Link to="/projects" className="mt-10 inline-flex items-center gap-3 border border-zinc-700 text-zinc-300 px-8 py-4 hover:border-yellow-500 hover:text-yellow-500 transition-all duration-300 font-bold">
            <span className="text-sm tracking-widest uppercase">Смотреть инсталляции</span>
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="mt-12"><img src="/30.jpeg" alt="Architecture" className="w-full h-auto object-cover shadow-lg hover:scale-[1.02] transition-transform duration-700" /></div>
          <div><img src="/16.jpeg" alt="Forest System" className="w-full h-auto object-cover shadow-lg hover:scale-[1.02] transition-transform duration-700" /></div>
        </div>
      </div>
    </section>
  </div>
);

const CreatorPage = () => (
  <div className="pt-32 pb-24 max-w-5xl mx-auto px-6 min-h-screen animate-in fade-in duration-700 bg-zinc-50">
    <Link to="/" className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-zinc-400 hover:text-yellow-600 mb-12 transition-colors"><ArrowLeft size={16} /> На главную</Link>
    <div className="mb-16">
      <span className="text-[10px] font-bold tracking-widest uppercase text-yellow-600 border border-yellow-600 px-3 py-1 rounded-full">Наследие</span>
      <h1 className="text-4xl md:text-6xl font-light text-zinc-900 mt-6 mb-6 tracking-tight">Виталий Супрун</h1>
      <p className="text-xl font-medium text-zinc-800 tracking-wide leading-relaxed">«На пути к чистому, мощному, объёмному звуку. К музыке, которая объединяет!»</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
      <div className="space-y-6 text-zinc-600 font-light leading-relaxed text-lg">
        <p>Звуковые станции Ampersound активного и пассивного разделения собраны по формуле великого физика <strong>С</strong>упруна <strong>В</strong>италия <strong>Г</strong>ригорьевича (СВГ).</p>
        <p>Много лет назад он решил кардинально изменить свою жизнь. Будучи разработчиком электроники со своим конструкторским бюро и производством, он в течение 10 лет разрабатывал и поставлял микроплаты управления и узлы подавления радиопомех для Ракетной корпорации «Энергия».</p>
      </div>
      <div><img src="/20.jpeg" alt="Работа за ноутбуком" className="w-full h-auto object-cover shadow-2xl rounded-sm grayscale hover:grayscale-0 transition-all duration-700" /></div>
    </div>

    <div className="bg-zinc-900 text-white p-12 mb-16 rounded-sm shadow-2xl relative overflow-hidden border-l-4 border-yellow-500">
      <div className="relative z-10">
        <p className="text-2xl font-light italic mb-6">«Музыка — это гармонические колебания воздуха, которым мы дышим.»</p>
        <p className="text-xs tracking-widest uppercase text-yellow-500 font-bold">— Виталий Супрун</p>
      </div>
      <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none"><span className="text-[250px] font-black leading-none">СВГ</span></div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
      <div className="order-2 md:order-1 grid grid-cols-2 gap-4">
        <img src="/13.jpeg" alt="Портрет 1" className="w-full h-full object-cover shadow-lg rounded-sm" />
        <img src="/14.jpeg" alt="Портрет 2" className="w-full h-full object-cover shadow-lg rounded-sm mt-8" />
      </div>
      <div className="order-1 md:order-2 space-y-6 text-zinc-600 font-light leading-relaxed text-lg">
        <p>Попав на мероприятие электронной музыки, он осознал, что музыкальная тема становится очень актуальной общественной потребностью. Это вдохновило его открыть Рекреационно-технологическую лабораторию для создания уникальных саунд-станций: <strong>Ampersound</strong>.</p>
        <p className="pl-6 border-l-4 border-yellow-500 italic font-medium text-zinc-800">«Нет ни одной мысли остановиться на достигнутом, всегда есть куда совершеннее».</p>
      </div>
    </div>

    <div className="border-t border-zinc-200 pt-16 grid grid-cols-1 md:grid-cols-12 gap-12">
      <div className="md:col-span-8 space-y-6 text-zinc-600 font-light leading-relaxed text-lg">
        <p><strong>10 апреля 1955 года</strong> родился наш друг, наставник, учитель и человек, которого мы с гордостью называем своим вторым отцом. Он был великим человеком, Физиком с большой буквы и Человеком с огромным сердцем.</p>
        <p><strong>27 марта 2021 года</strong> Виталий Григорьевич ушёл из жизни, но его дело живо. Мы продолжаем его путь, строго соблюдая формулу, которую он сам разработал. Мы лишь актуализировали качество сборки, усовершенствовали комплектующие и улучшили покрытие. Остальное осталось по его заветам.</p>
        <p className="font-bold text-zinc-900 mt-8">Мы безмерно благодарны ему за знания, поддержку и огромный жизненный опыт. Пока живёт его дело, жива и его память. Светлая память, Учитель!</p>
      </div>
      <div className="md:col-span-4"><img src="/15.jpeg" alt="Наследие" className="w-full h-auto object-cover shadow-2xl rounded-sm" /></div>
    </div>
  </div>
);

const PhilosophyPage = () => {
  return (
    <div className="pt-32 pb-24 max-w-5xl mx-auto px-6 min-h-screen animate-in fade-in duration-700 bg-white">
      <Link to="/" className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-zinc-400 hover:text-yellow-600 mb-12 transition-colors">
        <ArrowLeft size={16} /> На главную
      </Link>

      <div className="mb-16">
        <span className="text-[10px] font-bold tracking-widest uppercase text-yellow-600 border border-yellow-600 px-3 py-1 rounded-full">
          Манифест
        </span>
        <h1 className="text-4xl md:text-6xl font-light text-zinc-900 mt-6 mb-6 tracking-tight">
          Архитектура Звука
        </h1>
        <p className="text-xl font-medium text-zinc-800 tracking-wide leading-relaxed">
          Мощные акустические системы по индивидуальному заказу для клубов, открытых площадок и концертных залов.
        </p>
      </div>

      <div className="space-y-8 text-zinc-700 font-light leading-relaxed text-lg mb-16">
        <p>
          Если вы любите музыку и хотите наслаждаться чистым, разборчивым звуком в большой аудитории, то вы по адресу. 
          Через эти страницы вы сможете познакомиться с результатами наших успешных экспериментов в области создания профессиональной электроакустики. Мы опробовали новые принципы построения систем для формирования двумерного и трёхмерного звукового поля.
        </p>
        
        <div className="bg-zinc-50 p-8 border-l-4 border-yellow-500 shadow-sm my-8">
          <p className="text-xl font-medium text-zinc-900 italic">
            Наша цель — не просто громкость, а усиление эмоционального восприятия гармонии при воспроизведении музыкальных шедевров.
          </p>
        </div>

        <p>
          Создание большого звукового давления с покрытием большой площади при сохранении высочайшего качества (разборчивости, детальности, панорамы, спектрального баланса) требует совершенно иных подходов, чем принятые в системах Hi-Fi или стандартных концертных порталах.
        </p>
        
        <p>
          Стандартные "фирменные" акустические системы в виде скучных чёрных ящиков, нагромождённых в празднично декорированном убранстве клуба, вряд ли могут порадовать глаза искушённого посетителя. А высокая громкость при низкой разборчивости превращает любимый трек в бубнящий шум, вызывая чувство усталости и головную боль.
        </p>

        <p>
          Выбор акустических излучателей, их точное позиционирование в пространстве, прецизионная настройка звукового тракта — это искусство, требующее обширных знаний в области физики, математики, электроники, а также инженерной интуиции.
        </p>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-light text-zinc-900 mb-8 border-b border-zinc-200 pb-4">
          Кастомная Разработка
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-zinc-700 font-light leading-relaxed text-lg">
            <p>
              Мы специализируемся на разработке архитектурных акустических систем, создаваемых с учётом уникальных особенностей каждого пространства. Наш подход основан на глубокой интеграции акустических решений в промышленный дизайн объекта.
            </p>
            <ul className="space-y-3 list-disc list-inside pl-4 marker:text-yellow-500 font-medium">
              <li>Адаптация под архитектуру и интерьер</li>
              <li>Точный расчет направленности звука</li>
              <li>Проектирование индивидуальных корпусов</li>
              <li>Решения акустических задач любой сложности</li>
            </ul>
            <p className="font-bold text-zinc-900 border-l-4 border-yellow-500 pl-4 py-2 bg-zinc-50">
              Мы создаём системы, которые не нарушают архитектурную концепцию, а органично дополняют и усиливают её.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="/34.jpg" alt="Процесс сборки" className="w-full h-full object-cover rounded-sm shadow-sm" />
            <img src="/Ampersound white 4way_4.jpg" alt="Детали системы" className="w-full h-full object-cover rounded-sm shadow-sm mt-8" />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-light text-zinc-900 mb-8">Наши Решения в Деталях</h2>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {[ '19.jpeg', '23.jpeg', '24.jpeg', '29.jpeg', '31.jpeg', '32.jpeg', '33.jpeg', '36.jpg' ].map((src, index) => (
             <img key={index} src={`/${src}`} alt={`Ampersound Detail ${index + 1}`} className="w-full h-auto rounded-sm shadow-md hover:scale-[1.02] transition-transform duration-500 cursor-pointer" />
          ))}
        </div>
      </div>
    </div>
  );
};

const ProjectsPage = () => {
  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-6 min-h-screen animate-in fade-in duration-700 bg-zinc-50">
      <Link to="/" className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-zinc-400 hover:text-yellow-600 mb-12 transition-colors">
        <ArrowLeft size={16} /> На главную
      </Link>
      <div className="mb-16">
        <span className="text-[10px] font-bold tracking-widest uppercase text-yellow-600 border border-yellow-600 px-3 py-1 rounded-full">Инсталляции</span>
        <h1 className="text-4xl md:text-6xl font-light text-zinc-900 mt-6 mb-6 tracking-tight">Реализованные Проекты</h1>
        <p className="text-xl font-medium text-zinc-800 tracking-wide leading-relaxed max-w-3xl">
          От концептуальных арт-пространств до массивных лесных опен-эйров. Наши системы работают там, где требуется бескомпромиссное качество звука, высокая мощность и глубокое погружение в музыку.
        </p>
      </div>
      
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {['1.jpeg', '2.jpeg', '3.jpeg', '5.jpeg', '10.jpeg', '17.jpeg', '23_2.jpeg', '35.jpg'].map((src, i) => (
          <img 
            key={i} 
            src={`/${src}`} 
            alt={`AmperSound Installation ${i + 1}`} 
            className="w-full h-auto rounded-sm shadow-md hover:scale-[1.02] transition-transform duration-500 cursor-pointer" 
          />
        ))}
      </div>
    </div>
  );
};

/* RESTORED: Full Production Page displaying all cards */
const ProductionPage = ({ products }) => {
  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-6 min-h-screen animate-in fade-in duration-700">
      <Link to="/" className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-zinc-400 hover:text-yellow-600 mb-12 transition-colors">
        <ArrowLeft size={16} /> На главную
      </Link>
      <div className="mb-16 max-w-3xl">
        <span className="text-[10px] font-bold tracking-widest uppercase text-yellow-600 border border-yellow-600 px-3 py-1 rounded-full">Кастомное производство</span>
        <h1 className="text-4xl md:text-6xl font-light text-zinc-900 mt-6 mb-6 tracking-tight">Акустические Системы</h1>
        <p className="text-lg font-light text-zinc-600 leading-relaxed">
          Мы не просто продаем колонки. Мы разрабатываем кастомные архитектурные акустические решения под конкретные задачи площадки, будь то клуб, ресторан или концертный зал. Ниже представлены примеры наших серийных и индивидуальных разработок.
        </p>
      </div>
      
      <ProductGrid products={products} />
    </div>
  );
};

/* RESTORED: Detailed Product Page */
const ProductDetailPage = ({ products }) => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);

  if (!product) return <div className="pt-40 text-center text-xl font-medium">Система не найдена</div>;
  
  return (
    <div className="pt-32 pb-24 max-w-6xl mx-auto px-6 min-h-screen animate-in fade-in duration-700 bg-white">
      <Link to="/production" className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-zinc-400 hover:text-yellow-600 mb-12 transition-colors">
        <ArrowLeft size={16} /> К каталогу
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-start">
        <div className="bg-zinc-50 p-12 flex items-center justify-center shadow-inner border border-zinc-100 rounded-sm sticky top-32">
          <img src={product.img} alt={product.name} className="w-full h-auto max-h-[600px] object-contain mix-blend-multiply drop-shadow-2xl" />
        </div>
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-yellow-600 border border-yellow-600 px-3 py-1 rounded-full">{product.category}</span>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mt-6 mb-8 tracking-tight">{product.name}</h1>
          <p className="text-zinc-600 font-light leading-relaxed mb-10 text-lg">{product.desc}</p>
          
          <div className="border-t border-zinc-200 pt-8 grid grid-cols-2 gap-8 bg-zinc-50 p-6 rounded-sm">
             <div className="col-span-2">
               <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2">Спецификация</p>
               <p className="text-lg font-medium text-zinc-900">{product.specs || '—'}</p>
             </div>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2">Мощность</p>
              <p className="text-2xl font-light text-zinc-900">{product.power ? `${product.power} Вт` : 'Конфигурируется'}</p>
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2">Габариты</p>
              <p className="text-2xl font-light text-zinc-900">{product.dimensions || 'Custom'}</p>
            </div>
            {product.price && (
              <div className="col-span-2 mt-4 pt-4 border-t border-zinc-200">
                <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2">Ориентировочная Стоимость</p>
                <p className="text-3xl font-medium text-yellow-600">{product.price}</p>
              </div>
            )}
          </div>

          <div className="mt-12 flex gap-4">
             <a href="mailto:info@ampersound.pro" className="inline-flex items-center justify-center gap-3 bg-zinc-900 text-white px-8 py-4 rounded-sm hover:bg-yellow-600 transition-colors font-medium text-sm tracking-widest uppercase w-full">
               Запросить расчет <ArrowRight size={16} />
             </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminCMS = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', category: 'Активные системы', desc: '', specs: '', power: '', dimensions: '', price: '' });
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (!user) return; 
    const q = collection(db, COLLECTION_PATH);
    const unsub = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => console.error("CMS read error:", err));
    return () => unsub();
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try { await signInWithEmailAndPassword(auth, authForm.email, authForm.password); } 
    catch (error) { setAuthError('Ошибка входа. Проверьте почту и пароль.'); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    const newId = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    if(!newId) return alert("Введите корректное название");
    setIsUploading(true);
    try {
      let imageUrl = ''; let imagePath = '';
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${newId}-${Date.now()}.${fileExt}`;
        const storageRef = ref(storage, `${STORAGE_FOLDER}/${fileName}`);
        const uploadTask = await uploadBytesResumable(storageRef, imageFile);
        imageUrl = await getDownloadURL(uploadTask.ref);
        imagePath = storageRef.fullPath;
      } else { throw new Error("Прикрепите фото."); }
      await setDoc(doc(db, COLLECTION_PATH, newId), { ...formData, img: imageUrl, imagePath: imagePath, updatedAt: new Date().toISOString() });
      setFormData({ name: '', category: 'Активные системы', desc: '', specs: '', power: '', dimensions: '', price: '' });
      setImageFile(null);
      document.getElementById('file-upload').value = '';
    } catch (error) { alert(error.message || "Ошибка при сохранении."); } 
    finally { setIsUploading(false); }
  };

  const handleDelete = async (id, imagePath) => {
    if (!user) return;
    if (window.confirm("Удалить систему навсегда?")) {
      await deleteDoc(doc(db, COLLECTION_PATH, id));
      if (imagePath) await deleteObject(ref(storage, imagePath)).catch(()=>console.warn("Img not found"));
    }
  };

  if (!user) {
    return (
      <div className="pt-40 pb-24 max-w-md mx-auto px-6 min-h-screen flex flex-col items-center justify-center animate-in zoom-in-95">
        <Shield className="text-yellow-500 mb-6" size={48} />
        <h1 className="text-3xl font-bold text-zinc-900 mb-8">Вход в CMS</h1>
        {authError && <p className="text-red-500 mb-4 text-sm bg-red-50 p-3 w-full text-center font-medium">{authError}</p>}
        <form onSubmit={handleLogin} className="w-full space-y-4">
          <input required type="email" placeholder="Email администратора" className="w-full p-4 bg-white border-2 border-zinc-200 focus:border-yellow-500 outline-none font-medium" value={authForm.email} onChange={e=>setAuthForm({...authForm, email: e.target.value})} />
          <input required type="password" placeholder="Пароль" className="w-full p-4 bg-white border-2 border-zinc-200 focus:border-yellow-500 outline-none font-medium" value={authForm.password} onChange={e=>setAuthForm({...authForm, password: e.target.value})} />
          <button type="submit" className="w-full bg-zinc-900 text-white p-4 uppercase tracking-[0.2em] font-bold text-sm hover:bg-yellow-500 transition-colors mt-4">Войти</button>
        </form>
        <Link to="/" className="mt-8 text-sm font-bold text-zinc-400 hover:text-zinc-900 flex items-center gap-2 uppercase tracking-widest"><ArrowLeft size={16}/> На сайт</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 max-w-6xl mx-auto px-6 min-h-screen animate-in fade-in">
      <div className="flex items-center justify-between mb-12 border-b border-zinc-200 pb-6">
        <div className="flex items-center gap-3"><Shield className="text-yellow-500" size={32} /><h1 className="text-3xl font-bold text-zinc-900">AmperSound CMS</h1></div>
        <button onClick={() => signOut(auth)} className="text-sm font-bold text-red-500 hover:text-red-700 uppercase tracking-widest flex items-center gap-2"><LogOut size={16}/> Выход</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus size={20} className="text-yellow-600"/> Добавить Систему</h2>
          <form onSubmit={handleSave} className="space-y-5 bg-white p-6 shadow-xl border border-zinc-100 rounded-sm">
            <div><label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Название</label><input required className="w-full p-3 bg-zinc-50 border border-zinc-200 focus:border-yellow-500 outline-none font-medium" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} /></div>
            <div><label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Категория</label><select className="w-full p-3 bg-zinc-50 border border-zinc-200 focus:border-yellow-500 outline-none font-medium" value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})}><option>Активные системы</option><option>Пассивные системы</option><option>Сабвуферы</option><option>Архитектурные</option><option>Концепты</option></select></div>
            <div><label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Описание (Длинный текст)</label><textarea required className="w-full p-3 bg-zinc-50 border border-zinc-200 focus:border-yellow-500 outline-none font-medium h-32 resize-none" value={formData.desc} onChange={e=>setFormData({...formData, desc: e.target.value})} /></div>
            <div><label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Спецификация (Кратко)</label><input placeholder="Напр: 15″ НЧ | 1″ Твиттер" className="w-full p-3 bg-zinc-50 border border-zinc-200 focus:border-yellow-500 outline-none font-medium" value={formData.specs} onChange={e=>setFormData({...formData, specs: e.target.value})} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Мощность</label><input type="number" placeholder="Вт" className="w-full p-3 bg-zinc-50 border border-zinc-200 focus:border-yellow-500 outline-none font-medium" value={formData.power} onChange={e=>setFormData({...formData, power: e.target.value})} /></div>
              <div><label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Габариты</label><input placeholder="ШxВxГ" className="w-full p-3 bg-zinc-50 border border-zinc-200 focus:border-yellow-500 outline-none font-medium" value={formData.dimensions} onChange={e=>setFormData({...formData, dimensions: e.target.value})} /></div>
            </div>
            <div><label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Цена</label><input placeholder="Напр. По запросу" className="w-full p-3 bg-zinc-50 border border-zinc-200 focus:border-yellow-500 outline-none font-medium" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} /></div>
            <div>
               <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Фотография</label>
               <div className="relative border-2 border-dashed border-zinc-300 bg-zinc-50 p-6 text-center hover:bg-zinc-100 cursor-pointer rounded-sm"><input id="file-upload" type="file" accept="image/*" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setImageFile(e.target.files[0])} /><div className="flex flex-col items-center"><Upload size={24} className={imageFile ? "text-green-500 mb-2" : "text-zinc-400 mb-2"} /><span className="text-sm font-bold text-zinc-700">{imageFile ? imageFile.name : "Загрузить фото"}</span></div></div>
            </div>
            <button type="submit" disabled={isUploading} className={`w-full text-white p-4 font-bold uppercase tracking-widest text-sm flex justify-center items-center gap-2 ${isUploading ? 'bg-zinc-400 cursor-not-allowed' : 'bg-zinc-900 hover:bg-yellow-500'}`}>{isUploading ? <><Loader2 size={18} className="animate-spin" /> Загрузка</> : 'Опубликовать'}</button>
          </form>
        </div>
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-6">База Систем ({products.length})</h2>
          <div className="bg-white shadow-xl rounded-sm border border-zinc-100 overflow-hidden">
            {products.length === 0 ? <p className="p-12 text-center text-zinc-500 font-medium">База пуста.</p> : (
              <ul className="divide-y divide-zinc-100">
                {products.map(p => (
                  <li key={p.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 group">
                    <div className="flex items-center gap-5"><div className="w-16 h-16 bg-zinc-50 p-1 flex items-center justify-center"><img src={p.img} alt="" className="max-w-full max-h-full object-contain mix-blend-multiply" /></div><div><p className="font-bold text-zinc-900">{p.name}</p><p className="text-xs font-medium text-zinc-500 tracking-wide mt-1"><span className="text-yellow-600">{p.category}</span> {p.power && ` • ${p.power} Вт`}</p></div></div>
                    <button onClick={() => handleDelete(p.id, p.imagePath)} className="p-3 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded transition-all opacity-0 group-hover:opacity-100"><Trash2 size={20}/></button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [lang, setLang] = useState('ru');
  const [user, setUser] = useState(null);
  const [dbProducts, setDbProducts] = useState([]);
  const [isDbConnected, setIsDbConnected] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = collection(db, COLLECTION_PATH);
    const unsub = onSnapshot(q, (snapshot) => {
      setDbProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsDbConnected(true);
    }, (err) => setIsDbConnected(false));
    return () => unsub();
  }, []);

  const t = CONTENT_DICTIONARY[lang] || CONTENT_DICTIONARY['en'];
  
  // Умный Fallback: Если в базе Firebase пусто, показываем хардкод из INITIAL_PRODUCTS
  const displayProducts = (isDbConnected && dbProducts.length > 0) ? dbProducts : INITIAL_PRODUCTS;

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen font-sans selection:bg-yellow-500 selection:text-white bg-zinc-50">
        <Navbar lang={lang} setLang={setLang} t={t} user={user} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage t={t} displayProducts={displayProducts} />} />
            <Route path="/creator" element={<CreatorPage />} />
            <Route path="/philosophy" element={<PhilosophyPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/production" element={<ProductionPage products={displayProducts} />} />
            <Route path="/product/:id" element={<ProductDetailPage products={displayProducts} />} />
            <Route path="/admin" element={<AdminCMS user={user} />} />
          </Routes>
        </main>
        <Footer t={t} />
      </div>
    </BrowserRouter>
  );
}