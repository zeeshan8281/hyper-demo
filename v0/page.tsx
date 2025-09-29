"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

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

const CircuitPattern = () => (
  <div className="absolute top-4 right-4 opacity-10">
    <svg width="120" height="120" viewBox="0 0 120 120">
      <rect x="10" y="10" width="20" height="20" fill="none" stroke="white" strokeWidth="1" />
      <rect x="40" y="10" width="20" height="20" fill="none" stroke="white" strokeWidth="1" />
      <rect x="70" y="10" width="20" height="20" fill="none" stroke="white" strokeWidth="1" />
      <rect x="10" y="40" width="20" height="20" fill="none" stroke="white" strokeWidth="1" />
      <rect x="70" y="40" width="20" height="20" fill="none" stroke="white" strokeWidth="1" />
      <line x1="30" y1="20" x2="40" y2="20" stroke="white" strokeWidth="1" />
      <line x1="60" y1="20" x2="70" y2="20" stroke="white" strokeWidth="1" />
      <line x1="20" y1="30" x2="20" y2="40" stroke="white" strokeWidth="1" />
      <line x1="80" y1="30" x2="80" y2="40" stroke="white" strokeWidth="1" />
    </svg>
  </div>
)

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

export default function HyperliquidDemo() {
  const [activeTab, setActiveTab] = useState<"info" | "order" | "data">("order")
  const [isConnected, setIsConnected] = useState(false)
  const [privateKey, setPrivateKey] = useState("")
  const [marketId, setMarketId] = useState("0")
  const [price, setPrice] = useState("1000")
  const [size, setSize] = useState("0.001")
  const [buyOrder, setBuyOrder] = useState(true)
  const [dryRun, setDryRun] = useState(true)
  const [userAddress, setUserAddress] = useState("0x100278F4de251afD6006920E917A683b3B4976d2")

  return (
    <div className="min-h-screen bg-black text-white font-mono relative overflow-hidden">
      <AbstractGrid />
      <TypographicArt />

      {/* Header Warning */}
      <div className="bg-zinc-800 border-b border-zinc-700 px-6 py-3 relative">
        <CircuitPattern />
        <div className="text-center text-sm text-zinc-300">
          <span className="text-zinc-500">[TESTNET]</span>
          <span className="ml-2">
            {"HYPERLIQUID DEMO INTERFACE".split("").map((letter, i) => (
              <InteractiveLetters key={i} className="opacity-70">
                {letter === " " ? "\u00A0" : letter}
              </InteractiveLetters>
            ))}
          </span>
        </div>
      </div>

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
          {"HYPERLIQUID_DEMO_FRONTEND".split("").map((letter, i) => (
            <InteractiveLetters key={i} className="opacity-90">
              {letter === "_" ? "\u00A0" : letter}
            </InteractiveLetters>
          ))}
        </h1>
        <p className="text-zinc-400 text-sm">
          {"INTERACTIVE_TYPESCRIPT_SDK_INTERFACE".split("").map((letter, i) => (
            <InteractiveLetters key={i} className="opacity-60">
              {letter === "_" ? "\u00A0" : letter}
            </InteractiveLetters>
          ))}
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-0 py-6">
        <Button
          variant={activeTab === "info" ? "default" : "ghost"}
          onClick={() => setActiveTab("info")}
          className="rounded-none border-r border-zinc-700 px-8 py-2 text-xs tracking-wider hover:bg-zinc-800 transition-all duration-300"
        >
          {"INFO_QUERIES".split("").map((letter, i) => (
            <InteractiveLetters key={i}>{letter === "_" ? "\u00A0" : letter}</InteractiveLetters>
          ))}
        </Button>
        <Button
          variant={activeTab === "order" ? "default" : "ghost"}
          onClick={() => setActiveTab("order")}
          className="rounded-none border-r border-zinc-700 px-8 py-2 text-xs tracking-wider hover:bg-zinc-800 transition-all duration-300"
        >
          {"PLACE_ORDER".split("").map((letter, i) => (
            <InteractiveLetters key={i}>{letter === "_" ? "\u00A0" : letter}</InteractiveLetters>
          ))}
        </Button>
        <Button
          variant={activeTab === "data" ? "default" : "ghost"}
          onClick={() => setActiveTab("data")}
          className="rounded-none px-8 py-2 text-xs tracking-wider hover:bg-zinc-800 transition-all duration-300"
        >
          {"LIVE_DATA".split("").map((letter, i) => (
            <InteractiveLetters key={i}>{letter === "_" ? "\u00A0" : letter}</InteractiveLetters>
          ))}
        </Button>
      </div>

      <DataFlow />

      {/* Content Area */}
      <div className="max-w-4xl mx-auto px-6 pb-12 relative">
        {activeTab === "order" && (
          <Card className="bg-zinc-900 border-zinc-700 rounded-none relative">
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
                <div>
                  <label className="block text-xs text-zinc-400 mb-2 tracking-wider">
                    {"PRIVATE_KEY_[TESTNET_ONLY]".split("").map((letter, i) => (
                      <InteractiveLetters key={i} className="opacity-70">
                        {letter === "_" ? "\u00A0" : letter}
                      </InteractiveLetters>
                    ))}
                  </label>
                  <Input
                    type="password"
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                    className="bg-black border-zinc-600 rounded-none font-mono text-xs"
                    placeholder="••••••••••••••••••••••••••••••••••••••••••••"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-2 tracking-wider">
                    {"MARKET_ID".split("").map((letter, i) => (
                      <InteractiveLetters key={i} className="opacity-70">
                        {letter === "_" ? "\u00A0" : letter}
                      </InteractiveLetters>
                    ))}
                  </label>
                  <Input
                    value={marketId}
                    onChange={(e) => setMarketId(e.target.value)}
                    className="bg-black border-zinc-600 rounded-none font-mono text-xs"
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
                  <Input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="bg-black border-zinc-600 rounded-none font-mono text-xs"
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
                <Input
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="bg-black border-zinc-600 rounded-none font-mono text-xs max-w-xs"
                />
              </div>

              <div className="flex gap-8 mb-8">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="buy-order"
                    checked={buyOrder}
                    onCheckedChange={setBuyOrder}
                    className="border-zinc-600 data-[state=checked]:bg-white data-[state=checked]:text-black"
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
                  <Checkbox
                    id="dry-run"
                    checked={dryRun}
                    onCheckedChange={setDryRun}
                    className="border-zinc-600 data-[state=checked]:bg-white data-[state=checked]:text-black"
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

              <div className="text-center">
                <Button className="bg-white text-black hover:bg-zinc-200 rounded-none px-12 py-3 text-xs tracking-wider font-bold transition-all duration-300 hover:scale-105">
                  {"EXECUTE_ORDER".split("").map((letter, i) => (
                    <InteractiveLetters key={i}>{letter === "_" ? "\u00A0" : letter}</InteractiveLetters>
                  ))}
                </Button>
              </div>

              {/* Safety Info */}
              <div className="bg-zinc-800 border border-zinc-600 p-4 mt-8">
                <div className="text-xs text-zinc-400 text-center">
                  {"DRY_RUN_ENABLED | TESTNET_ONLY | EXPLICIT_OPT_IN_REQUIRED".split("").map((letter, i) => (
                    <InteractiveLetters key={i} className="opacity-60">
                      {letter === "_" ? "\u00A0" : letter}
                    </InteractiveLetters>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === "data" && (
          <Card className="bg-zinc-900 border-zinc-700 rounded-none relative">
            <div className="absolute bottom-4 right-4 opacity-10">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="30" fill="none" stroke="white" strokeWidth="1" />
                <circle cx="40" cy="40" r="20" fill="none" stroke="white" strokeWidth="0.5" />
                <circle cx="40" cy="40" r="10" fill="none" stroke="white" strokeWidth="0.5" />
                <line x1="40" y1="10" x2="40" y2="70" stroke="white" strokeWidth="0.5" />
                <line x1="10" y1="40" x2="70" y2="40" stroke="white" strokeWidth="0.5" />
              </svg>
            </div>

            <div className="p-8">
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
                <Button
                  onClick={() => setIsConnected(true)}
                  disabled={isConnected}
                  className="bg-green-900 hover:bg-green-800 text-green-100 rounded-none px-8 py-2 text-xs tracking-wider transition-all duration-300 hover:scale-105"
                >
                  {"CONNECT".split("").map((letter, i) => (
                    <InteractiveLetters key={i}>{letter}</InteractiveLetters>
                  ))}
                </Button>
                <Button
                  onClick={() => setIsConnected(false)}
                  disabled={!isConnected}
                  className="bg-red-900 hover:bg-red-800 text-red-100 rounded-none px-8 py-2 text-xs tracking-wider transition-all duration-300 hover:scale-105"
                >
                  {"DISCONNECT".split("").map((letter, i) => (
                    <InteractiveLetters key={i}>{letter}</InteractiveLetters>
                  ))}
                </Button>
                <Button
                  variant="outline"
                  className="border-zinc-600 rounded-none px-8 py-2 text-xs tracking-wider bg-transparent transition-all duration-300 hover:scale-105"
                >
                  {"CLEAR_LOG".split("").map((letter, i) => (
                    <InteractiveLetters key={i}>{letter === "_" ? "\u00A0" : letter}</InteractiveLetters>
                  ))}
                </Button>
              </div>

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
                  <div className="text-xs text-zinc-500 font-mono">
                    {(isConnected
                      ? "AWAITING_MARKET_DATA_STREAM..."
                      : "NO_EVENTS_YET._CLICK_CONNECT_TO_START_RECEIVING_LIVE_DATA."
                    )
                      .split("")
                      .map((letter, i) => (
                        <InteractiveLetters key={i} className="opacity-70">
                          {letter === "_" ? "\u00A0" : letter}
                        </InteractiveLetters>
                      ))}
                  </div>
                </div>
              </div>

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
          </Card>
        )}

        {activeTab === "info" && (
          <Card className="bg-zinc-900 border-zinc-700 rounded-none relative">
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 opacity-8">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <polygon points="30,5 45,15 45,35 30,45 15,35 15,15" fill="none" stroke="white" strokeWidth="1" />
                <polygon points="30,15 37,20 37,30 30,35 23,30 23,20" fill="none" stroke="white" strokeWidth="0.5" />
                <circle cx="30" cy="25" r="2" fill="white" />
              </svg>
            </div>

            <div className="p-8">
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
                <Input
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                  className="bg-black border-zinc-600 rounded-none font-mono text-xs"
                />
              </div>

              <div className="text-center mb-8">
                <Button className="bg-white text-black hover:bg-zinc-200 rounded-none px-12 py-3 text-xs tracking-wider font-bold transition-all duration-300 hover:scale-105">
                  {"FETCH_OPEN_ORDERS".split("").map((letter, i) => (
                    <InteractiveLetters key={i}>{letter === "_" ? "\u00A0" : letter}</InteractiveLetters>
                  ))}
                </Button>
              </div>

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
          </Card>
        )}

        <GeometricLines />
      </div>
    </div>
  )
}
