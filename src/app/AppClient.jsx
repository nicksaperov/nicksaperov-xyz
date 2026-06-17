"use client";
import React, { useState, useEffect, useRef } from 'react';

const nativeImport = new Function('url', 'return import(url)');

let db = null;
let auth = null;

function App() {
    const searchParams = new URLSearchParams(window.location.search);
    const initialArticle = searchParams.get('article');
    const initialProject = searchParams.get('project');
    const initialViewParam = searchParams.get('view');
    
    const initialView = (initialArticle || initialProject) ? 'detail' : (initialViewParam || 'home');
    const initialType = initialArticle ? 'article' : (initialProject ? 'project' : null);
    const initialId = initialArticle || initialProject || null;

    const [lang, setLang] = useState('en');
    const [view, setView] = useState(initialView); 
    const [activeItemId, setActiveItemId] = useState(initialId); 
    const [activeItemType, setActiveItemType] = useState(initialType);
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [toast, setToast] = useState(null);

    const [dbInstance, setDbInstance] = useState(null);
    const [authInstance, setAuthInstance] = useState(null);
    const [isDbReady, setIsDbReady] = useState(false);
    const [dbError, setDbError] = useState(null);
    const [projectsData, setProjectsData] = useState([]);
    const [articlesData, setArticlesData] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(true);

    const [userMessageCount, setUserMessageCount] = useState(0);
    const [isLeadCaptureMode, setIsLeadCaptureMode] = useState(false);
    const [leadHandle, setLeadHandle] = useState('');
    const [leadCaptured, setLeadCaptured] = useState(false);

    const [chatLog, setChatLog] = useState([
        { 
            role: 'ai', 
            text: lang === 'en' 
                ? "Hello. I am a live agent representing Nick's professional architecture. Ask me about his Web3 integrations, tokenomics, or product philosophy." 
                : "Привет. Я live-агент, представляющий профессиональную архитектуру Ника. Спросите меня о его опыте в Web3, токеномике или продуктовой философии." 
        }
    ]);
    const chatEndRef = useRef(null);

    useEffect(() => {
        const initFirebase = async () => {
            try {
                const { initializeApp, getApps, getApp } = await nativeImport('https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js');
                const { getAuth, signInAnonymously } = await nativeImport('https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js');
                const { getFirestore } = await nativeImport('https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js');
                
                const isCanvas = typeof __firebase_config !== 'undefined';
                const firebaseConfig = isCanvas 
                    ? JSON.parse(__firebase_config)
                    : {
                        apiKey: "AIzaSyCK2nTz6xHoaYPRUmUyFXpu7-l9u1Hilug",
                        authDomain: "nicksaperov-portfolio-2026.firebaseapp.com",
                        projectId: "nicksaperov-portfolio-2026",
                        storageBucket: "nicksaperov-portfolio-2026.firebasestorage.app",
                        messagingSenderId: "769848303631",
                        appId: "1:769848303631:web:d58ca6fef3b687b520c37a"
                      };
                
                if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
                    const fbApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
                    const appAuth = getAuth(fbApp);
                    const appDb = getFirestore(fbApp);
                    
                    try { await signInAnonymously(appAuth); } 
                    catch (authError) { console.warn("Auth Uplink: Anonymous sign-in bypassed."); }
                    
                    setAuthInstance(appAuth);
                    setDbInstance(appDb);
                    setIsDbReady(true);
                } else {
                    setDbError("Missing Firebase Config");
                    setIsDataLoading(false); 
                }
            } catch (e) {
                console.error("Initialization error:", e);
                setDbError(e.message);
                setIsDataLoading(false);
            }
        };
        initFirebase();
    }, []);

    useEffect(() => {
        if (!isDbReady || !dbInstance) return;

        let unsubscribeProjects = () => {};
        let unsubscribeArticles = () => {};

        const mountCMS = async () => {
            setIsDataLoading(true);
            try {
                const { collection, onSnapshot } = await nativeImport("https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js");
                const appId = typeof __app_id !== 'undefined' ? __app_id : 'nicksaperov-portfolio';
                const basePath = ['artifacts', appId, 'public', 'data'];

                unsubscribeProjects = onSnapshot(collection(dbInstance, ...basePath, 'projects'), (snapshot) => {
                    const fetchedProjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    
                    const projectOrder = [
                        'liquidity-evaporator',
                        'gcp-chrome-os',
                        'edgecrm',
                        'hilbert-hotel',
                        'content-registry',
                        'power-dcloud',
                        'betaschool'
                    ];
                    
                    fetchedProjects.sort((a, b) => {
                        const indexA = projectOrder.indexOf(a.id);
                        const indexB = projectOrder.indexOf(b.id);
                        
                        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                        if (indexA !== -1) return -1;
                        if (indexB !== -1) return 1;
                        const timeA = new Date(a.date || a.createdAt || a.timestamp || 0).getTime();
                        const timeB = new Date(b.date || b.createdAt || b.timestamp || 0).getTime();
                        return timeB - timeA; 
                    });

                    setProjectsData(fetchedProjects);
                    setIsDataLoading(false);
                }, (error) => { setDbError(`Projects Denied: ${error.message}`); setIsDataLoading(false); });

                unsubscribeArticles = onSnapshot(collection(dbInstance, ...basePath, 'articles'), (snapshot) => {
                    const fetchedArticles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    fetchedArticles.sort((a, b) => {
                        const timeA = new Date(a.date || a.createdAt || a.timestamp || 0).getTime();
                        const timeB = new Date(b.date || b.createdAt || b.timestamp || 0).getTime();
                        return timeB - timeA; 
                    });
                    setArticlesData(fetchedArticles);
                }, (error) => { setDbError(`Articles Denied: ${error.message}`); });

            } catch (error) {
                setDbError(`Pipeline Error: ${error.message}`);
                setIsDataLoading(false);
            }
        };

        mountCMS();
        return () => { unsubscribeProjects(); unsubscribeArticles(); };
    }, [isDbReady, dbInstance]);

    useEffect(() => {
        if (!document.querySelector('#font-awesome-cdn')) {
            const fontAwesome = document.createElement('link');
            fontAwesome.id = 'font-awesome-cdn';
            fontAwesome.rel = 'stylesheet';
            fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
            document.head.appendChild(fontAwesome);
        }

        const style = document.createElement('style');
        style.innerHTML = `
            body { background-color: #0a0a0f; color: #e2e8f0; margin: 0; padding: 0; }
            ::-webkit-scrollbar { width: 8px; }
            ::-webkit-scrollbar-track { background: #0a0a0f; }
            ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
            ::-webkit-scrollbar-thumb:hover { background: #22d3ee; }
            .glass-panel { background: rgba(17, 17, 26, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.05); }
            .neon-border-blue { border: 1px solid #22d3ee; box-shadow: 0 0 10px rgba(34, 211, 238, 0.2); }
            .neon-border-purple { border: 1px solid #a855f7; box-shadow: 0 0 10px rgba(168, 85, 247, 0.2); }
            .neon-text-blue { color: #22d3ee; text-shadow: 0 0 8px rgba(34, 211, 238, 0.4); }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .animate-fade-in { animation: fadeIn 0.4s ease-in-out forwards; }
            .article-prose p { margin-bottom: 1.5rem; line-height: 1.8; color: #cbd5e1; }
            .article-prose h3 { font-size: 1.5rem; font-weight: bold; color: #fff; margin-top: 2rem; margin-bottom: 1rem; }
            .article-prose h4 { font-size: 1.25rem; font-weight: bold; color: #fff; margin-top: 1.5rem; margin-bottom: 1rem; }
            .article-prose ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1.5rem; color: #cbd5e1; }
            .article-prose li { margin-bottom: 0.5rem; }
            .article-prose strong { color: #fff; font-weight: bold; }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    useEffect(() => {
        const handlePopState = () => {
            const params = new URLSearchParams(window.location.search);
            const articleId = params.get('article');
            const projectId = params.get('project');
            const viewParam = params.get('view');

            if (articleId) { setView('detail'); setActiveItemType('article'); setActiveItemId(articleId); } 
            else if (projectId) { setView('detail'); setActiveItemType('project'); setActiveItemId(projectId); } 
            else if (viewParam) { setView(viewParam); setActiveItemType(null); setActiveItemId(null); }
            else { setView('home'); setActiveItemType(null); setActiveItemId(null); }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatLog, isTyping]);

    const handleNav = (target) => { 
        setView(target); 
        setActiveItemId(null); 
        setActiveItemType(null); 
        setMenuOpen(false); 
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
        
        const newUrl = target === 'home' ? window.location.pathname : `${window.location.pathname}?view=${target}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
    };

    const openDetailView = (id, type) => { 
        setActiveItemId(id); 
        setActiveItemType(type); 
        setView('detail'); 
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
        
        const newUrl = `${window.location.pathname}?${type}=${id}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
    };
    
    const copyToClipboard = (text, btnId) => {
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById(btnId);
            if (btn) { const originalHtml = btn.innerHTML; btn.innerHTML = '<i class="fa-solid fa-check text-green-500"></i>'; setTimeout(() => btn.innerHTML = originalHtml, 2000); }
        });
    };

    const fetchGeminiWithRetry = async (text, retries = 5) => {
        const apiKey = ""; // API key is safely omitted for public Cloud Run deployment
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
        const systemPrompt = `You are the AI Assistant for Nick Saperov. Keep responses under 3 sentences. Language constraint: Reply in ${lang === 'en' ? 'English' : 'Russian'}. CRITICAL RULE: If the user asks for a proposal, mentions a PM role, requests a technical architecture audit, or shows high B2B intent, instantly stop answering and provide this exact link: 'Please ping Nick's direct Workspace terminal here: https://nicksaperov.xyz/connect'.`;
        
        const payload = { contents: [{ parts: [{ text: text }] }], systemInstruction: { parts: [{ text: systemPrompt }] } };
        let delay = 1000;
        
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                if (!response.ok) {
                    // Graceful fallback for production when API key is not present, preventing the "Neural link severed" crash.
                    if (response.status === 400 && !apiKey) {
                        return lang === 'en' 
                            ? "System Ping: LLM bypassed for pipeline diagnostics. Live agent is offline." 
                            : "Системный пинг: LLM отключен для диагностики пайплайна.";
                    }
                    throw new Error(`HTTP error!`);
                }
                const data = await response.json();
                return data.candidates?.[0]?.content?.parts?.[0]?.text || "Anomaly detected.";
            } catch (err) {
                if (i === retries - 1) return "System Error: Neural link severed.";
                await new Promise(res => setTimeout(res, delay)); delay *= 2;
            }
        }
    };

    const handleSendMessage = async () => {
        if (!chatInput.trim()) return;
        const userText = chatInput.trim(); setChatInput('');
        const newChatLog = [...chatLog, { role: 'user', text: userText }];
        setChatLog(newChatLog); setIsTyping(true);
        setUserMessageCount(prev => prev + 1);

        const aiResponse = await fetchGeminiWithRetry(userText);
        setIsTyping(false); setChatLog([...newChatLog, { role: 'ai', text: aiResponse }]);

        if (userMessageCount + 1 === 3 && !leadCaptured) {
            setTimeout(() => {
                setIsLeadCaptureMode(true);
                setChatLog(prev => [...prev, { role: 'system', text: lang === 'en' ? "SYSTEM ALERT: Please authenticate via Email or Telegram handle." : "СИСТЕМНОЕ УВЕДОМЛЕНИЕ: Пожалуйста, авторизуйтесь через Email или Telegram." }]);
            }, 1500);
        }
    };

    const handleSubmitLead = async () => {
        if (!leadHandle.trim()) return;
        
        const formattedChat = chatLog.map(msg => `${msg.role.toUpperCase()}: ${msg.text}`).join('\n');
        
        // 1. INGRESS WEBHOOK URL: Fire unconditionally first, decoupled from Firestore
        try {
            const webAppUrl = "https://script.google.com/macros/s/AKfycbyIO6N_3hGpaqms--cuxZ3DbxqzPBcJHPh4ckDgu-AaNd2mmcYRJcwfbO6_e1h5oXwI/exec";
            
            await fetch(webAppUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({
                    email: leadHandle,
                    type: "AI Terminal Capture",
                    payload: formattedChat
                })
            });
        } catch (webhookError) {
            console.error("EdgeCRM Webhook Failed:", webhookError);
        }

        // 2. Legacy Write: Only fire if authentication succeeded (Wrapped in try/catch to not block UI)
        try {
            if (dbInstance && authInstance?.currentUser) {
                const { collection, addDoc, serverTimestamp } = await nativeImport('https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js');
                const appId = typeof __app_id !== 'undefined' ? __app_id : 'nicksaperov-portfolio';
                await addDoc(collection(dbInstance, 'artifacts', appId, 'public', 'data', 'leads'), {
                    handle: leadHandle, language: lang, chatHistory: chatLog, timestamp: serverTimestamp(), userId: authInstance.currentUser.uid
                });
            }
        } catch (dbError) {
            console.warn("Lead Backup Failed (Permission Denied):", dbError);
        }

        // 3. Resolve UI State
        setLeadCaptured(true); 
        setIsLeadCaptureMode(false);
        setChatLog(prev => [...prev, { role: 'system', text: lang === 'en' ? `Identity verified. Contact secured.` : `Личность подтверждена. Контакт сохранен.` }]);
    };

    const t = (enText, ruText) => lang === 'en' ? enText : ruText;
    const activeItem = activeItemType === 'project' ? projectsData.find(p => p.id === activeItemId) : articlesData.find(a => a.id === activeItemId);
    const activeTitle = activeItem ? (activeItem.title ? activeItem.title : t(activeItem.titleEn, activeItem.titleRu)) : '';
    const activeTags = activeItem && activeItem.tags ? (Array.isArray(activeItem.tags) ? activeItem.tags : activeItem.tags.split(' • ')) : [];

    const exportContent = () => {
        if (!activeItem) return;
        const tempDiv = document.createElement("div"); tempDiv.innerHTML = t(activeItem.contentEn, activeItem.contentRu);
        navigator.clipboard.writeText(`--- ${activeItemType.toUpperCase()} DATA ---\nTITLE: ${activeTitle}\n\nCONTENT:\n${(tempDiv.innerText || tempDiv.textContent || "").trim()}`).then(() => {
            setToast(t('Content copied!', 'Скопировано!')); setTimeout(() => setToast(null), 3000);
        });
    };

    const renderNav = () => (
        <nav className="fixed w-full z-50 glass-panel border-b border-gray-800 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0 cursor-pointer flex items-center" onClick={() => handleNav('home')}>
                        <span className="font-mono font-bold text-2xl tracking-tighter text-white">NICK<span className="neon-text-blue">.</span>SAPEROV</span>
                    </div>
                    <div className="hidden md:flex items-center">
                        <div className="ml-10 flex items-baseline space-x-6 lg:space-x-8 font-mono text-sm">
                            {['home', 'projects', 'articles', 'services', 'book', 'contacts'].map((item, idx) => (
                                <button key={item} onClick={() => handleNav(item)} className={`px-2 lg:px-3 py-2 rounded-md transition-colors ${view.includes(item.split('-')[0]) ? (item === 'book' || item === 'contacts' ? 'bg-purple-500 text-white border-purple-500' : 'text-cyan-400') : (item === 'book' || item === 'contacts' ? 'text-purple-400 border border-purple-500 hover:bg-purple-500 hover:text-white' : 'text-gray-400 hover:text-cyan-400')}`}>
                                    {t(`0${idx+1} // ${item.toUpperCase()}`, `0${idx+1} // ${['ГЛАВНАЯ', 'ПРОЕКТЫ', 'СТАТЬИ', 'УСЛУГИ', 'КНИГА', 'КОНТАКТЫ'][idx]}`)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="md:hidden flex items-center gap-4">
                        <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-400 hover:text-white"><i className="fa-solid fa-bars text-2xl"></i></button>
                    </div>
                </div>
            </div>
            {menuOpen && (
                <div className="md:hidden glass-panel border-t border-gray-800 px-2 pt-2 pb-3 space-y-1">
                    {['home', 'projects', 'articles', 'services', 'book', 'contacts'].map((item) => (
                        <button key={item} onClick={() => handleNav(item)} className={`block px-3 py-2 rounded-md text-base font-mono w-full text-left ${view === item ? 'text-cyan-400 bg-gray-800' : 'text-gray-300'}`}>{item.toUpperCase()}</button>
                    ))}
                </div>
            )}
        </nav>
    );

    const renderDiagnosticHUD = () => {
        if (!dbError) return null;
        return (
            <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-lg mb-8 font-mono text-sm flex items-center gap-3">
                <i className="fa-solid fa-triangle-exclamation text-xl"></i>
                <div><p className="font-bold">Database Uplink Failed</p><p>{dbError}</p></div>
            </div>
        );
    };

    const renderLoading = (text) => {
        if (!isDataLoading || dbError) return null;
        return (
            <div className="flex flex-col items-center justify-center py-20 text-cyan-400 gap-4">
                <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-mono text-sm animate-pulse">{text}</p>
            </div>
        );
    };

    const renderHome = () => (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh] animate-fade-in">
            <div>
                <div className="inline-block px-3 py-1 mb-6 text-xs font-mono text-cyan-400 border border-cyan-400 rounded-full bg-cyan-400/10">
                    {t('SYSTEM.STATUS: READY FOR DEPLOYMENT', 'СИСТЕМА: ГОТОВА К РАЗВЕРТЫВАНИЮ')}
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
                    {t('Architecting', 'Проектирование')} <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">{t('Decentralized', 'Децентрализованной')}</span> <br/>{t('Logic.', 'Логики.')}
                </h1>
                <p className="text-gray-400 text-lg md:text-xl mb-8 font-light max-w-lg">
                    {t('Ex-TradFi trader turned Web3/Cloud Product Manager. I bridge institutional finance with robust on-chain protocols through tokenomics, mechanism design, and full-stack execution.', 'Ex-TradFi трейдер, ставший Web3/Cloud продакт-менеджером. Я соединяю институциональные финансы с надежными on-chain протоколами через токеномику и проектирование механизмов.')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={() => setIsVideoOpen(true)} className="px-8 py-3 bg-white text-[#0a0a0f] font-bold rounded hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"><i className="fa-solid fa-play"></i> {t('Watch Pitch', 'Смотреть Питч')}</button>
                    <button onClick={() => handleNav('projects')} className="px-8 py-3 glass-panel text-white font-bold rounded neon-border-blue hover:bg-cyan-400/10 transition-colors flex items-center justify-center gap-2"><i className="fa-solid fa-folder-open"></i> {t('View Core Stack', 'Стек Технологий')}</button>
                </div>
            </div>
            <div className="relative hidden lg:flex justify-center items-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 to-purple-500/20 blur-3xl rounded-full w-3/4 h-3/4 m-auto"></div>
                <div className="glass-panel p-8 rounded-xl relative z-10 w-full aspect-square flex flex-col justify-center border-t border-l border-white/10 overflow-hidden">
                    <i className="fa-brands fa-ethereum text-[12rem] text-gray-700 opacity-20 absolute -right-4 -bottom-4"></i>
                    <h3 className="text-2xl font-mono text-white mb-6 z-10">{t('Core Competencies', 'Ключевые Компетенции')}</h3>
                    <ul className="space-y-5 font-mono text-sm text-gray-300 z-10">
                        {['Applied AI & LLM Architecture', 'Tokenomics & Mechanism Design', '0-to-1 MVP Execution', 'Smart Contract Architecture', 'Front-End (React/Tailwind)'].map((comp, idx) => (
                            <li key={idx} className="flex items-center gap-3"><i className="fa-solid fa-check text-cyan-400"></i> {t(comp, ['Прикладной ИИ и Архитектура LLM', 'Токеномика и Дизайн Механизмов', 'Запуск MVP с 0 до 1', 'Архитектура Смарт-Контрактов', 'Front-End (React/Tailwind)'][idx])}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );

    const renderProjects = () => (
        <section className="animate-fade-in">
            <div className="mb-12">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t('Shipped ', 'Выпущенные ')}<span className="neon-text-blue">{t('Protocols.', 'Протоколы.')}</span></h2>
                <p className="text-gray-400 font-mono text-sm border-l-2 border-cyan-400 pl-4">{t('A selection of architecture, dApps, and cloud deployments.', 'Подборка архитектурных решений, dApps и облачных развертываний.')}</p>
            </div>
            {renderDiagnosticHUD()}
            {renderLoading("Syncing Protocols from Edge...")}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projectsData.map((proj) => (
                    <div key={proj.id} onClick={() => openDetailView(proj.id, 'project')} className={`glass-panel rounded-lg overflow-hidden group hover:neon-border-${proj.color === 'cyan' ? 'blue' : 'purple'} transition-all duration-300 cursor-pointer`}>
                        <div className="h-48 bg-[#11111a] flex items-center justify-center border-b border-gray-800 relative overflow-hidden">
                            <div className={`absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-${proj.color === 'cyan' ? 'cyan-400' : 'purple-500'} to-transparent`}></div>
                            <i className={`${proj.icon} text-5xl text-gray-600 group-hover:text-${proj.color === 'cyan' ? 'cyan-400' : 'purple-500'} transition-colors z-10`}></i>
                        </div>
                        <div className="p-6 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-white">{proj.title}</h3>
                                <span className={`text-[10px] font-mono px-2 py-1 rounded bg-${proj.color === 'cyan' ? 'cyan-400/10 text-cyan-400' : 'purple-500/10 text-purple-400'}`}>{t(proj.tagEn, proj.tagRu)}</span>
                            </div>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-4">{t(proj.descEn, proj.descRu)}</p>
                            <div className="flex flex-wrap gap-2 text-xs font-mono text-gray-500 mt-auto pt-4">{proj.tags && (Array.isArray(proj.tags) ? proj.tags : proj.tags.split(' • ')).map(tag => <span key={tag}>{tag}</span>)}</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );

    const renderArticles = () => (
        <section className="animate-fade-in">
            <div className="mb-12">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t('Strategic ', 'Стратегические ')}<span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-white">{t('Writings.', 'Статьи.')}</span></h2>
                <p className="text-gray-400 font-mono text-sm border-l-2 border-gray-500 pl-4">{t('Thoughts on open-source, AI limitations, and Web3 infrastructure.', 'Мысли об open-source, ограничениях ИИ и инфраструктуре Web3.')}</p>
            </div>
            {renderDiagnosticHUD()}
            {renderLoading("Syncing Articles from Edge...")}
            <div className="flex flex-col gap-6">
                {articlesData.map((article) => (
                    <article key={article.id} onClick={() => openDetailView(article.id, 'article')} className={`glass-panel p-6 rounded-lg hover:bg-[#11111a] transition-colors cursor-pointer group border-l-4 border-l-transparent hover:border-l-${article.color === 'cyan' ? 'cyan-400' : 'purple-500'}`}>
                        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                            <div className="flex-1">
                                <h3 className={`text-xl font-bold text-white mb-2 group-hover:text-${article.color === 'cyan' ? 'cyan-400' : 'purple-500'} transition-colors`}>{t(article.titleEn, article.titleRu)}</h3>
                                <p className="text-gray-400 text-sm mb-3">{t(article.excerptEn, article.excerptRu)}</p>
                                <div className="font-mono text-xs text-gray-500">{article.tags}</div>
                            </div>
                            <i className={`fa-solid fa-arrow-right hidden md:block text-gray-600 group-hover:text-${article.color === 'cyan' ? 'cyan-400' : 'purple-500'} -rotate-45 transition-all`}></i>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );

    const renderDetail = () => (
        <section className="animate-fade-in max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <button onClick={() => handleNav(activeItemType === 'project' ? 'projects' : 'articles')} className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors font-mono text-sm"><i className="fa-solid fa-arrow-left"></i> {activeItemType === 'project' ? t('BACK TO PROTOCOLS', 'НАЗАД К ПРОТОКОЛАМ') : t('BACK TO DIRECTORY', 'НАЗАД В КАТАЛОГ')}</button>
                <button onClick={exportContent} className="text-cyan-400 hover:text-white flex items-center gap-2 transition-colors font-mono text-sm border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 rounded hover:bg-cyan-400/20 shadow-[0_0_10px_rgba(34,211,238,0.1)]"><i className="fa-solid fa-copy"></i> {t('EXPORT CONTENT', 'ЭКСПОРТ')}</button>
            </div>
            <article className="glass-panel p-8 md:p-12 rounded-xl border-t border-gray-800 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-${activeItem.color === 'cyan' ? 'cyan-400/10' : 'purple-500/10'} to-transparent blur-2xl`}></div>
                <header className="mb-10 pb-10 border-b border-gray-800 relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        {activeItem.icon && <i className={`${activeItem.icon} text-3xl md:text-4xl text-${activeItem.color === 'cyan' ? 'cyan-400' : 'purple-400'}`}></i>}
                        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight">{activeTitle}</h1>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm font-mono text-gray-400">
                        {activeItemType === 'article' && <span>NICK SAPEROV |</span>}
                        {activeItem.tagEn && <span className={`px-3 py-1 rounded bg-${activeItem.color === 'cyan' ? 'cyan-400/10 text-cyan-400 border border-cyan-400/20' : 'purple-500/10 text-purple-400 border border-purple-500/20'}`}>{t(activeItem.tagEn, activeItem.tagRu)}</span>}
                        <div className="flex flex-wrap gap-2">{activeTags.map(tag => <span key={tag} className={activeItemType === 'project' ? "px-3 py-1 bg-gray-800 text-gray-400 rounded border border-gray-700" : `text-${activeItem.color === 'cyan' ? 'cyan-400' : 'purple-400'}`}>{tag}</span>)}</div>
                    </div>
                </header>
                <div className="article-prose relative z-10" dangerouslySetInnerHTML={{ __html: t(activeItem.contentEn, activeItem.contentRu) }} />
                {activeItem.liveLink && (
                    <div className="mt-12 pt-8 border-t border-gray-800 relative z-10 flex justify-center md:justify-start">
                        <a href={activeItem.liveLink} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 px-8 py-4 rounded font-bold text-white transition-all shadow-lg ${activeItem.color === 'cyan' ? 'bg-cyan-500/20 border border-cyan-400 hover:bg-cyan-400 hover:text-black' : 'bg-purple-500/20 border border-purple-500 hover:bg-purple-500 hover:text-white'}`}>
                            {t('Access Live Protocol', 'Перейти к протоколу')} <i className="fa-solid fa-arrow-up-right-from-square"></i>
                        </a>
                    </div>
                )}
            </article>
        </section>
    );

    const renderServices = () => (
        <section className="animate-fade-in">
            <div className="mb-12">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t('Engineering & ', 'Разработка и ')}<span className="neon-text-blue">{t('Strategy.', 'Стратегия.')}</span></h2>
                <p className="text-gray-400 font-mono text-sm border-l-2 border-cyan-400 pl-4 max-w-2xl">{t('I operate as a Solopreneur, Solutions Architect, and Product Manager. I offer end-to-end execution for highly technical, specialized projects.', 'Я работаю как Solopreneur, Архитектор решений и Продакт-менеджер. Предлагаю реализацию полного цикла для высокотехнологичных и специализированных проектов.')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {[
                    { icon: 'fa-robot', color: 'cyan-400', hover: 'neon-border-blue', titleEn: 'Applied AI & Automation', titleRu: 'Прикладной ИИ и Автоматизация', pointsEn: ['Custom AI Agents trained on proprietary company logic.', 'LLM Integration into existing SaaS.', 'Workplace automation engineering.'], pointsRu: ['Кастомные ИИ-агенты, обученные на логике компании.', 'Интеграция LLM в существующие SaaS.', 'Автоматизация рабочих процессов.'] },
                    { icon: 'fa-layer-group', color: 'purple-400', hover: 'neon-border-purple', titleEn: 'Web Architecture & MVP Build', titleRu: 'Веб-архитектура и Разработка MVP', pointsEn: ['0-to-1 Full-Stack Execution (Next.js, React, Firebase).', 'Multi-tenant SaaS & Monorepo engineering.', 'Web3 dApp Development, wallet connections.'], pointsRu: ['Разработка полного цикла (Next.js, React, Firebase).', 'Многопользовательские SaaS и Monorepo.', 'Разработка Web3 dApp, подключение кошельков.'] },
                    { icon: 'fa-chess-knight', color: 'gray-300', hover: 'border-white', titleEn: 'Strategic Product Consulting', titleRu: 'Продуктовый Консалтинг', pointsEn: ['Architecture & Tech-Stack Audits.', 'Tokenomics & Mechanism Design.', 'Go-to-Market (GTM) Strategy.'], pointsRu: ['Аудит архитектуры и технологического стека.', 'Токеномика и дизайн механизмов.', 'Стратегия выхода на рынок (GTM).'] }
                ].map((srv, idx) => (
                    <div key={idx} className={`glass-panel p-8 rounded-xl border-t border-${srv.color.split('-')[0]}-500/50 hover:${srv.hover} transition-all duration-300 flex flex-col`}>
                        <i className={`fa-solid ${srv.icon} text-4xl text-${srv.color} mb-6`}></i>
                        <h3 className="text-2xl font-bold text-white mb-4">{t(srv.titleEn, srv.titleRu)}</h3>
                        <ul className="space-y-4 text-gray-400 text-sm flex-grow">
                            {srv.pointsEn.map((pt, i) => (
                                <li key={i} className="flex items-start gap-3"><i className={`fa-solid fa-check text-${srv.color} mt-1`}></i><span>{t(pt, srv.pointsRu[i])}</span></li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="bg-[#11111a] border border-gray-800 rounded-xl p-8 md:p-12 text-center max-w-3xl mx-auto relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-400 to-transparent pointer-events-none"></div>
                <h3 className="text-2xl font-bold text-white mb-4 relative z-10">{t('Ready to initiate a project?', 'Готовы запустить проект?')}</h3>
                <p className="text-gray-400 mb-8 relative z-10">{t('Reach out directly via Telegram for architecture assessments, technical consulting, or partnership inquiries.', 'Свяжитесь со мной напрямую в Telegram для оценки архитектуры, технических консультаций или вопросов о партнерстве.')}</p>
                <a href="https://t.me/nicksaperov" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-cyan-500/20 text-cyan-400 border border-cyan-400 rounded hover:bg-cyan-400 hover:text-black font-bold transition-all relative z-10 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                    <i className="fa-brands fa-telegram text-xl"></i> {t('Initialize Contact (@nicksaperov)', 'Связаться (@nicksaperov)')}
                </a>
            </div>
        </section>
    );

    const renderBook = () => (
        <section className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-mono text-purple-400 border border-purple-500 rounded-full bg-purple-500/10">
                        <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span></span>
                        {t('WRITING IN REAL-TIME', 'ПИШУ В РЕАЛЬНОМ ВРЕМЕНИ')}
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('The Bounded Rationality of Decentralization', 'Ограниченная Рациональность Децентрализации')}</h2>
                    <p className="text-xl text-gray-300 font-light mb-8 italic">{t("Bridging Herbert Simon's theories with modern On-Chain Mechanisms.", "Объединение теорий Герберта Саймона с современными On-Chain механизмами.")}</p>
                    <div className="space-y-4 text-gray-400 leading-relaxed">
                        <p>{t('I am currently writing this manuscript in public. It explores the intersection of traditional economic modeling (specifically the limits of human cognition and rationality as defined by Herbert Simon) and the trustless, algorithmic execution of smart contracts.', 'В настоящее время я пишу эту рукопись публично. В ней исследуется пересечение традиционного экономического моделирования и алгоритмического исполнения смарт-контрактов.')}</p>
                        <p>{t('Decentralization removes the central planner, but it does not remove the cognitive boundaries of the participants. How do we design AMMs, governance tokens, and liquidity incentives that account for the "satisficing" behavior of real users rather than the mythical "rational actor" of classical economics?', 'Децентрализация убирает центрального планировщика, но не убирает когнитивные границы участников. Как нам проектировать AMM и токены управления, учитывая реальное поведение пользователей?')}</p>
                        <div className="flex flex-col sm:flex-row gap-4 my-8">
                            <a href="https://docs.google.com/document/d/1AZB7QQAR-nS4mtKk17IF9ILGMkOxQMu6jlONaTacHRU/edit?usp=sharing" target="_blank" rel="noreferrer" className="flex-1 glass-panel p-4 rounded-lg neon-border-blue hover:bg-cyan-400/10 transition-colors flex items-center justify-center gap-3">
                                <i className="fa-solid fa-file-lines text-cyan-400"></i><div><div className="text-white font-bold text-sm">Read Draft (English)</div><div className="text-xs text-gray-400 font-mono">Google Docs Live</div></div>
                            </a>
                            <a href="https://docs.google.com/document/d/1wwLdVVDlGvydMwIl3opztvYkxWqNdQyzA0Po71DqEII/edit?usp=sharing" target="_blank" rel="noreferrer" className="flex-1 glass-panel p-4 rounded-lg neon-border-purple hover:bg-purple-500/10 transition-colors flex items-center justify-center gap-3">
                                <i className="fa-solid fa-file-lines text-purple-400"></i><div><div className="text-white font-bold text-sm">Читать черновик (Русский)</div><div className="text-xs text-gray-400 font-mono">Google Docs Live</div></div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-4">
                    <div className="glass-panel p-6 rounded-xl sticky top-28 neon-border-purple">
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><i className="fa-solid fa-bolt text-purple-400 text-xl"></i> {t('Fuel the Synthesis', 'Поддержать Синтез')}</h3>
                        <p className="text-sm text-gray-400 mb-6">{t('Support the open-source dissemination of this book via the channels below.', 'Поддержите открытое распространение, через каналы ниже.')}</p>
                        <div className="space-y-4">
                            <div className="bg-[#0a0a0f] border border-gray-800 p-4 rounded-lg">
                                <div className="flex items-center gap-3 mb-2"><i className="fa-brands fa-ethereum text-cyan-400"></i><span className="font-mono text-sm text-gray-300 font-bold">Web3 / Ethereum</span></div>
                                <div className="bg-black p-2 rounded text-xs font-mono text-gray-500 flex justify-between items-center"><span id="ens-address">saperov.eth</span><button onClick={() => copyToClipboard('saperov.eth', 'ens-copy-btn')} id="ens-copy-btn" className="hover:text-white"><i className="fa-regular fa-copy"></i></button></div>
                            </div>
                            <div className="bg-[#0a0a0f] border border-gray-800 p-4 rounded-lg">
                                <div className="flex items-center gap-3 mb-2"><i className="fa-brands fa-telegram text-blue-400"></i><span className="font-mono text-sm text-gray-300 font-bold">{t('Telegram (TON)', 'Telegram (TON)')}</span></div>
                                <div className="bg-black p-2 rounded text-xs font-mono text-gray-500 flex justify-between items-center"><span id="tg-address">@nicksaperov</span><button onClick={() => copyToClipboard('@nicksaperov', 'tg-copy-btn')} id="tg-copy-btn" className="hover:text-white"><i className="fa-regular fa-copy"></i></button></div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-4">
                                <a href="https://boosty.to/nicksaperov/donate" target="_blank" rel="noreferrer" className="py-3 bg-[#11111a] border border-orange-500/50 text-white font-bold text-sm rounded hover:bg-orange-500/20 transition-colors flex items-center justify-center gap-2"><i className="fa-solid fa-fire text-orange-500"></i> Boosty</a>
                                <a href="https://paragraph.com/@nicksaperov" target="_blank" rel="noreferrer" className="py-3 bg-[#11111a] border border-purple-500/50 text-white font-bold text-sm rounded hover:bg-purple-500/20 transition-colors flex items-center justify-center gap-2"><i className="fa-solid fa-paragraph text-purple-400"></i> Paragraph</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

    const renderContacts = () => {
        const socialNodes = [
            { id: 'bluesky', url: 'https://bsky.app/profile/nicksaperov.xyz', isSvg: true, viewBox: '0 0 360 320', svgPath: 'M180 141.964C163.699 104.706 116.142 41.5288 38.6476 14.2818C14.7705 5.89069 0 17.5113 0 43.1497C0 60.1065 3.32833 118.813 9.4299 137.915C21.8488 176.772 73.1895 186.297 122.956 177.106C54.1039 193.364 21.0553 234.374 44.5976 274.656C69.0903 316.568 136.376 288.75 180 232.062C223.624 288.75 290.91 316.568 315.402 274.656C338.945 234.374 305.896 193.364 237.044 177.106C286.811 186.297 338.151 176.772 350.57 137.915C356.672 118.813 360 60.1065 360 43.1497C360 17.5113 345.23 5.89069 321.352 14.2818C243.858 41.5288 196.301 104.706 180 141.964Z' },
            { id: 'x', url: 'https://x.com/nicksaperov', icon: 'fa-brands fa-x-twitter' },
            { id: 'linkedin', url: 'https://www.linkedin.com/in/nicksaperov', icon: 'fa-brands fa-linkedin' },
            { id: 'discord', url: 'https://discord.com/nicksaperov', icon: 'fa-brands fa-discord' },
            { id: 'facebook', url: 'https://facebook.com/nicksaperov', icon: 'fa-brands fa-facebook' },
            { id: 'telegram', url: 'https://t.me/nicksaperov', icon: 'fa-brands fa-telegram' },
            { id: 'threads', url: 'https://www.threads.com/@nicksaperov', icon: 'fa-brands fa-threads' },
            { id: 'email', url: 'mailto:nick@nicksaperov.xyz', icon: 'fa-solid fa-envelope' },
            { id: 'vk', url: 'https://vk.com/nikolaisaperov', icon: 'fa-brands fa-vk' },
            { id: 'instagram', url: 'https://www.instagram.com/nicksaperov', icon: 'fa-brands fa-instagram' },
            { id: 'farcaster', url: 'https://farcaster.xyz/saperov.eth', icon: 'fa-solid fa-satellite-dish' },
            { id: 'tumblr', url: 'https://nicksaperov.tumblr.com/', icon: 'fa-brands fa-tumblr' },
            { id: 'medium', url: 'https://nicksaperov.medium.com', icon: 'fa-brands fa-medium' },
            { id: 'reddit', url: 'https://www.reddit.com/user/nikolaysaperov/', icon: 'fa-brands fa-reddit' },
            { id: 'boosty', url: 'https://boosty.to/nicksaperov', icon: 'fa-solid fa-fire' },
            { id: 'buz', url: 'https://i.buz-app.com/s/33a4cre2i8', icon: 'fa-solid fa-walkie-talkie' }
        ];

        return (
            <section className="animate-fade-in max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
                <div className="mb-16 text-center">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">{t('Global ', 'Глобальная ')}<span className="neon-text-blue">{t('Uplink.', 'Связь.')}</span></h2>
                    <p className="text-gray-400 font-mono text-sm">{t('Connect across decentralized and centralized nodes.', 'Подключение через децентрализованные и централизованные узлы.')}</p>
                </div>
                
                <div className="w-full max-w-3xl mx-auto mb-16 space-y-4 text-left">
                    <a href="/connect" className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 border border-cyan-500/30 hover:border-cyan-400 transition-all group">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 group-hover:scale-110 transition-transform flex items-center justify-center w-12 h-12">
                                <i className="fa-solid fa-terminal text-2xl"></i>
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">{t('Direct B2B Terminal', 'Прямой B2B Терминал')}</h3>
                                <p className="text-slate-400 text-sm">{t('Ping my Google Workspace directly for Architecture & PM inquiries.', 'Напишите в мой Google Workspace для запросов по архитектуре и PM.')}</p>
                            </div>
                        </div>
                        <i className="fa-solid fa-arrow-right text-cyan-400 opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all text-xl"></i>
                    </a>

                    <a href="https://wa.me/84362567343?text=Hi%20Nick,%20I%20am%20reaching%20out%20regarding..." target="_blank" rel="noopener noreferrer" 
                       className="flex items-center justify-between p-6 rounded-2xl bg-slate-900/50 border border-slate-700 hover:border-emerald-500/50 transition-all group">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform flex items-center justify-center w-12 h-12">
                                <i className="fa-brands fa-whatsapp text-2xl"></i>
                            </div>
                            <div>
                                <h3 className="text-slate-200 font-medium text-lg">{t('WhatsApp Direct', 'Прямой WhatsApp')}</h3>
                                <p className="text-slate-500 text-sm">{t('For fast, asynchronous messaging (+84 362 567 343).', 'Для быстрого асинхронного общения (+84 362 567 343).')}</p>
                            </div>
                        </div>
                        <i className="fa-solid fa-arrow-up-right-from-square text-emerald-400 opacity-0 group-hover:opacity-100 transition-all text-xl"></i>
                    </a>
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 w-full place-items-center">
                    {socialNodes.map((node) => (
                        <a key={node.id} href={node.url} target="_blank" rel="noreferrer" 
                           className="w-16 h-16 glass-panel rounded-xl flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:neon-border-blue hover:scale-110 transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                            {node.isSvg ? (
                                <svg className="w-8 h-8" viewBox={node.viewBox} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d={node.svgPath} />
                                </svg>
                            ) : (
                                <i className={`${node.icon} text-3xl`}></i>
                            )}
                        </a>
                    ))}
                </div>
            </section>
        );
    };

    const renderChat = () => {
        if (!isChatOpen) return null;
        return (
            <div className="fixed bottom-24 right-6 w-[350px] h-[500px] glass-panel rounded-xl shadow-2xl flex flex-col z-50 animate-fade-in">
                <div className="bg-gray-900 border-b border-gray-700 p-3 rounded-t-xl flex justify-between items-center">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div><span className="font-mono text-sm text-gray-300 font-bold">Nick_AI_Agent v1.0</span></div>
                    <button onClick={() => setIsChatOpen(false)} className="text-gray-500 hover:text-white"><i className="fa-solid fa-xmark text-lg"></i></button>
                </div>
                <div className="flex-grow p-4 overflow-y-auto space-y-4 font-mono text-sm flex flex-col">
                    <div className="text-gray-500 text-xs text-center border-b border-gray-800 pb-2 mb-2">{t('Neural link established. Trained on profile data.', 'Нейронная связь установлена. Обучен на профиле.')}</div>
                    {chatLog.map((msg, idx) => (
                        msg.role === 'system' ? (
                            <div key={idx} className="text-center my-4 animate-fade-in"><div className="inline-block bg-purple-500/10 border border-purple-500/30 text-purple-400 px-4 py-2 rounded text-xs font-mono shadow-[0_0_10px_rgba(168,85,247,0.1)]"><i className="fa-solid fa-shield-halved mr-2"></i>{msg.text}</div></div>
                        ) : (
                            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} mt-4`}>
                                <span className={`${msg.role === 'user' ? 'text-gray-500' : 'text-cyan-400'} mb-1 text-[10px]`}>{msg.role === 'user' ? 'USER &gt;' : 'AI &gt;'}</span>
                                <div className={`${msg.role === 'user' ? 'bg-gray-800 rounded-l-lg rounded-br-lg text-white' : 'bg-[#11111a] rounded-r-lg rounded-bl-lg text-gray-300'} border border-gray-700 p-3`} dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>') }} />
                            </div>
                        )
                    ))}
                    {isTyping && (
                        <div className="flex flex-col items-start mt-4"><span className="text-cyan-400 mb-1 text-[10px]">AI &gt;</span><div className="bg-[#11111a] border border-gray-700 p-3 rounded-r-lg rounded-bl-lg text-gray-500 flex gap-1"><span className="animate-bounce">.</span><span className="animate-bounce" style={{animationDelay: '0.2s'}}>.</span><span className="animate-bounce" style={{animationDelay: '0.4s'}}>.</span></div></div>
                    )}
                    <div ref={chatEndRef} />
                </div>
                {isLeadCaptureMode ? (
                    <div className="p-3 border-t border-gray-700 bg-gray-900 rounded-b-xl flex gap-0 animate-fade-in">
                        <span className="bg-gray-800 text-gray-400 p-2 rounded-l border border-r-0 border-gray-700 font-mono text-sm">@</span>
                        <input type="text" value={leadHandle} onChange={(e) => setLeadHandle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSubmitLead()} className="flex-grow bg-black border border-gray-700 border-l-0 p-2 text-white font-mono text-sm focus:outline-none focus:border-purple-500" placeholder={t('Email or Telegram...', 'Ваш Email или Telegram...')} />
                        <button onClick={handleSubmitLead} className="bg-purple-500/20 text-purple-400 border border-purple-500 px-4 py-2 rounded-r hover:bg-purple-500 hover:text-white font-bold transition-colors font-mono text-sm"><i className="fa-solid fa-unlock-keyhole"></i></button>
                    </div>
                ) : (
                    <div className="p-3 border-t border-gray-700 bg-gray-900 rounded-b-xl flex gap-2">
                        <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} className="flex-grow bg-black border border-gray-700 rounded p-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-400" placeholder={t('Type query...', 'Введите запрос...')} />
                        <button onClick={handleSendMessage} className="bg-white text-black px-3 py-2 rounded hover:bg-gray-200 transition-colors"><i className="fa-solid fa-arrow-turn-down -rotate-90"></i></button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="font-sans antialiased min-h-screen flex flex-col bg-[#0a0a0f]">
            {renderNav()}
            <main className="flex-grow pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                {view === 'home' && renderHome()}
                {view === 'projects' && renderProjects()}
                {view === 'articles' && renderArticles()}
                {view === 'detail' && activeItem && renderDetail()}
                {view === 'services' && renderServices()}
                {view === 'book' && renderBook()}
                {view === 'contacts' && renderContacts()}
            </main>
            <footer className="border-t border-gray-800 bg-[#0a0a0f] py-8 text-center mt-auto">
                <p className="text-gray-500 font-mono text-sm mb-4">© {new Date().getFullYear()} NICK SAPEROV. {t('BUILT ON THE OPEN WEB.', 'СОЗДАНО В ОТКРЫТОМ WEB.')}</p>
                <div className="flex justify-center gap-6">
                    <a href="https://x.com/nicksaperov" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors"><i className="fa-brands fa-x-twitter text-xl"></i></a>
                    <a href="https://github.com/nicksaperov" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors"><i className="fa-brands fa-github text-xl"></i></a>
                    <a href="https://www.linkedin.com/in/nicksaperov" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors"><i className="fa-brands fa-linkedin text-xl"></i></a>
                </div>
            </footer>
            {toast && <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] glass-panel px-6 py-3 rounded-full border border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)] animate-fade-in flex items-center gap-3 text-sm font-mono text-cyan-400"><i className="fa-solid fa-circle-info animate-pulse"></i>{toast}</div>}
            
            <a href="/connect" 
               className="fixed top-24 right-6 z-[100] group flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 text-cyan-400 px-4 py-2.5 rounded-full hover:bg-cyan-950/50 hover:border-cyan-400 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)]">
                <div className="relative flex h-3 w-3 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                </div>
                <i className="fa-solid fa-comment-dots w-4 h-4 flex items-center justify-center"></i>
                <span className="text-sm font-semibold tracking-wide uppercase hidden sm:inline">{t('Chat', 'Чат')}</span>
            </a>

            <button onClick={() => setLang(lang === 'en' ? 'ru' : 'en')} className="fixed bottom-6 left-6 h-14 px-4 glass-panel rounded-full flex items-center justify-center text-gray-300 hover:text-cyan-400 hover:border-cyan-400 shadow-lg z-40 gap-2 transition-all"><i className="fa-solid fa-globe text-lg"></i><span className="font-mono text-sm font-bold">{lang === 'en' ? 'RU' : 'EN'}</span></button>
            <button onClick={() => setIsChatOpen(!isChatOpen)} className="fixed bottom-6 right-6 w-14 h-14 bg-white rounded-full flex items-center justify-center text-[#0a0a0f] shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-110 transition-transform z-50"><i className="fa-solid fa-robot text-2xl"></i></button>
            
            {renderChat()}
        </div>
    );
}

export default App;