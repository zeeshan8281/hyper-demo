import React, { useState, useEffect, useRef } from 'react'
import { WifiOff, Play, Square, RotateCcw } from 'lucide-react'
import { getEnvConfig } from '../utils/env'

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

const SubscriptionPanel: React.FC = () => {
  const envConfig = getEnvConfig()
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [events, setEvents] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const pageSize = 10
  const [error, setError] = useState<string>('')
  // 5-min polling snapshot state
  const [isPolling, setIsPolling] = useState<boolean>(false)
  const [snapshot, setSnapshot] = useState<Array<{ coin: string; mid: number }>>([])
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const pollingRef = useRef<number | null>(null)
  
  const sdkRef = useRef<any | null>(null)

  const addEvent = (event: string) => {
    // Append new event, cap total stored events to prevent memory/DOM blowups
    setEvents(prev => {
      const next = [...prev, `${new Date().toLocaleTimeString()}: ${event}`]
      return next.length > 500 ? next.slice(-500) : next
    })
  }

  const connect = async () => {
    if (isConnected || isConnecting) return

    setIsConnecting(true)
    setError('')
    setEvents([])
    setCurrentPage(1)

    try {
      // Create Hyperliquid SDK instance for testnet with WebSocket enabled
      const sdk = new window.HyperliquidSDK({
        enableWs: true, // Enable WebSocket for live data
        testnet: envConfig.isTestnet
      })

      sdkRef.current = sdk

      addEvent('Connecting to Hyperliquid testnet WebSocket...')
      
      // Connect to WebSocket
      await sdk.connect()
      
      // Subscribe to all market mid updates
      sdk.subscriptions.subscribeToAllMids((data: any) => {
        // Use compact JSON to reduce payload size on the UI
        addEvent(`Market Update: ${JSON.stringify(data)}`)
      })

      setIsConnected(true)
      addEvent('✅ Connected! Receiving live market data...')
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(`Connection failed: ${errorMsg}`)
      addEvent(`❌ Connection failed: ${errorMsg}`)
      console.error('WebSocket connection failed:', err)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = async () => {
    if (!isConnected) return

    try {
      addEvent('Disconnecting...')
      
      if (sdkRef.current) {
        await sdkRef.current.disconnect()
        sdkRef.current = null
      }
      
      setIsConnected(false)
      addEvent('✅ Disconnected')
    } catch (err) {
      console.error('Disconnect error:', err)
      addEvent('❌ Error during disconnect')
    }
  }

  const clearEvents = () => {
    setEvents([])
    setCurrentPage(1)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isConnected) {
        disconnect()
      }
      // stop polling timer
      if (pollingRef.current) {
        window.clearInterval(pollingRef.current)
        pollingRef.current = null
      }
    }
  }, [])

  // Keep currentPage within valid bounds when events length changes
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(events.length / pageSize))
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [events])

  const totalPages = Math.max(1, Math.ceil(events.length / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const visibleEvents = events.slice(startIndex, endIndex)
  const truncate = (text: string, max = 300) => (text.length > max ? text.slice(0, max) + ' …' : text)

  // Polling logic: fetch all mids now and every 5 minutes
  const fetchSnapshot = async () => {
    try {
      const sdk = new window.HyperliquidSDK({ enableWs: false, testnet: envConfig.isTestnet })
      await sdk.connect()
      if (!sdk.info || typeof sdk.info.getAllMids !== 'function') {
        throw new Error('getAllMids not available on sdk.info')
      }
      const mids = await sdk.info.getAllMids()
      // normalize: mids may be an object map or array of {coin, mid}
      let rows: Array<{ coin: string; mid: number }> = []
      if (Array.isArray(mids)) {
        rows = mids.map((m: any) => ({ coin: String(m.coin ?? m.symbol ?? ''), mid: Number(m.mid ?? m.px ?? m.price ?? 0) }))
      } else if (mids && typeof mids === 'object') {
        rows = Object.entries(mids).map(([coin, mid]: any) => ({ coin, mid: Number(mid) }))
      }
      // Keep perp markets only to avoid @xxx and placeholder assets (often mid=1)
      rows = rows
        .filter(r => r.coin && /-PERP$/i.test(r.coin))
        .sort((a, b) => a.coin.localeCompare(b.coin))
      setSnapshot(rows)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (e) {
      console.error('Snapshot fetch failed', e)
      setError(e instanceof Error ? e.message : 'Snapshot fetch failed')
    }
  }

  const startPolling = async () => {
    if (isPolling) return
    setError('')
    await fetchSnapshot()
    const id = window.setInterval(fetchSnapshot, 5 * 60 * 1000)
    pollingRef.current = id
    setIsPolling(true)
  }

  const stopPolling = () => {
    if (pollingRef.current) {
      window.clearInterval(pollingRef.current)
      pollingRef.current = null
    }
    setIsPolling(false)
  }

  return (
    <div className="relative">
      {/* Decorative Elements */}
      <div className="absolute bottom-4 right-4 opacity-10">
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="30" fill="none" stroke="white" strokeWidth="1" />
          <circle cx="40" cy="40" r="20" fill="none" stroke="white" strokeWidth="0.5" />
          <circle cx="40" cy="40" r="10" fill="none" stroke="white" strokeWidth="0.5" />
          <line x1="40" y1="10" x2="40" y2="70" stroke="white" strokeWidth="0.5" />
          <line x1="10" y1="40" x2="70" y2="40" stroke="white" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-lg font-bold tracking-wider mb-2">
          {"LIVE_MARKET_DATA".split("").map((letter, i) => (
            <InteractiveLetters key={i}>{letter === "_" ? "\u00A0" : letter}</InteractiveLetters>
          ))}
        </h2>
        <p className="text-zinc-400 text-sm">
          {"REAL_TIME_MARKET_UPDATES_FROM_HYPERLIQUID_TESTNET".split("").map((letter, i) => (
            <InteractiveLetters key={i} className="opacity-60">
              {letter === "_" ? "\u00A0" : letter}
            </InteractiveLetters>
          ))}
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={connect}
          disabled={isConnected || isConnecting}
          className={`px-8 py-2 text-xs tracking-wider transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
            isConnected 
              ? 'bg-green-900 hover:bg-green-800 text-green-100' 
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
          }`}
        >
          <Play size={16} className="inline mr-2" />
          {isConnecting ? (
            "CONNECTING...".split("").map((letter, i) => (
              <InteractiveLetters key={i}>{letter}</InteractiveLetters>
            ))
          ) : isConnected ? (
            "CONNECTED".split("").map((letter, i) => (
              <InteractiveLetters key={i}>{letter}</InteractiveLetters>
            ))
          ) : (
            "CONNECT".split("").map((letter, i) => (
              <InteractiveLetters key={i}>{letter}</InteractiveLetters>
            ))
          )}
        </button>
        
        <button
          onClick={disconnect}
          disabled={!isConnected}
          className={`px-8 py-2 text-xs tracking-wider transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
            !isConnected 
              ? 'bg-red-900 hover:bg-red-800 text-red-100' 
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
          }`}
        >
          <Square size={16} className="inline mr-2" />
          {"DISCONNECT".split("").map((letter, i) => (
            <InteractiveLetters key={i}>{letter}</InteractiveLetters>
          ))}
        </button>
        
        <button 
          onClick={clearEvents}
          className="border-zinc-600 px-8 py-2 text-xs tracking-wider bg-transparent transition-all duration-300 hover:scale-105"
        >
          <RotateCcw size={16} className="inline mr-2" />
          {"CLEAR_LOG".split("").map((letter, i) => (
            <InteractiveLetters key={i}>{letter === "_" ? "\u00A0" : letter}</InteractiveLetters>
          ))}
        </button>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 p-4 mb-8">
          <div className="text-xs text-red-300">
            <WifiOff size={16} className="inline mr-2" />
            {"ERROR:".split("").map((letter, i) => (
              <InteractiveLetters key={i} className="opacity-80">
                {letter}
              </InteractiveLetters>
            ))}
            <span className="ml-2">{error}</span>
          </div>
        </div>
      )}

      <div className="bg-zinc-800 border border-zinc-600 p-4 mb-8">
        <div className="text-xs">
          <span className="text-zinc-500">[STATUS]</span>{" "}
          <span className={isConnected ? "text-green-400" : "text-red-400"}>
            {(isConnected ? "CONNECTED" : "DISCONNECTED").split("").map((letter, i) => (
              <InteractiveLetters key={i}>{letter}</InteractiveLetters>
            ))}
          </span>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-bold tracking-wider mb-4">
          {"LIVE_EVENTS:".split("").map((letter, i) => (
            <InteractiveLetters key={i}>{letter === "_" ? "\u00A0" : letter}</InteractiveLetters>
          ))}
        </h3>
        <div className="bg-black border border-zinc-700 p-4 min-h-32">
          {events.length === 0 ? (
            <div className="text-xs text-zinc-500 font-mono opacity-70">
              NO EVENTS YET. CLICK CONNECT TO START RECEIVING LIVE DATA.
            </div>
          ) : (
            <div className="space-y-2">
              {visibleEvents.map((line, idx) => (
                <pre key={idx} className="text-xs text-zinc-300 font-mono whitespace-pre-wrap break-words">
                  {truncate(line)}
                </pre>
              ))}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
          <div>
            Page {currentPage} of {totalPages} • Showing {visibleEvents.length} of {events.length}
          </div>
          <div className="space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 border border-zinc-600 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-800'}`}
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border border-zinc-600 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-800'}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* 5-minute Snapshot Controls */}
      <div className="bg-zinc-800 border border-zinc-600 p-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="text-xs text-zinc-300">
            Snapshot of all mids via HTTP every 5 minutes
          </div>
          <div className="space-x-2">
            <button
              onClick={startPolling}
              disabled={isPolling}
              className={`px-6 py-2 text-xs ${isPolling ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-700'} border border-zinc-600`}
            >
              Start Snapshot
            </button>
            <button
              onClick={stopPolling}
              disabled={!isPolling}
              className={`px-6 py-2 text-xs ${!isPolling ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-700'} border border-zinc-600`}
            >
              Stop
            </button>
            <button
              onClick={fetchSnapshot}
              className="px-6 py-2 text-xs hover:bg-zinc-700 border border-zinc-600"
            >
              Refresh Now
            </button>
          </div>
        </div>
        {lastUpdated && (
          <div className="text-[10px] text-zinc-500 mt-2">Last updated: {lastUpdated}</div>
        )}
      </div>

      {/* Snapshot Table */}
      {snapshot.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-bold tracking-wider mb-3">CURRENT MIDS (HTTP SNAPSHOT)</h3>
          <div className="overflow-auto max-h-[60vh]">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-zinc-900 text-zinc-400">
                <tr>
                  <th className="text-left px-2 py-2">Coin</th>
                  <th className="text-left px-2 py-2">Mid</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.map((r, i) => (
                  <tr key={`${r.coin}-${i}`} className="border-t border-zinc-800">
                    <td className="px-2 py-2 text-zinc-200">{r.coin}</td>
                    <td className="px-2 py-2 text-green-300">{r.mid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-zinc-800 border border-zinc-600 p-4">
        <div className="text-xs text-zinc-400 text-center">
          {"WEBSOCKET_CONNECTION_TO_HYPERLIQUID_TESTNET | AUTO_DISPLAY_30S".split("").map((letter, i) => (
            <InteractiveLetters key={i} className="opacity-60">
              {letter === "_" ? "\u00A0" : letter}
            </InteractiveLetters>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SubscriptionPanel
