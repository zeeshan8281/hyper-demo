import React, { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { getEnvConfig } from '../utils/env'
import JsonView from './JsonView'

declare global {
  interface Window {
    HyperliquidSDK: any;
  }
}

const InteractiveLetters = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span
    className={`inline-block transition-all duration-300 hover:scale-110 hover:text-white hover:opacity-100 cursor-default ${className}`}
    style={{ transitionDelay: `${Math.random() * 200}ms` }}
  >
    {children}
  </span>
)

const OrderbookPanel: React.FC = () => {
  const envConfig = getEnvConfig()
  const [marketId, setMarketId] = useState(envConfig.defaultMarketId)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)

  // Reuse dynamic mapping logic like OrderPanel does, but inline here for simplicity
  const resolveCoinFromMarketId = async (id: string): Promise<string | null> => {
    try {
      const apiUrl = envConfig.apiBaseUrl || 'https://api.hyperliquid-testnet.xyz/info'
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'meta' })
      })
      const meta = await res.json()
      const universe: any[] = meta?.universe || meta?.perpMeta || []
      if (!Array.isArray(universe) || universe.length === 0) return null
      const name = universe[Number(id)]?.name || universe[Number(id)]?.symbol
      if (!name) return null
      return /-PERP$/i.test(String(name)) ? String(name) : `${name}-PERP`
    } catch (e) {
      console.error('Failed to load market meta', e)
      return null
    }
  }

  const fetchOrderbook = async () => {
    if (typeof window.HyperliquidSDK === 'undefined') {
      setError('HyperliquidSDK is not loaded. Please refresh the page.')
      return
    }
    setLoading(true)
    setError('')
    setResult('')
    try {
      const coin = await resolveCoinFromMarketId(marketId)
      if (!coin) {
        setError(`Unknown market id: ${marketId}`)
        return
      }

      const sdk = new window.HyperliquidSDK({ enableWs: false, testnet: envConfig.isTestnet })
      await sdk.connect()
      
      const ob = typeof sdk.info.getL2Book === 'function' ? await sdk.info.getL2Book(coin) : await sdk.info.getOrderbook(coin)
      setResult(ob ?? {})
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(`Failed to fetch orderbook: ${errorMsg}`)
      console.error('Orderbook query failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      <div className="text-center mb-8">
        <h2 className="text-lg font-bold tracking-wider mb-2">
          {"ORDERBOOK".split("").map((letter, i) => (
            <InteractiveLetters key={i}>{letter === "_" ? "\u00A0" : letter}</InteractiveLetters>
          ))}
        </h2>
        <p className="text-zinc-400 text-sm">
          {"FETCH_LIMIT_ORDERBOOK_FOR_SELECTED_MARKET".split("").map((letter, i) => (
            <InteractiveLetters key={i} className="opacity-60">
              {letter === "_" ? "\u00A0" : letter}
            </InteractiveLetters>
          ))}
        </p>
      </div>

      <div className="mb-8 max-w-xs">
        <label className="block text-xs text-zinc-400 mb-2 tracking-wider">
          {"MARKET_ID".split("").map((letter, i) => (
            <InteractiveLetters key={i} className="opacity-70">
              {letter === "_" ? "\u00A0" : letter}
            </InteractiveLetters>
          ))}
        </label>
        <input
          type="number"
          value={marketId}
          onChange={(e) => setMarketId(e.target.value)}
          className="bg-black border-zinc-600 font-mono text-xs"
        />
      </div>

      <div className="text-center mb-8">
        <button 
          onClick={fetchOrderbook} 
          disabled={loading || !marketId}
          className="bg-white text-black hover:bg-zinc-200 px-12 py-3 text-xs tracking-wider font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            "LOADING...".split("").map((letter, i) => (
              <InteractiveLetters key={i}>{letter}</InteractiveLetters>
            ))
          ) : (
            "FETCH_ORDERBOOK".split("").map((letter, i) => (
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
          {/* Pretty tables for top-of-book if structure matches */}
          {Array.isArray(result?.levels) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-xs text-zinc-400 mb-2">BIDS (Top 15)</h4>
                <table className="w-full text-xs">
                  <thead className="text-zinc-400">
                    <tr>
                      <th className="text-left">Price</th>
                      <th className="text-left">Size</th>
                      <th className="text-left">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(result.levels[0] || []).slice(0, 15).map((l: any, i: number) => (
                      <tr key={i} className="text-green-300">
                        <td>{l.px}</td>
                        <td>{l.sz}</td>
                        <td>{l.n}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <h4 className="text-xs text-zinc-400 mb-2">ASKS (Top 15)</h4>
                <table className="w-full text-xs">
                  <thead className="text-zinc-400">
                    <tr>
                      <th className="text-left">Price</th>
                      <th className="text-left">Size</th>
                      <th className="text-left">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(result.levels[1] || []).slice(0, 15).map((l: any, i: number) => (
                      <tr key={i} className="text-red-300">
                        <td>{l.px}</td>
                        <td>{l.sz}</td>
                        <td>{l.n}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {/* Collapsible JSON fallback */}
          <JsonView data={result} />
        </div>
      )}
    </div>
  )
}

export default OrderbookPanel


