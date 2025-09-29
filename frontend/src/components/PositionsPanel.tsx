import React, { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { getEnvConfig } from '../utils/env'
import JsonView from './JsonView'

// Use global HyperliquidSDK from browser.global.js
declare global {
  interface Window {
    HyperliquidSDK: any;
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

const PositionsPanel: React.FC = () => {
  const envConfig = getEnvConfig()
  const [userAddress, setUserAddress] = useState(envConfig.defaultUserAddress)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const [cards, setCards] = useState<Array<{
    coin: string
    size: number | string
    entryPx?: number | string | null
    positionValue?: number | string | null
    unrealizedPnl?: number | string | null
    roe?: number | string | null
    liqPx?: number | string | null
    marginUsed?: number | string | null
    maxLeverage?: number | string | null
    type?: string
  }>>([])

  const buildCards = (payload: any) => {
    const next: Array<any> = []

    // Per README structure: payload.assetPositions: [{ type, position: {...}, leverage: {...} }]
    const assetPositions = payload?.assetPositions || payload?.positions || []
    if (Array.isArray(assetPositions)) {
      assetPositions.forEach((p: any) => {
        const pos = p?.position || p
        if (!pos) return
        next.push({
          coin: String(pos.coin ?? pos.symbol ?? 'UNKNOWN'),
          size: pos.szi ?? pos.size ?? 0,
          entryPx: pos.entryPx ?? pos.entry_price ?? null,
          positionValue: pos.positionValue ?? pos.position_value ?? null,
          unrealizedPnl: pos.unrealizedPnl ?? pos.uPnl ?? null,
          roe: pos.returnOnEquity ?? pos.roe ?? null,
          liqPx: pos.liquidationPx ?? pos.liqPx ?? null,
          marginUsed: pos.marginUsed ?? null,
          maxLeverage: (p?.leverage?.maxLeverage ?? pos.maxLeverage ?? null),
          type: p?.type ?? pos.type ?? undefined,
        })
      })
    }

    // Some SDKs return flat pos map under `positions` keyed by coin
    if (!next.length && result && typeof result === 'object') {
      const maybeMap = (payload?.positions || {})
      if (maybeMap && typeof maybeMap === 'object') {
        Object.entries(maybeMap).forEach(([coin, pos]: any) => {
          if (!pos) return
          next.push({
            coin,
            size: pos.szi ?? pos.size ?? 0,
            entryPx: pos.entryPx ?? null,
            positionValue: pos.positionValue ?? null,
            unrealizedPnl: pos.unrealizedPnl ?? null,
            roe: pos.returnOnEquity ?? null,
            liqPx: pos.liquidationPx ?? null,
            marginUsed: pos.marginUsed ?? null,
            maxLeverage: pos.maxLeverage ?? null,
          })
        })
      }
    }

    setCards(next)
  }

  const fetchPositions = async () => {
    if (typeof window.HyperliquidSDK === 'undefined') {
      setError('HyperliquidSDK is not loaded. Please refresh the page.')
      return
    }

    setLoading(true)
    setError('')
    setResult('')

    try {
      const sdk = new window.HyperliquidSDK({ enableWs: false, testnet: envConfig.isTestnet })
      await sdk.connect()

      let positions: any
      if (sdk.info?.perpetuals && typeof sdk.info.perpetuals.getClearinghouseState === 'function') {
       
        positions = await sdk.info.perpetuals.getClearinghouseState(userAddress)
      } else if (sdk.info && typeof sdk.info.getUserPositions === 'function') {
        positions = await sdk.info.getUserPositions(userAddress)
      } else if (sdk.info && typeof sdk.info.userState === 'function') {
        positions = await sdk.info.userState(userAddress)
      } else if (sdk.info && typeof sdk.info.getUserState === 'function') {
        positions = await sdk.info.getUserState(userAddress)
      } else {
        throw new Error('Positions endpoint not found (tried perpetuals.getClearinghouseState, getUserPositions, userState, getUserState)')
      }

      const payload = positions ?? {}
      setResult(payload)
      buildCards(payload)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(`Failed to fetch positions: ${errorMsg}`)
      console.error('Positions query failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      <div className="text-center mb-8">
        <h2 className="text-lg font-bold tracking-wider mb-2">
          {"OPEN_POSITIONS".split("").map((letter, i) => (
            <InteractiveLetters key={i}>{letter === "_" ? "\u00A0" : letter}</InteractiveLetters>
          ))}
        </h2>
        <p className="text-zinc-400 text-sm">
          {"FETCH_USER_POSITIONS_FROM_HYPERLIQUID_TESTNET".split("").map((letter, i) => (
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
          onClick={fetchPositions} 
          disabled={loading || !userAddress}
          className="bg-white text-black hover:bg-zinc-200 px-12 py-3 text-xs tracking-wider font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            "LOADING...".split("").map((letter, i) => (
              <InteractiveLetters key={i}>{letter}</InteractiveLetters>
            ))
          ) : (
            "FETCH_POSITIONS".split("").map((letter, i) => (
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
          {/* Friendly position cards */}
          {cards.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {cards.map((c, i) => (
                <div key={i} className="border border-zinc-700 p-4 bg-black/40">
                  <div className="text-sm font-bold tracking-wider mb-2">{c.coin}</div>
                  <div className="text-xs text-zinc-400 mb-2">Type: {c.type ?? '—'}</div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                    <div className="text-zinc-500">Size</div><div className="text-zinc-200">{c.size}</div>
                    <div className="text-zinc-500">Entry Px</div><div className="text-zinc-200">{c.entryPx ?? '—'}</div>
                    <div className="text-zinc-500">Pos Value</div><div className="text-zinc-200">{c.positionValue ?? '—'}</div>
                    <div className="text-zinc-500">uPnL</div><div className={`text-zinc-200 ${Number(c.unrealizedPnl) < 0 ? 'text-red-300' : 'text-green-300'}`}>{c.unrealizedPnl ?? '—'}</div>
                    <div className="text-zinc-500">ROE</div><div className="text-zinc-200">{c.roe ?? '—'}</div>
                    <div className="text-zinc-500">Liq Px</div><div className="text-zinc-200">{c.liqPx ?? '—'}</div>
                    <div className="text-zinc-500">Margin Used</div><div className="text-zinc-200">{c.marginUsed ?? '—'}</div>
                    <div className="text-zinc-500">Max Lev</div><div className="text-zinc-200">{c.maxLeverage ?? '—'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Raw payload for debugging */}
          <JsonView data={result} />
        </div>
      )}
    </div>
  )
}

export default PositionsPanel


