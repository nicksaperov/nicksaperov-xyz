import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Plus, ArrowRight, Mail, MapPin, Shield, Trash2, ArrowLeft, Upload, Loader2, LogOut } from 'lucide-react';

// --- FIREBASE ARCHITECTURE ---
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
  en: {
    nav: { about: "About", creator: "The Creator", architecture: "Architecture", products: "Systems", contact: "Contacts" },
    hero: { title: "AmperSound", subtitle: "Pure. Powerful. Immersive Sound.", slogan: "Music that unites.", cta: "Discover the Architecture" },
    about: { tag: "The Philosophy", title: "Acoustic Architecture", p1: "Premium custom acoustic systems for clubs, open-air venues, and concert halls. If you demand pure, highly articulated sound for large audiences, this is your destination.", p2: "We specialize in developing architectural acoustic systems tailored to the unique dimensions of each space. Our approach relies on the deep integration of acoustic solutions into industrial design.", p3: "Every system is uniquely engineered: from acoustic calculations and driver selection to cabinet design. We create solutions that do not disrupt the architectural concept but organically enhance it.", cta: "Read More" },
    creator: { tag: "The Visionary", title: "Vitaly Suprun", dates: "1955 . 2021", p1: "Ampersound sound stations are built upon the formula of the great physicist Vitaly Suprun. Years ago, after developing electronics and noise suppression units for the space industry, he turned his genius toward sound.", p2: "Recognizing that electronic music was becoming a vital social need, he founded the Recreational and Technological Laboratory to create unique sound stations: Ampersound.", p3: "'Music is the harmonic oscillation of the air we breathe.' His legacy lives on through our strict adherence to his formulas, unified with modern build quality and components.", cta: "Explore the Legacy" },
    products: { tag: "Ready-to-Use", title: "Sound Systems" },
    projects: { tag: "Realized", title: "Immersive Experiences", p1: "For the Futurione Emotions space, we engineered a 14 kW sound system. The four-way architecture, 8 subwoofers, and 4 satellites form a dense, spatial sound that amplifies visual emotions.", p2: "Ampersound: Where art meets acoustic technology.", cta: "Read about other installations" },
    footer: { contact: "Get in Touch", email: "info@ampersound.pro", location: "Moscow, Russia", rights: "© 2026 AmperSound. All rights reserved." },
    pages: { back: "Back to Home", legacyTitle: "The Legacy of Vitaly Suprun", philosophyTitle: "Our Philosophy & Production", installationsTitle: "Realized Installations" }
  },
  ru: {
    nav: { about: "О нас", creator: "Создатель", architecture: "Архитектура", products: "Производство", contact: "Контакты" },
    hero: { title: "AmperSound", subtitle: "Чистый. Мощный. Объемный звук.", slogan: "Музыка, которая объединяет.", cta: "Изучить Архитектуру" },
    about: { tag: "Философия", title: "Архитектура Звука", p1: "Мощные акустические системы по индивидуальному заказу для клубов, открытых площадок и концертных залов. Для тех, кто ценит чистый, разборчивый звук.", p2: "Мы специализируемся на разработке архитектурных акустических систем, создаваемых с учетом уникальных особенностей каждого пространства. Наш подход основан на глубокой интеграции акустических решений в промышленный дизайн.", p3: "Каждая система разрабатывается индивидуально: от расчетов и подбора излучателей до проектирования формы корпуса. Решения, которые органично дополняют и усиливают пространство.", cta: "Узнать больше о производстве" },
    creator: { tag: "Визионер", title: "Виталий Супрун", dates: "1955 . 2021", p1: "Звуковые станции Ampersound собраны по формуле великого физика Супруна Виталия Григорьевича. Разработчик электроники для космической отрасли, он посвятил себя созданию идеального звука.", p2: "Осознав потребность общества в качественном звучании, он открыл лабораторию для создания уникальных саунд-станций: Ampersound.", p3: "'Музыка: это гармонические колебания воздуха, которым мы дышим.' Мы продолжаем его путь, строго соблюдая формулы и совершенствуя качество сборки.", cta: "Изучить Наследие" },
    products: { tag: "Кастомное производство", title: "Акустические Системы" },
    projects: { tag: "Реализованные", title: "Проекты и Инсталляции", p1: "Для арт-пространства Futurione Emotions мы создали звуковую систему мощностью 14 кВт. Четырехполосная архитектура формирует плотное, пространственное звучание.", p2: "Ampersound: Часть искусства и технологии.", cta: "Смотреть другие проекты" },
    footer: { contact: "Свяжитесь с нами", email: "info@ampersound.pro", location: "Москва, Россия", rights: "© 2026 AmperSound. Все права защищены." },
    pages: { back: "На главную", legacyTitle: "Наследие Виталия Супруна", philosophyTitle: "Философия и Производство", installationsTitle: "Реализованные Инсталляции" }
  }
};

const FALLBACK_PRODUCTS = [
  { id: "chandelier", name: "Акустическая люстра", category: "Архитектурные", desc: "Объединение мощного звука и освещения. Круговая направленность 360 градусов.", power: "200", dimensions: "D:80", img: "33.jpeg" },
  { id: "white-4way", name: "Ampersound White 4-Way", category: "Активные", desc: "Четырёхполосный комплект активного разделения.", power: "2400", dimensions: "Custom", img: "Ampersound white 4way_1.jpg" },
  { id: "type-o", name: "Концепт Type O", category: "Концепты", desc: "Архитектурная акустическая система. Дизайн: Ярослав Рассадин.", power: "150", dimensions: "30x40x25", img: "25.jpeg" }
];

const Navbar = ({ lang, setLang, t, view, setView, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (target) => {
    if (view.name !== 'home') {
      setView({ name: 'home', payload: null });
      setTimeout(() => {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const isDark = view.name !== 'home' ? false : !scrolled;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${!isDark ? 'bg-white/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => { setView({name: 'home', payload: null}); window.scrollTo(0,0); }}>
          <img src="logo.png" alt="AmperSound Logo" className={`h-8 transition-all ${!isDark ? 'invert' : 'invert-0'}`} />
          <span className={`text-xl tracking-widest font-bold uppercase ${!isDark ? 'text-zinc-900' : 'text-white'}`}>
            AmperSound
          </span>
        </div>

        <div className={`hidden md:flex items-center gap-8 text-sm tracking-wide font-medium ${!isDark ? 'text-zinc-800' : 'text-zinc-200'}`}>
          <button onClick={() => setView({name: 'philosophy'})} className="hover:text-yellow-500 transition-colors">{t.nav.about}</button>
          <button onClick={() => setView({name: 'legacy'})} className="hover:text-yellow-500 transition-colors">{t.nav.creator}</button>
          <button onClick={() => setView({name: 'installations'})} className="hover:text-yellow-500 transition-colors">{t.nav.architecture}</button>
          <button onClick={() => setView({name: 'production'})} className="hover:text-yellow-500 transition-colors">{t.nav.products}</button>
          
          <button onClick={() => setLang(lang === 'en' ? 'ru' : 'en')} className="flex items-center gap-1 hover:text-yellow-500 transition-colors ml-4 border border-current rounded-full px-3 py-1">
            <Globe size={14} /> <span className="uppercase text-xs">{lang}</span>
          </button>
          
          {user && (
             <button onClick={() => setView({name: 'admin'})} className="flex items-center gap-1 text-yellow-600 hover:text-yellow-500 transition-colors ml-2 font-bold">
               <Shield size={16} /> CMS
             </button>
          )}
        </div>

        <button className={`md:hidden ${!isDark ? 'text-zinc-900' : 'text-white'}`} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg py-6 px-6 flex flex-col gap-6 md:hidden">
          <button onClick={() => { setView({name: 'philosophy'}); setIsOpen(false); }} className="text-left text-zinc-900 text-lg font-medium">{t.nav.about}</button>
          <button onClick={() => { setView({name: 'legacy'}); setIsOpen(false); }} className="text-left text-zinc-900 text-lg font-medium">{t.nav.creator}</button>
          <button onClick={() => { setView({name: 'installations'}); setIsOpen(false); }} className="text-left text-zinc-900 text-lg font-medium">{t.nav.architecture}</button>
          <button onClick={() => { setView({name: 'production'}); setIsOpen(false); }} className="text-left text-zinc-900 text-lg font-medium">{t.nav.products}</button>
          <button onClick={() => { setLang(lang === 'en' ? 'ru' : 'en'); setIsOpen(false); }} className="flex items-center gap-2 text-zinc-900 text-lg font-medium">
            <Globe size={20} /> <span className="uppercase">{lang === 'en' ? 'RU' : 'EN'}</span>
          </button>
        </div>
      )}
    </nav>
  );
};

const Hero = ({ t, setView }) => (
  <section id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-zinc-900">
    <div className="absolute inset-0 z-0">
      <img src="31.jpeg" alt="Background" className="w-full h-full object-cover opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-zinc-50"></div>
    </div>
    <div className="relative z-10 text-center px-6 mt-20 max-w-4xl">
      <h1 className="text-6xl md:text-9xl text-yellow-500 font-bold tracking-[0.15em] mb-6 drop-shadow-2xl">
        AmperSound
      </h1>
      <p className="text-xl md:text-3xl text-zinc-100 font-light tracking-wide mb-4 drop-shadow-md">{t.hero.subtitle}</p>
      <p className="text-yellow-400 text-lg md:text-xl font-medium tracking-widest uppercase mb-16 drop-shadow-md">{t.hero.slogan}</p>
      <button 
        onClick={() => setView({name: 'philosophy'})} 
        className="inline-flex items-center gap-4 border-2 border-yellow-500 text-white px-10 py-5 rounded-md hover:bg-yellow-500 hover:text-zinc-900 transition-all duration-300 backdrop-blur-sm"
      >
        <span className="text-sm md:text-base tracking-widest uppercase font-semibold">{t.hero.cta}</span><ArrowRight size={20} />
      </button>
    </div>
  </section>
);

const AboutSection = ({ t, setView }) => (
  <section id="about" className="py-24 md:py-40 bg-zinc-50">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <div className="order-2 md:order-1 relative">
        <img src="35.jpg" alt="Acoustic" className="w-full h-auto object-cover shadow-2xl rounded-sm hover:scale-[1.02] transition-transform duration-700" />
      </div>
      <div className="order-1 md:order-2">
        <p className="text-yellow-600 tracking-widest uppercase text-xs font-bold mb-4">{t.about.tag}</p>
        <h2 className="text-4xl md:text-6xl font-light text-zinc-900 tracking-tight mb-8">{t.about.title}</h2>
        <div className="space-y-6 text-zinc-600 font-light leading-relaxed text-lg"><p>{t.about.p1}</p><p>{t.about.p2}</p></div>
        <button onClick={() => setView({name: 'philosophy'})} className="mt-10 inline-flex items-center gap-3 bg-zinc-900 text-white px-8 py-4 rounded-sm hover:bg-yellow-600 transition-colors">
          <span className="text-sm tracking-widest uppercase font-medium">{t.about.cta}</span><ArrowRight size={16} />
        </button>
      </div>
    </div>
  </section>
);

const CreatorSection = ({ t, setView }) => (
  <section id="creator" className="py-24 md:py-40 bg-white">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <div>
        <p className="text-yellow-600 tracking-widest uppercase text-xs font-bold mb-4">{t.creator.tag}</p>
        <h2 className="text-4xl md:text-6xl font-light text-zinc-900 tracking-tight mb-2">{t.creator.title}</h2>
        <p className="text-zinc-400 tracking-widest text-sm mb-8 font-medium">{t.creator.dates}</p>
        <div className="space-y-6 text-zinc-600 font-light leading-relaxed text-lg"><p>{t.creator.p1}</p><p className="pl-6 border-l-4 border-yellow-500 italic text-zinc-800 font-medium">{t.creator.p3}</p></div>
        <button onClick={() => setView({name: 'legacy'})} className="mt-10 inline-flex items-center gap-3 border border-zinc-300 text-zinc-900 px-8 py-4 rounded-sm hover:border-yellow-500 hover:text-yellow-600 transition-colors">
          <span className="text-sm tracking-widest uppercase font-medium">{t.creator.cta}</span><ArrowRight size={16} />
        </button>
      </div>
      <div><img src="22.jpeg" alt="Vitaly" className="w-full h-auto object-cover shadow-2xl rounded-sm grayscale hover:grayscale-0 transition-all duration-700" /></div>
    </div>
  </section>
);

const ArchitectureSection = ({ t, setView }) => (
  <section id="architecture" className="py-24 md:py-40 bg-zinc-900 text-white">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <div>
        <p className="text-yellow-500 tracking-widest uppercase text-xs font-bold mb-4">{t.projects.tag}</p>
        <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-8">{t.projects.title}</h2>
        <div className="space-y-6 text-zinc-300 font-light leading-relaxed text-lg">
          <p>{t.projects.p1}</p>
          <p className="text-white font-medium border-l-4 border-yellow-500 pl-4">{t.projects.p2}</p>
        </div>
        <button onClick={() => setView({name: 'installations'})} className="mt-10 inline-flex items-center gap-3 bg-yellow-500 text-zinc-900 px-8 py-4 rounded-sm hover:bg-white transition-colors">
          <span className="text-sm tracking-widest uppercase font-bold">{t.projects.cta}</span><ArrowRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="mt-12"><img src="30.jpeg" alt="Structure" className="w-full h-auto object-cover shadow-2xl rounded-sm" /></div>
        <div><img src="16.jpeg" alt="Action" className="w-full h-auto object-cover shadow-2xl rounded-sm" /></div>
      </div>
    </div>
  </section>
);

const PageLayout = ({ title, children, setView, t }) => {
  useEffect(() => { window.scrollTo(0,0); }, []);
  return (
    <div className="pt-32 pb-24 max-w-5xl mx-auto px-6 min-h-screen">
      <button onClick={() => setView({name: 'home'})} className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-zinc-400 hover:text-yellow-600 mb-12 transition-colors">
        <ArrowLeft size={16} /> {t.pages.back}
      </button>
      <h1 className="text-4xl md:text-6xl font-light text-zinc-900 mb-12 tracking-tight">{title}</h1>
      <div className="prose prose-lg prose-zinc max-w-none font-light leading-relaxed">
        {children}
      </div>
    </div>
  );
};

const ProductionPage = ({ t, products, setView }) => (
  <div className="pt-32 pb-24 max-w-7xl mx-auto px-6 min-h-screen">
    <button onClick={() => setView({name: 'home'})} className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-zinc-400 hover:text-yellow-600 mb-12 transition-colors">
      <ArrowLeft size={16} /> {t.pages.back}
    </button>
    <div className="mb-20 max-w-3xl">
      <p className="text-yellow-600 tracking-widest uppercase text-xs font-bold mb-4">{t.products.tag}</p>
      <h1 className="text-5xl md:text-7xl font-light text-zinc-900 tracking-tight mb-8">{t.products.title}</h1>
      <p className="text-xl text-zinc-600 font-light leading-relaxed">Мы не просто продаем колонки. Мы разрабатываем кастомные архитектурные акустические решения под конкретные задачи площадки, будь то клуб, ресторан или концертный зал. Ниже представлены примеры наших серийных и индивидуальных разработок.</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
      {products.map((item) => (
        <div key={item.id} onClick={() => setView({name: 'productDetail', payload: item})} className="group cursor-pointer flex flex-col h-full bg-white border border-zinc-100 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-500">
          <div className="p-8 bg-zinc-50 flex-grow flex items-center justify-center overflow-hidden">
            <img src={item.img} alt={item.name} className="max-h-72 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />
          </div>
          <div className="p-8 pt-6 flex flex-col justify-between flex-grow">
            <div>
              <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-[10px] tracking-widest uppercase font-bold rounded-full mb-4">{item.category}</span>
              <h3 className="text-2xl font-medium text-zinc-900 mb-3">{item.name}</h3>
              <p className="text-zinc-500 font-light line-clamp-3 leading-relaxed mb-6">{item.desc}</p>
            </div>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100">
               <span className="text-sm font-medium text-zinc-900">{item.power ? `${item.power} Вт` : 'Custom'}</span>
               <button className="flex items-center gap-2 text-yellow-600 text-sm font-bold uppercase tracking-widest group-hover:text-zinc-900 transition-colors">
                 Детали <ArrowRight size={16}/>
               </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ProductDetail = ({ product, setView, t }) => {
  useEffect(() => { window.scrollTo(0,0); }, []);
  if (!product) return null;
  return (
    <div className="pt-32 pb-24 max-w-6xl mx-auto px-6 min-h-screen">
      <button onClick={() => setView({name: 'production'})} className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-zinc-400 hover:text-yellow-600 mb-12 transition-colors">
        <ArrowLeft size={16} /> Назад к производству
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="bg-zinc-50 rounded-2xl p-12 flex items-center justify-center shadow-inner aspect-square">
          <img src={product.img} alt={product.name} className="w-full max-h-full object-contain mix-blend-multiply drop-shadow-2xl hover:scale-105 transition-transform duration-700" />
        </div>
        <div>
          <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 text-xs tracking-widest uppercase font-bold rounded-full mb-6">{product.category}</span>
          <h1 className="text-4xl md:text-6xl font-light text-zinc-900 mb-8 tracking-tight">{product.name}</h1>
          <p className="text-zinc-600 font-light leading-relaxed mb-10 text-xl">{product.desc}</p>
          
          <div className="bg-white border border-zinc-100 rounded-xl p-8 grid grid-cols-2 gap-8 shadow-sm">
            <div>
              <p className="text-xs tracking-widest uppercase font-bold text-zinc-400 mb-2">Макс. Мощность</p>
              <p className="text-3xl font-light text-zinc-900">{product.power ? `${product.power} Вт` : 'Конфигурируется'}</p>
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase font-bold text-zinc-400 mb-2">Габариты</p>
              <p className="text-3xl font-light text-zinc-900">{product.dimensions || 'По проекту'}</p>
            </div>
          </div>
          
          <div className="mt-12">
            <button onClick={() => setView({name: 'home'})} className="inline-flex items-center gap-4 bg-zinc-900 text-white px-10 py-5 rounded-md hover:bg-yellow-500 hover:text-zinc-900 transition-all duration-300 w-full md:w-auto justify-center">
              <span className="text-sm tracking-widest uppercase font-bold">Запросить расчет системы</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminCMS = ({ user, setView }) => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', category: 'Активные системы', desc: '', power: '', dimensions: '' });
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
    try {
      await signInWithEmailAndPassword(auth, authForm.email, authForm.password);
    } catch (error) {
      setAuthError('Ошибка входа. Проверьте почту и пароль.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    const newId = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    if(!newId) { alert("Пожалуйста, введите корректное название"); return; }

    setIsUploading(true);
    try {
      let imageUrl = ''; let imagePath = '';
      if (imageFile) {
        const fileName = `${newId}-${Date.now()}.${imageFile.name.split('.').pop()}`;
        const storageRef = ref(storage, `${STORAGE_FOLDER}/${fileName}`);
        const uploadTask = await uploadBytesResumable(storageRef, imageFile);
        imageUrl = await getDownloadURL(uploadTask.ref);
        imagePath = storageRef.fullPath;
      } else {
         throw new Error("Необходимо прикрепить фотографию.");
      }

      await setDoc(doc(db, COLLECTION_PATH, newId), { ...formData, img: imageUrl, imagePath: imagePath, updatedAt: new Date().toISOString() });
      setFormData({ name: '', category: 'Активные системы', desc: '', power: '', dimensions: '' });
      setImageFile(null);
      document.getElementById('file-upload').value = '';
    } catch (error) {
      alert(error.message || "Ошибка при сохранении.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id, imagePath) => {
    if (!user) return;
    if (window.confirm("Удалить систему навсегда?")) {
      await deleteDoc(doc(db, COLLECTION_PATH, id));
      if (imagePath) await deleteObject(ref(storage, imagePath)).catch(e => console.warn(e));
    }
  };

  if (!user) {
    return (
      <div className="pt-40 pb-24 max-w-md mx-auto px-6 min-h-screen flex flex-col items-center justify-center">
        <Shield className="text-yellow-500 mb-6" size={48} />
        <h1 className="text-3xl font-light text-zinc-900 mb-8">Вход в CMS</h1>
        {authError && <p className="text-red-500 mb-4 text-sm bg-red-50 p-3 w-full text-center rounded">{authError}</p>}
        <form onSubmit={handleLogin} className="w-full space-y-4">
          <input required type="email" placeholder="Email" className="w-full p-4 bg-white border border-zinc-200 rounded outline-none focus:border-yellow-500" value={authForm.email} onChange={e=>setAuthForm({...authForm, email: e.target.value})} />
          <input required type="password" placeholder="Пароль" className="w-full p-4 bg-white border border-zinc-200 rounded outline-none focus:border-yellow-500" value={authForm.password} onChange={e=>setAuthForm({...authForm, password: e.target.value})} />
          <button type="submit" className="w-full bg-zinc-900 text-white p-4 rounded uppercase tracking-widest text-sm font-bold hover:bg-yellow-500 transition-colors">Войти</button>
        </form>
        <button onClick={() => setView({name:'home'})} className="mt-8 text-sm text-zinc-400 hover:text-zinc-900 flex items-center gap-2 font-medium">
          <ArrowLeft size={16}/> Назад на сайт
        </button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-6 min-h-screen">
      <div className="flex items-center justify-between mb-12 border-b border-zinc-200 pb-6">
        <div className="flex items-center gap-4">
          <Shield className="text-yellow-500" size={40} />
          <h1 className="text-4xl font-light text-zinc-900">SMART CMS</h1>
        </div>
        <button onClick={() => signOut(auth)} className="flex items-center gap-2 text-red-500 hover:text-red-600 font-bold px-4 py-2 bg-red-50 rounded-md">
          <LogOut size={18}/> Выйти
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-zinc-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-zinc-800"><Plus size={24} className="text-yellow-500"/> Добавить Систему</h2>
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-zinc-500 mb-2">Название</label>
                <input required className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-md focus:border-yellow-500 outline-none" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-zinc-500 mb-2">Категория</label>
                <select className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-md focus:border-yellow-500 outline-none" value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})}>
                  <option>Активные системы</option><option>Пассивные системы</option><option>Сабвуферы</option><option>Архитектурные</option><option>Концепты</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-zinc-500 mb-2">Описание</label>
                <textarea required className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-md focus:border-yellow-500 outline-none h-32 resize-none" value={formData.desc} onChange={e=>setFormData({...formData, desc: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs uppercase tracking-widest font-bold text-zinc-500 mb-2">Мощность (Вт)</label><input type="number" className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-md" value={formData.power} onChange={e=>setFormData({...formData, power: e.target.value})} /></div>
                <div><label className="block text-xs uppercase tracking-widest font-bold text-zinc-500 mb-2">Габариты</label><input className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-md" value={formData.dimensions} onChange={e=>setFormData({...formData, dimensions: e.target.value})} /></div>
              </div>
              <div>
                 <label className="block text-xs uppercase tracking-widest font-bold text-zinc-500 mb-2">Фотография</label>
                 <div className="relative border-2 border-dashed border-zinc-300 rounded-xl bg-zinc-50 p-6 text-center hover:bg-zinc-100 transition-colors cursor-pointer">
                   <input id="file-upload" type="file" accept="image/*" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setImageFile(e.target.files[0])}/>
                   <div className="flex flex-col items-center pointer-events-none">
                      <Upload size={32} className={imageFile ? "text-yellow-500 mb-3" : "text-zinc-300 mb-3"} />
                      <span className="text-sm font-bold text-zinc-700">{imageFile ? imageFile.name : "Загрузить фото"}</span>
                   </div>
                 </div>
              </div>
              <button type="submit" disabled={isUploading} className={`w-full text-white p-4 rounded-md uppercase tracking-widest text-sm font-bold transition-all mt-6 flex justify-center items-center gap-2 ${isUploading ? 'bg-zinc-400' : 'bg-yellow-500 hover:bg-zinc-900 text-zinc-900 hover:text-white'}`}>
                {isUploading ? <><Loader2 size={18} className="animate-spin" /> Загрузка...</> : 'Опубликовать систему'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-6 text-zinc-800">Управление Базой ({products.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.length === 0 ? <p className="text-zinc-500">База пуста.</p> : products.map(p => (
              <div key={p.id} className="bg-white rounded-xl shadow-md border border-zinc-100 p-4 flex gap-4 items-center group relative overflow-hidden">
                <img src={p.img} alt={p.name} className="w-24 h-24 object-contain bg-zinc-50 rounded-lg p-2" />
                <div className="flex-1">
                  <span className="text-[10px] uppercase font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full mb-1 inline-block">{p.category}</span>
                  <h3 className="font-bold text-zinc-900 text-lg leading-tight mb-1">{p.name}</h3>
                  <p className="text-xs text-zinc-500">{p.power}Вт • {p.dimensions}</p>
                </div>
                <button onClick={() => handleDelete(p.id, p.imagePath)} className="absolute top-4 right-4 p-2 bg-red-100 text-red-500 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all transform translate-x-4 group-hover:translate-x-0"><Trash2 size={16}/></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = ({ t, setView }) => (
  <footer id="contact" className="bg-zinc-900 text-zinc-400 py-20">
    <div className="max-w-7xl mx-auto px-6 text-center">
      <div className="flex justify-center items-center gap-3 mb-8">
        <img src="logo.png" alt="AmperSound Logo" className="h-8 invert opacity-80" />
        <span className="text-2xl tracking-widest font-bold uppercase text-zinc-100">AmperSound</span>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-12 text-sm font-medium">
        <a href={`mailto:${t.footer.email}`} className="flex items-center gap-2 hover:text-yellow-500 transition-colors"><Mail size={18} /> {t.footer.email}</a>
        <span className="flex items-center gap-2"><MapPin size={18} /> {t.footer.location}</span>
      </div>
      <div className="text-xs font-light tracking-widest border-t border-zinc-800 pt-8 flex justify-between items-center">
        <span>{t.footer.rights}</span>
        <button onClick={() => setView({name: 'admin'})} className="opacity-10 hover:opacity-100 transition-opacity font-bold">CMS</button>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [lang, setLang] = useState('ru');
  const [view, setView] = useState({ name: 'home', payload: null });
  const [user, setUser] = useState(null);
  const [dbProducts, setDbProducts] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = collection(db, COLLECTION_PATH);
    const unsub = onSnapshot(q, (snapshot) => {
      setDbProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => console.warn("Using fallback data.", err));
    return () => unsub();
  }, []);

  const t = CONTENT_DICTIONARY[lang] || CONTENT_DICTIONARY['en'];
  const displayProducts = dbProducts.length > 0 ? dbProducts : FALLBACK_PRODUCTS;

  return (
    <div className="min-h-screen font-sans selection:bg-yellow-500 selection:text-white bg-zinc-50">
      <Navbar lang={lang} setLang={setLang} t={t} view={view} setView={setView} user={user} />
      <main>
        {view.name === 'home' && (
          <>
            <Hero t={t} setView={setView} />
            <AboutSection t={t} setView={setView} />
            <CreatorSection t={t} setView={setView} />
            <ArchitectureSection t={t} setView={setView} />
          </>
        )}
        
        {view.name === 'philosophy' && (
          <PageLayout title={t.pages.philosophyTitle} setView={setView} t={t}>
            <p className="text-2xl mb-8">Мы создаем акустические системы, которые становятся частью архитектуры пространства.</p>
            <p>Философия AmperSound заключается в отказе от компромиссов между качеством звука и визуальной эстетикой. Каждая наша система — это результат математического моделирования и ручной сборки.</p>
          </PageLayout>
        )}

        {view.name === 'legacy' && (
          <PageLayout title={t.pages.legacyTitle} setView={setView} t={t}>
            <img src="22.jpeg" alt="Vitaly Suprun" className="w-full max-w-2xl mx-auto rounded-lg shadow-xl mb-12" />
            <p className="text-2xl mb-8 font-medium">Гений советской физики, обративший свой взор на музыку.</p>
            <p>Виталий Супрун посвятил многие годы разработке сложнейших систем подавления шумов для космической отрасли. Его уникальные формулы расчета акустических корпусов легли в основу всех систем Ampersound. Мы бережно храним его чертежи и продолжаем его дело.</p>
          </PageLayout>
        )}

        {view.name === 'installations' && (
          <PageLayout title={t.pages.installationsTitle} setView={setView} t={t}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
               <img src="30.jpeg" alt="Installation 1" className="w-full rounded-lg shadow-lg" />
               <img src="16.jpeg" alt="Installation 2" className="w-full rounded-lg shadow-lg" />
            </div>
            <p className="text-xl">От концептуальных арт-пространств до массивных опен-эйров. Наши системы работают там, где требуется бескомпромиссная плотность звукового давления.</p>
          </PageLayout>
        )}

        {view.name === 'production' && <ProductionPage t={t} products={displayProducts} setView={setView} />}
        {view.name === 'productDetail' && <ProductDetail product={view.payload} setView={setView} t={t} />}
        {view.name === 'admin' && <AdminCMS user={user} setView={setView} />}
      </main>
      {view.name !== 'admin' && <Footer t={t} setView={setView} />}
    </div>
  );
}