import React, { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
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

const OrderPanel: React.FC = () => {
  const envConfig = getEnvConfig()
  const [marketId, setMarketId] = useState(envConfig.defaultMarketId)
  const [price, setPrice] = useState(envConfig.defaultPrice)
  const [size, setSize] = useState(envConfig.defaultSize)
  const [isBuy, setIsBuy] = useState(true)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [dryRun, setDryRun] = useState(true)

  // Cache for dynamic market metadata (marketId -> coin symbol)
  const marketCacheRef = React.useRef<{ [id: string]: string } | null>(null)

  const resolveCoinFromMarketId = async (id: string): Promise<string | null> => {
    // Use cached mapping if available
    if (marketCacheRef.current && marketCacheRef.current[id]) {
      return marketCacheRef.current[id]
    }

    try {
      // Fetch meta from testnet API to build mapping
      const apiUrl = envConfig.apiBaseUrl || 'https://api.hyperliquid-testnet.xyz/info'
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'meta' })
      })
      const meta = await res.json()

      // Universe is typically an array of coin metadata; index is coin id
      const universe: any[] = meta?.universe || meta?.perpMeta || []
      if (!Array.isArray(universe) || universe.length === 0) {
        return null
      }

      // Build cache: assume perp symbols are `${name}-PERP`
      const built: { [id: string]: string } = {}
      universe.forEach((coin: any, idx: number) => {
        const name = coin?.name || coin?.symbol || coin?.coin || `${idx}`
        // Some metas already include '-PERP'; normalize to one format
        const symbol = /-PERP$/i.test(String(name)) ? String(name) : `${name}-PERP`
        built[String(idx)] = symbol
      })
      marketCacheRef.current = built

      return built[id] || null
    } catch (e) {
      console.error('Failed to load market meta', e)
      return null
    }
  }

  const placeOrder = async () => {
    setLoading(true)
    setError('')
    setResult('')

    try {
      // Create Hyperliquid SDK instance for testnet
      const sdk = new window.HyperliquidSDK({
        enableWs: false, // We only need HTTP for orders
        testnet: envConfig.isTestnet,
        // Use private key exclusively from environment config
        privateKey: envConfig.defaultPrivateKey || undefined
      })
      
      await sdk.connect()

      // Resolve coin symbol dynamically from API meta
      const coinSymbol = await resolveCoinFromMarketId(marketId)
      if (!coinSymbol) {
        setError(`Unknown market id: ${marketId}. Please enter a supported testnet id (e.g., 135 for SOL-PERP).`)
        return
      }

      // Build order payload using nomeida/hyperliquid SDK format
      const orderPayload = {
        coin: coinSymbol,
        is_buy: isBuy,
        sz: parseFloat(size),
        limit_px: parseFloat(price),
        order_type: { limit: { tif: 'Gtc' } },
        reduce_only: false,
      }

      console.log('Prepared order payload:', orderPayload)
      setResult(`Order Payload:\n${JSON.stringify(orderPayload, null, 2)}\n\n`)

      if (!envConfig.defaultPrivateKey) {
        setResult(prev => prev + 'Dry-run: No private key provided, not signing/sending.')
        return
      }

      if (dryRun) {
        setResult(prev => prev + 'Dry-run mode: Order constructed but not broadcast. Uncheck "Dry Run" to actually send.')
        return
      }

      // Check if SDK has exchange functionality (requires private key)
      if (!sdk.exchange || typeof sdk.exchange.placeOrder !== 'function') {
        setError('Exchange functionality not available. Please provide a valid private key.')
        return
      }

      console.log('Sending order to testnet...')
      const res = await sdk.exchange.placeOrder(orderPayload)
      
      setResult(prev => prev + `Order Response:\n${JSON.stringify(res, null, 2)}`)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(`Failed to place order: ${errorMsg}`)
      console.error('Order placement failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      <div className="text-center mb-8">
        <h2 className="text-lg font-bold tracking-wider mb-2">
          {"PLACE_ORDER".split("").map((letter, i) => (
            <InteractiveLetters key={i}>{letter === "_" ? "\u00A0" : letter}</InteractiveLetters>
          ))}
        </h2>
        <p className="text-zinc-400 text-sm">
          {"EXECUTE_TEST_ORDER_ON_HYPERLIQUID_TESTNET".split("").map((letter, i) => (
            <InteractiveLetters key={i} className="opacity-60">
              {letter === "_" ? "\u00A0" : letter}
            </InteractiveLetters>
          ))}
        </p>
      </div>

      {/* Safety Warning */}
      <div className="bg-zinc-800 border border-zinc-600 p-4 mb-8">
        <div className="text-xs text-zinc-300">
          <span className="text-zinc-500">[SAFETY]</span>
          <span className="ml-2">
            {"TESTNET_ONLY_ENVIRONMENT".split("").map((letter, i) => (
              <InteractiveLetters key={i} className="opacity-70">
                {letter === "_" ? "\u00A0" : letter}
              </InteractiveLetters>
            ))}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Private key input removed: orders use env-configured key only */}
        <div>
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
        <div>
          <label className="block text-xs text-zinc-400 mb-2 tracking-wider">
            {"PRICE".split("").map((letter, i) => (
              <InteractiveLetters key={i} className="opacity-70">
                {letter}
              </InteractiveLetters>
            ))}
          </label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="bg-black border-zinc-600 font-mono text-xs"
          />
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-xs text-zinc-400 mb-2 tracking-wider">
          {"SIZE".split("").map((letter, i) => (
            <InteractiveLetters key={i} className="opacity-70">
              {letter}
            </InteractiveLetters>
          ))}
        </label>
        <input
          type="text"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="bg-black border-zinc-600 font-mono text-xs max-w-xs"
        />
      </div>

      {/* Field Guide */}
      <div className="bg-zinc-800 border border-zinc-600 p-4 mb-8">
        <h3 className="text-sm font-bold tracking-wider mb-3">FIELD GUIDE</h3>
        <ul className="text-xs text-zinc-300 space-y-2 list-disc pl-5">
          <li>
            <span className="text-zinc-400">Market ID</span>: numeric market identifier (e.g., 135 = HYPE-PERP on testnet).
          </li>
          <li>
            <span className="text-zinc-400">Price</span>: limit price in USDC. Must be reasonably close to reference, or order will be rejected.
          </li>
          <li>
            <span className="text-zinc-400">Size</span>: order quantity in contract units (per the selected market).
          </li>
          <li>
            <span className="text-zinc-400">Buy Order</span>: checked = buy, unchecked = sell.
          </li>
          <li>
            <span className="text-zinc-400">Dry Run</span>: when enabled, builds payload but does not broadcast.
          </li>
          <li>
            <span className="text-zinc-400">Signing Key</span>: pulled from environment only (`VITE_WALLET_PRIVATE_KEY`). No key in env → dry-run only.
          </li>
        </ul>
      </div>

      <div className="flex gap-8 mb-8">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="buy-order"
            checked={isBuy}
            onChange={(e) => setIsBuy(e.target.checked)}
            className="border-zinc-600"
          />
          <label htmlFor="buy-order" className="text-xs tracking-wider">
            {"BUY_ORDER".split("").map((letter, i) => (
              <InteractiveLetters key={i} className="opacity-80">
                {letter === "_" ? "\u00A0" : letter}
              </InteractiveLetters>
            ))}
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="dry-run"
            checked={dryRun}
            onChange={(e) => setDryRun(e.target.checked)}
            className="border-zinc-600"
          />
          <label htmlFor="dry-run" className="text-xs tracking-wider">
            {"DRY_RUN_[SAFE]".split("").map((letter, i) => (
              <InteractiveLetters key={i} className="opacity-80">
                {letter === "_" ? "\u00A0" : letter}
              </InteractiveLetters>
            ))}
          </label>
        </div>
      </div>

      <div className="text-center mb-8">
        <button 
          onClick={placeOrder} 
          disabled={loading}
          className="bg-white text-black hover:bg-zinc-200 px-12 py-3 text-xs tracking-wider font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            "PROCESSING...".split("").map((letter, i) => (
              <InteractiveLetters key={i}>{letter}</InteractiveLetters>
            ))
          ) : (
            "EXECUTE_ORDER".split("").map((letter, i) => (
              <InteractiveLetters key={i}>{letter === "_" ? "\u00A0" : letter}</InteractiveLetters>
            ))
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 p-4 mb-8">
          <div className="text-xs text-red-300">
            <AlertTriangle size={16} className="inline mr-2" />
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
          <div className="bg-black border border-zinc-700 p-4 min-h-32">
            <div className="text-xs text-zinc-500 font-mono terminal-text">
              {result}
            </div>
          </div>
        </div>
      )}

      {/* Safety Info */}
      <div className="bg-zinc-800 border border-zinc-600 p-4">
        <div className="text-xs text-zinc-400 text-center">
          {"DRY_RUN_ENABLED | TESTNET_ONLY | EXPLICIT_OPT_IN_REQUIRED".split("").map((letter, i) => (
            <InteractiveLetters key={i} className="opacity-60">
              {letter === "_" ? "\u00A0" : letter}
            </InteractiveLetters>
          ))}
        </div>
      </div>
    </div>
  )
}

export default OrderPanel
