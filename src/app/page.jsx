import Link from 'next/link';

export default function Home() {
  return (
    <div className="font-sans antialiased min-h-screen flex flex-col bg-[#0a0a0f]">
      <main className="flex-grow pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        {/* --- HERO SECTION --- */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh] animate-fade-in">
          <div>
            <div className="inline-block px-3 py-1 mb-6 text-xs font-mono text-cyan-400 border border-cyan-400 rounded-full bg-cyan-400/10">
              SYSTEM.STATUS: DEPLOYED TO EDGE
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              Architecting <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                Decentralized
              </span> <br/>
              Logic.
            </h1>
            <p className="text-gray-400 text-lg md:text-xl mb-8 font-light max-w-lg">
              Ex-TradFi trader turned Web3/Cloud Product Manager. I bridge institutional finance with robust on-chain protocols through tokenomics, mechanism design, and full-stack execution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/projects" className="px-8 py-3 glass-panel text-white font-bold rounded neon-border-blue hover:bg-cyan-400/10 transition-colors flex items-center justify-center gap-2">
                <i className="fa-solid fa-folder-open"></i> View Core Stack
              </Link>
              <Link href="/articles" className="px-8 py-3 glass-panel text-white font-bold rounded neon-border-purple hover:bg-purple-500/10 transition-colors flex items-center justify-center gap-2">
                <i className="fa-solid fa-file-lines"></i> Strategic Writings
              </Link>
            </div>
          </div>
          <div className="relative hidden lg:flex justify-center items-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 to-purple-500/20 blur-3xl rounded-full w-3/4 h-3/4 m-auto"></div>
            <div className="glass-panel p-8 rounded-xl relative z-10 w-full aspect-square flex flex-col justify-center border-t border-l border-white/10 overflow-hidden">
              <h3 className="text-2xl font-mono text-white mb-6 z-10">Core Competencies</h3>
              <ul className="space-y-5 font-mono text-sm text-gray-300 z-10">
                <li className="flex items-center gap-3"><i className="fa-solid fa-check text-cyan-400"></i> Applied AI & LLM Architecture</li>
                <li className="flex items-center gap-3"><i className="fa-solid fa-check text-cyan-400"></i> Tokenomics & Mechanism Design</li>
                <li className="flex items-center gap-3"><i className="fa-solid fa-check text-cyan-400"></i> 0-to-1 MVP Execution</li>
                <li className="flex items-center gap-3"><i className="fa-solid fa-check text-cyan-400"></i> Smart Contract Architecture</li>
                <li className="flex items-center gap-3"><i className="fa-solid fa-check text-cyan-400"></i> Cloud Native Engineering (GCP)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* --- SERVICES SECTION --- */}
        <section className="animate-fade-in mt-24">
          <div className="mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Engineering & <span className="neon-text-blue">Strategy.</span></h2>
            <p className="text-gray-400 font-mono text-sm border-l-2 border-cyan-400 pl-4 max-w-2xl">
              I operate as a Solopreneur, Solutions Architect, and Product Manager. I offer end-to-end execution for highly technical, specialized projects.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="glass-panel p-8 rounded-xl border-t border-cyan-500/50 hover:neon-border-blue transition-all duration-300 flex flex-col">
              <h3 className="text-2xl font-bold text-white mb-4">Applied AI & Automation</h3>
              <ul className="space-y-4 text-gray-400 text-sm flex-grow">
                <li className="flex items-start gap-3"><i className="fa-solid fa-check text-cyan-400 mt-1"></i><span>Custom AI Agents trained on proprietary company logic.</span></li>
                <li className="flex items-start gap-3"><i className="fa-solid fa-check text-cyan-400 mt-1"></i><span>LLM Integration into existing SaaS.</span></li>
              </ul>
            </div>
            <div className="glass-panel p-8 rounded-xl border-t border-purple-500/50 hover:neon-border-purple transition-all duration-300 flex flex-col">
              <h3 className="text-2xl font-bold text-white mb-4">Web Architecture</h3>
              <ul className="space-y-4 text-gray-400 text-sm flex-grow">
                <li className="flex items-start gap-3"><i className="fa-solid fa-check text-purple-400 mt-1"></i><span>0-to-1 Full-Stack Execution (Next.js, Cloud Run).</span></li>
                <li className="flex items-start gap-3"><i className="fa-solid fa-check text-purple-400 mt-1"></i><span>Multi-tenant SaaS & Monorepo engineering.</span></li>
              </ul>
            </div>
            <div className="glass-panel p-8 rounded-xl border-t border-gray-500/50 hover:border-white transition-all duration-300 flex flex-col">
              <h3 className="text-2xl font-bold text-white mb-4">Product Consulting</h3>
              <ul className="space-y-4 text-gray-400 text-sm flex-grow">
                <li className="flex items-start gap-3"><i className="fa-solid fa-check text-gray-300 mt-1"></i><span>Architecture & Tech-Stack Audits.</span></li>
                <li className="flex items-start gap-3"><i className="fa-solid fa-check text-gray-300 mt-1"></i><span>Tokenomics & Mechanism Design.</span></li>
              </ul>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
