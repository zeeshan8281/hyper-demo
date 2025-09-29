import React, { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { getEnvConfig } from '../utils/env'
import JsonView from './JsonView'

// Use global HyperliquidSDK from browser.global.js
declare global {
  interface Window {
    HyperliquidSDK: any; // This is now the actual constructor from HyperliquidSDK.Hyperliquid
  }
}

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

const InfoPanel: React.FC = () => {
  const envConfig = getEnvConfig()
  const [userAddress, setUserAddress] = useState(envConfig.defaultUserAddress)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string>('')

  const fetchOpenOrders = async () => {
    if (typeof window.HyperliquidSDK === 'undefined') {
      setError('HyperliquidSDK is not loaded. Please refresh the page.')
      return
    }

    setLoading(true)
    setError('')
    setResult('')

    try {
      // Create Hyperliquid SDK instance for testnet
      console.log('Creating SDK with config:', { 
        enableWs: false, 
        testnet: envConfig.isTestnet 
      })
      
      const sdk = new window.HyperliquidSDK({ 
        enableWs: false, // We only need HTTP for info queries
        testnet: envConfig.isTestnet 
      })
      
      console.log('SDK created successfully:', sdk)
      console.log('SDK info object:', sdk.info)
      
      // Connect the SDK first
      await sdk.connect()
      console.log('SDK connected successfully')
      
      console.log('Fetching open orders for:', userAddress)
      const openOrders = await sdk.info.getUserOpenOrders(userAddress)
      console.log('Open orders result:', openOrders)
      
      setResult(openOrders ?? {})
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(`Failed to fetch open orders: ${errorMsg}`)
      console.error('Info query failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      {/* Decorative Elements */}
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 opacity-8">
        <svg width="60" height="60" viewBox="0 0 60 60">
          <polygon points="30,5 45,15 45,35 30,45 15,35 15,15" fill="none" stroke="white" strokeWidth="1" />
          <polygon points="30,15 37,20 37,30 30,35 23,30 23,20" fill="none" stroke="white" strokeWidth="0.5" />
          <circle cx="30" cy="25" r="2" fill="white" />
        </svg>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-lg font-bold tracking-wider mb-2">
          {"INFO_QUERIES".split("").map((letter, i) => (
            <InteractiveLetters key={i}>{letter === "_" ? "\u00A0" : letter}</InteractiveLetters>
          ))}
        </h2>
        <p className="text-zinc-400 text-sm">
          {"FETCH_ACCOUNT_INFORMATION_FROM_HYPERLIQUID_TESTNET".split("").map((letter, i) => (
            <InteractiveLetters key={i} className="opacity-60">
              {letter === "_" ? "\u00A0" : letter}
            </InteractiveLetters>
          ))}
        </p>
      </div>

      <div className="mb-8">
        <label className="block text-xs text-zinc-400 mb-2 tracking-wider">
          {"USER_ADDRESS:".split("").map((letter, i) => (
            <InteractiveLetters key={i} className="opacity-70">
              {letter === "_" ? "\u00A0" : letter}
            </InteractiveLetters>
          ))}
        </label>
        <input
          type="text"
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
          className="bg-black border-zinc-600 font-mono text-xs"
          placeholder="0x0000000000000000000000000000000000000000"
        />
      </div>

      <div className="text-center mb-8">
        <button 
          onClick={fetchOpenOrders} 
          disabled={loading || !userAddress}
          className="bg-white text-black hover:bg-zinc-200 px-12 py-3 text-xs tracking-wider font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            "LOADING...".split("").map((letter, i) => (
              <InteractiveLetters key={i}>{letter}</InteractiveLetters>
            ))
          ) : (
            "FETCH_OPEN_ORDERS".split("").map((letter, i) => (
              <InteractiveLetters key={i}>{letter === "_" ? "\u00A0" : letter}</InteractiveLetters>
            ))
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 p-4 mb-8">
          <div className="text-xs text-red-300">
            <AlertCircle size={16} className="inline mr-2" />
            {"ERROR:".split("").map((letter, i) => (
              <InteractiveLetters key={i} className="opacity-80">
                {letter}
              </InteractiveLetters>
            ))}
            <span className="ml-2">{error}</span>
          </div>
        </div>
      )}

      {result && (
        <div className="mb-8">
          <h3 className="text-sm font-bold tracking-wider mb-4">
            {"RESULT:".split("").map((letter, i) => (
              <InteractiveLetters key={i}>{letter}</InteractiveLetters>
            ))}
          </h3>
          <JsonView data={result} />
        </div>
      )}

      <div className="bg-zinc-800 border border-zinc-600 p-4">
        <div className="text-xs text-zinc-400 text-center">
          {"TESTNET_ADDRESSES_ONLY | VERIFY_NETWORK_CONFIGURATION".split("").map((letter, i) => (
            <InteractiveLetters key={i} className="opacity-60">
              {letter === "_" ? "\u00A0" : letter}
            </InteractiveLetters>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InfoPanel
