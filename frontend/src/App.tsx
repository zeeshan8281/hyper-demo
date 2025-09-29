import React, { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import InfoPanel from './components/InfoPanel'
import OrderPanel from './components/OrderPanel'
import SubscriptionPanel from './components/SubscriptionPanel'
import PositionsPanel from './components/PositionsPanel'
import OrderbookPanel from './components/OrderbookPanel'
import { getEnvConfig } from './utils/env'

// Abstract Grid Background Component
const AbstractGrid = () => (
  <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
    <svg width="100%" height="100%" viewBox="0 0 400 400">
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  </div>
)

// Typographic Art Background
const TypographicArt = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    {/* Large scattered letters */}
    <div className="absolute top-20 left-10 text-9xl font-mono opacity-5 text-white transform rotate-12">H</div>
    <div className="absolute top-40 right-20 text-8xl font-mono opacity-3 text-white transform -rotate-6">Y</div>
    <div className="absolute bottom-32 left-1/4 text-7xl font-mono opacity-4 text-white transform rotate-45">P</div>
    <div className="absolute top-1/3 right-1/3 text-6xl font-mono opacity-3 text-white transform -rotate-12">E</div>
    <div className="absolute bottom-20 right-10 text-8xl font-mono opacity-5 text-white transform rotate-90">R</div>

    {/* Scattered words */}
    <div className="absolute top-60 left-1/2 text-2xl font-mono opacity-10 text-white transform -rotate-3 tracking-widest">
      L I Q U I D
    </div>
    <div className="absolute bottom-40 left-20 text-xl font-mono opacity-8 text-white transform rotate-6 tracking-widest">
      T R A D I N G
    </div>
    <div className="absolute top-1/2 right-40 text-lg font-mono opacity-6 text-white transform -rotate-12 tracking-widest">
      D E M O
    </div>
  </div>
)

// Interactive Letters Component
const InteractiveLetters = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span
    className={`inline-block transition-all duration-300 hover:scale-110 hover:text-white hover:opacity-100 cursor-default ${className}`}
    style={{
      transitionDelay: `${Math.random() * 200}ms`,
    }}
  >
    {children}
  </span>
)

// Removed unused CircuitPattern to satisfy linter

// Data Flow Component
const DataFlow = () => (
  <div className="absolute top-1/2 left-0 transform -translate-y-1/2 opacity-5">
    <svg width="60" height="200" viewBox="0 0 60 200">
      <rect x="5" y="10" width="8" height="8" fill="white" />
      <rect x="5" y="30" width="8" height="8" fill="white" />
      <rect x="5" y="50" width="8" height="8" fill="white" />
      <rect x="5" y="70" width="8" height="8" fill="white" />
      <rect x="5" y="90" width="8" height="8" fill="white" />
      <line x1="13" y1="14" x2="25" y2="14" stroke="white" strokeWidth="1" />
      <line x1="13" y1="34" x2="25" y2="34" stroke="white" strokeWidth="1" />
      <line x1="13" y1="54" x2="25" y2="54" stroke="white" strokeWidth="1" />
      <polygon points="25,12 30,14 25,16" fill="white" />
      <polygon points="25,32 30,34 25,36" fill="white" />
      <polygon points="25,52 30,54 25,56" fill="white" />
    </svg>
  </div>
)

// Geometric Lines Component
const GeometricLines = () => (
  <div className="absolute bottom-4 left-4 opacity-8">
    <svg width="100" height="100" viewBox="0 0 100 100">
      <polygon points="10,90 50,10 90,90" fill="none" stroke="white" strokeWidth="1" />
      <polygon points="20,80 50,30 80,80" fill="none" stroke="white" strokeWidth="0.5" />
      <line x1="10" y1="90" x2="90" y2="90" stroke="white" strokeWidth="1" />
      <line x1="50" y1="10" x2="50" y2="90" stroke="white" strokeWidth="0.5" />
    </svg>
  </div>
)

function App() {
  // Check environment configuration on app start
  let envError = ''
  try {
    getEnvConfig()
  } catch (error) {
    envError = error instanceof Error ? error.message : 'Environment configuration error'
  }
  const [activeTab, setActiveTab] = useState<'info' | 'order' | 'subscription' | 'positions' | 'orderbook'>('info')

  return (
    <div className="min-h-screen bg-black text-white font-mono relative overflow-hidden">
      <AbstractGrid />
      <TypographicArt />


      {/* Main Header */}
      <div className="text-center py-8 border-b border-zinc-800 relative">
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 opacity-10">
          <svg width="200" height="40" viewBox="0 0 200 40">
            <line x1="0" y1="20" x2="200" y2="20" stroke="white" strokeWidth="1" />
            <rect x="80" y="15" width="10" height="10" fill="none" stroke="white" strokeWidth="1" />
            <rect x="110" y="15" width="10" height="10" fill="none" stroke="white" strokeWidth="1" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-wider mb-2">
          {"HYPERLIQUID_DEMO".split("").map((letter, i) => (
            <InteractiveLetters key={i} className="opacity-90">
              {letter === "_" ? "\u00A0" : letter}
            </InteractiveLetters>
          ))}
        </h1>
      </div>

      {/* Environment Error Display */}
      {envError && (
        <div className="bg-red-900 border border-red-700 px-6 py-3 mx-6 mt-4">
          <div className="text-center text-sm text-red-300">
            <AlertTriangle size={16} className="inline mr-2" />
            {"ENVIRONMENT_ERROR:".split("").map((letter, i) => (
              <InteractiveLetters key={i} className="opacity-80">
                {letter === "_" ? "\u00A0" : letter}
              </InteractiveLetters>
            ))}
            <span className="ml-2">{envError}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-center gap-0 py-6 flex-wrap">
        <button
          onClick={() => setActiveTab('info')}
          className={`px-8 py-2 text-xs tracking-wider transition-all duration-300 border-r border-zinc-700 ${
            activeTab === 'info' 
              ? 'bg-white text-black' 
              : 'bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-white'
          }`}
        >
          {"INFO_QUERIES".split("").map((letter, i) => (
            <InteractiveLetters key={i}>{letter === "_" ? "\u00A0" : letter}</InteractiveLetters>
          ))}
        </button>
        <button
          onClick={() => setActiveTab('positions')}
          className={`px-8 py-2 text-xs tracking-wider transition-all duration-300 border-r border-zinc-700 ${
            activeTab === 'positions' 
              ? 'bg-white text-black' 
              : 'bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-white'
          }`}
        >
          {"POSITIONS".split("").map((letter, i) => (
            <InteractiveLetters key={i}>{letter === "_" ? "\u00A0" : letter}</InteractiveLetters>
          ))}
        </button>
        <button
          onClick={() => setActiveTab('orderbook')}
          className={`px-8 py-2 text-xs tracking-wider transition-all duration-300 border-r border-zinc-700 ${
            activeTab === 'orderbook' 
              ? 'bg-white text-black' 
              : 'bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-white'
          }`}
        >
          {"ORDERBOOK".split("").map((letter, i) => (
            <InteractiveLetters key={i}>{letter === "_" ? "\u00A0" : letter}</InteractiveLetters>
          ))}
        </button>
        <button
          onClick={() => setActiveTab('order')}
          className={`px-8 py-2 text-xs tracking-wider transition-all duration-300 border-r border-zinc-700 ${
            activeTab === 'order' 
              ? 'bg-white text-black' 
              : 'bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-white'
          }`}
        >
          {"PLACE_ORDER".split("").map((letter, i) => (
            <InteractiveLetters key={i}>{letter === "_" ? "\u00A0" : letter}</InteractiveLetters>
          ))}
        </button>
        <button
          onClick={() => setActiveTab('subscription')}
          className={`px-8 py-2 text-xs tracking-wider transition-all duration-300 ${
            activeTab === 'subscription' 
              ? 'bg-white text-black' 
              : 'bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-white'
          }`}
        >
          {"LIVE_DATA".split("").map((letter, i) => (
            <InteractiveLetters key={i}>{letter === "_" ? "\u00A0" : letter}</InteractiveLetters>
          ))}
        </button>
      </div>

      <DataFlow />

      {/* Content Area */}
      <div className="max-w-4xl mx-auto px-6 pb-12 relative">
        <div className="bg-zinc-900 border border-zinc-700 relative">
          <div className="absolute top-2 left-2 opacity-20">
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path d="M0,0 L20,0 L20,20" fill="none" stroke="white" strokeWidth="1" />
            </svg>
          </div>
          <div className="absolute top-2 right-2 opacity-20">
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path d="M20,0 L0,0 L0,20" fill="none" stroke="white" strokeWidth="1" />
            </svg>
          </div>
          
          <div className="p-8">
            {activeTab === 'info' && <InfoPanel />}
            {activeTab === 'positions' && <PositionsPanel />}
            {activeTab === 'orderbook' && <OrderbookPanel />}
            {activeTab === 'order' && <OrderPanel />}
            {activeTab === 'subscription' && <SubscriptionPanel />}
          </div>
        </div>

        <GeometricLines />
      </div>

      {/* Global Footer */}
      <footer className="w-full border-t border-zinc-800 py-6 mt-8 text-center text-xs text-zinc-400">
        <span className="mr-2">Want to plug this into your own project?</span>
        <a
          className="underline hover:text-white"
          href="https://github.com/zeeshan8281/hyper-demo"
          target="_blank"
          rel="noreferrer noopener"
        >
          Fork this here
        </a>
        <span className="mx-2">•</span>
        <a
          className="underline hover:text-white"
          href="https://github.com/zeeshan8281/hyper-demo/fork"
          target="_blank"
          rel="noreferrer noopener"
        >
          or clone the repo
        </a>
      </footer>
    </div>
  )
}

export default App
