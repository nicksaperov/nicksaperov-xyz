"use client";
import React, { useState } from 'react';
import { Shield, Users, Zap, CheckCircle2, ArrowRight, QrCode, Clock, Coins, Store, PackageOpen } from 'lucide-react';

const DashEventDAO = () => {
  const [selectedTier, setSelectedTier] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const perks = [
    {
      id: 'supporter',
      name: 'Network Supporter',
      dashAmount: '0.5 DASH',
      usdAmount: '~ $15',
      benefits: [
        'General Admission Ticket', 
        'Access to DAO Discord channel', 
        'Digital Merchant Quick Start Guide'
      ],
      color: 'border-slate-700 hover:border-slate-500'
    },
    {
      id: 'builder',
      name: 'Core Builder',
      dashAmount: '5 DASH',
      usdAmount: '~ $150',
      benefits: [
        'VIP Admission & Seating', 
        'Mini-DAO Voting Rights (1 Vote)', 
        'Physical "Dash Accepted Here" Window Stickers'
      ],
      color: 'border-blue-600 hover:border-blue-400 bg-blue-900/10',
      popular: true
    },
    {
      id: 'sponsor',
      name: 'Ecosystem Sponsor',
      dashAmount: '50 DASH',
      usdAmount: '~ $1,500',
      benefits: [
        'Mini-DAO Voting Rights (10 Votes)', 
        '5 VIP Tickets for Team', 
        'Complete Merchant Kit (Brochures & Stickers)',
        'Exclusive Metal Dash Coin (Gift)'
      ],
      color: 'border-cyan-500 hover:border-cyan-300 bg-cyan-900/10'
    }
  ];

  const handleContribute = (tier) => {
    setSelectedTier(tier);
    setShowPayment(true);
  };

  return (
    <div className="min-h-screen bg-[#060d1a] text-slate-200 font-sans selection:bg-blue-500/30 pb-20">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-[#0b1426]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white tracking-tighter">D</div>
            <span className="font-bold text-xl tracking-tight text-white">Dash<span className="text-blue-500">Events</span></span>
          </div>
          <button className="text-sm font-semibold hover:text-blue-400 transition-colors">Connect Identity</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-6xl mx-auto px-4 py-20 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="inline-block mb-4 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium">
          🇻🇳 Live: Vietnam Web3 Summit DAO
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
          Fund the Future.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Own the Event.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          A true Web3 crowdfunding protocol built on Dash Platform. Contribute Dash, earn verifiable perks, and distribute official Merchant Kits to local businesses.
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-300">
          <div className="flex items-center gap-2 bg-[#0f1b2d] px-4 py-2 rounded-lg border border-slate-800">
            <Users className="w-4 h-4 text-blue-500" /> 142 Contributors
          </div>
          <div className="flex items-center gap-2 bg-[#0f1b2d] px-4 py-2 rounded-lg border border-slate-800">
            <Zap className="w-4 h-4 text-blue-500" /> 450 DASH Raised
          </div>
          <div className="flex items-center gap-2 bg-[#0f1b2d] px-4 py-2 rounded-lg border border-slate-800">
            <Shield className="w-4 h-4 text-blue-500" /> 100% Provable on-chain
          </div>
        </div>
      </header>

      {/* NEW: Local Adoption & Merchant Assets Section */}
      <section className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        <div className="bg-[#0b1426] border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="text-center mb-10 relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4">Drive Local Retail Adoption</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Your contribution directly funds the printing and distribution of official Dash Merchant Kits across Vietnam. We provide businesses with everything they need to start accepting Digital Cash today.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 relative z-10">
            <div className="bg-[#060d1a] p-6 rounded-2xl border border-slate-800/60 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center mb-4 border border-blue-500/20">
                <Store className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-white font-bold mb-2">Window Stickers</h4>
              <p className="text-sm text-slate-400">High-quality "Dash Is Accepted Here" decals for storefronts.</p>
            </div>
            <div className="bg-[#060d1a] p-6 rounded-2xl border border-slate-800/60 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center mb-4 border border-blue-500/20">
                <PackageOpen className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-white font-bold mb-2">Quick Start Guides</h4>
              <p className="text-sm text-slate-400">DIY brochures educating merchants on POS systems & exchanges.</p>
            </div>
            <div className="bg-[#060d1a] p-6 rounded-2xl border border-slate-800/60 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center mb-4 border border-blue-500/20">
                <Coins className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-white font-bold mb-2">&lt; $0.01 Fees</h4>
              <p className="text-sm text-slate-400">Highlighting sub-cent transaction fees compared to traditional credit cards.</p>
            </div>
            <div className="bg-[#060d1a] p-6 rounded-2xl border border-slate-800/60 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center mb-4 border border-blue-500/20">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-white font-bold mb-2">Instant Settlement</h4>
              <p className="text-sm text-slate-400">Educating retailers on 1-2 second transaction finality.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tiers Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Choose Your Contribution</h2>
          <p className="text-slate-400">The more you contribute, the more influence you hold in the DAO.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {perks.map((tier) => (
            <div key={tier.id} className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-300 bg-[#0b1426] ${tier.color} ${selectedTier?.id === tier.id ? 'ring-2 ring-blue-500 scale-105 shadow-[0_0_30px_rgba(59,130,246,0.15)]' : ''}`}>
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Recommended
                </div>
              )}
              <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
              <div className="mb-6">
                <span className="text-3xl font-extrabold text-white">{tier.dashAmount}</span>
                <span className="text-slate-500 ml-2 text-sm">{tier.usdAmount}</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-grow">
                {tier.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <span className="text-sm leading-tight">{benefit}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleContribute(tier)}
                className="w-full py-3 px-4 rounded-xl font-bold transition-all bg-slate-800 text-white hover:bg-slate-700 flex items-center justify-center gap-2"
              >
                Contribute Now <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Payment Modal Simulation */}
      {showPayment && selectedTier && (
        <div className="fixed inset-0 bg-[#060d1a]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b1426] border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowPayment(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              ✕
            </button>
            
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Fund '{selectedTier.name}'</h3>
              <p className="text-slate-400">Send exactly <strong className="text-white">{selectedTier.dashAmount}</strong></p>
            </div>

            <div className="bg-white p-4 rounded-xl flex items-center justify-center mb-6 w-48 h-48 mx-auto">
              {/* Simulated QR Code */}
              <QrCode className="w-full h-full text-slate-900" />
            </div>

            <div className="bg-[#0f1b2d] border border-slate-800 rounded-lg p-3 mb-6 flex items-center justify-between">
              <code className="text-blue-400 text-sm truncate">Xm1abc2def3ghi4jkl5mno6pqr7stu8vwx</code>
              <button className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 px-2 py-1 rounded">COPY</button>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-sm text-slate-400">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                Awaiting payment on Dash Network...
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashEventDAO;