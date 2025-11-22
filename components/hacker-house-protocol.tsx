"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { fetchTalentProfile } from "@/lib/talent-protocol"
import { useToast } from "@/hooks/use-toast"

export function HackerHouseProtocol() {
  const [walletAddress, setWalletAddress] = useState("0x03X...45A")
  const [loading, setLoading] = useState(true)
  const [talentData, setTalentData] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate initialization
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleTalentProtocol = async () => {
    try {
      const testIdentifier = "vitalik.eth"
      console.log("[v0] Fetching Talent Protocol data for:", testIdentifier)

      const data = await fetchTalentProfile(testIdentifier)
      setTalentData(data)
      console.log("[v0] Talent Protocol data:", data)

      if (data) {
        toast({
          title: "Connected to Talent Protocol!",
          description: `Profile found: ${data.display_name || data.name || "Unknown Builder"}`,
        })
      } else {
        toast({
          title: "No Profile Found",
          description: "Make sure your API key is set in environment variables.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error fetching Talent Protocol data:", error)
      toast({
        title: "Connection Error",
        description: "Failed to connect to Talent Protocol. Check console for details.",
        variant: "destructive",
      })
    }
  }

  const handleScanWallet = () => {
    console.log("[v0] Scanning wallet...")
    // Implement wallet scanning logic
  }

  const handleImportPOAPs = () => {
    console.log("[v0] Importing POAPs...")
    // Implement POAP import logic
  }

  const handleSyncRepos = () => {
    console.log("[v0] Syncing GitHub repos...")
    // Implement GitHub sync logic
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a1f] overflow-hidden flex items-center justify-center">
      {/* Circuit board background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px),
            linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Animated grid lines */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse"
            style={{
              top: `${20 + i * 15}%`,
              left: 0,
              right: 0,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 text-[#00ff88] tracking-wider font-mono pixel-text">HACK THE</h1>
          <h2 className="text-4xl font-bold text-[#00ff88] tracking-wider font-mono pixel-text">WORLD</h2>
          <p className="text-cyan-400 mt-4 text-sm">Welcome, Builder.</p>
          <p className="text-cyan-300 text-xs animate-pulse">Initializing your Cypher Identity...</p>
        </div>

        {/* Wallet Address Display */}
        <div className="flex justify-center mb-6">
          <div className="bg-[#1a1a3f] border-2 border-cyan-500 rounded-lg px-6 py-2 font-mono text-cyan-300 text-sm shadow-[0_0_20px_rgba(34,211,238,0.3)]">
            {walletAddress}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Left Column - Character Display */}
          <div className="col-span-2 flex justify-center mb-4">
            <div className="relative">
              {/* Holographic frame */}
              <div className="relative bg-gradient-to-b from-cyan-900/30 to-purple-900/30 border-2 border-cyan-400 rounded-lg p-8 shadow-[0_0_30px_rgba(34,211,238,0.4)]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent animate-pulse" />

                {/* Pixel art character placeholder */}
                <div className="relative w-32 h-40 bg-[#1a1a3f] rounded border border-cyan-400 flex items-center justify-center">
                  <div className="text-6xl">🐱</div>
                </div>

                {/* Scan lines effect */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute left-0 right-0 h-px bg-cyan-400/20"
                      style={{ top: `${i * 12.5}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Mini character bottom left */}
              <div className="absolute -bottom-4 -left-12 text-4xl">🐱</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="col-span-2">
            <div className="text-center mb-2">
              <p className="text-[#00ff88] text-xs font-mono uppercase tracking-wide">ANALYZING ON-CHAIN DATA...</p>
            </div>
            <div className="w-full bg-[#1a1a3f] rounded-full h-2 overflow-hidden border border-cyan-500/50">
              <div
                className="h-full bg-gradient-to-r from-[#00ff88] to-cyan-400 animate-pulse"
                style={{ width: loading ? "60%" : "100%", transition: "width 2s ease-in-out" }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons - Right Side */}
        <div className="grid grid-cols-1 gap-3 mb-6">
          <Button
            onClick={handleTalentProtocol}
            className="w-full bg-[#1a1a3f] hover:bg-[#252550] border-2 border-cyan-500 text-[#00ff88] font-mono text-sm h-12 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all"
          >
            <span className="mr-2">💫</span>
            Talent Protocol
          </Button>

          <Button
            onClick={handleSyncRepos}
            className="w-full bg-[#1a1a3f] hover:bg-[#252550] border-2 border-cyan-500 text-cyan-300 font-mono text-sm h-12 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all"
          >
            <span className="mr-2">⚫</span>
            GitHub
          </Button>

          <Button
            onClick={handleImportPOAPs}
            className="w-full bg-[#1a1a3f] hover:bg-[#252550] border-2 border-cyan-500 text-cyan-300 font-mono text-sm h-12 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all"
          >
            <span className="mr-2">🔷</span>
            Import POAPs
          </Button>

          <Button
            onClick={handleScanWallet}
            className="w-full bg-[#1a1a3f] hover:bg-[#252550] border-2 border-cyan-500 text-cyan-300 font-mono text-sm h-12 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all"
          >
            <span className="mr-2">🔍</span>
            Scan Wallet
          </Button>
        </div>

        {/* Bottom Action Buttons */}
        <div className="grid grid-cols-1 gap-3">
          <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 border-2 border-purple-400 text-white font-mono text-sm h-12 rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all">
            Confirm Passport
          </Button>

          <Button className="w-full bg-[#0a0a1f] hover:bg-[#1a1a3f] border-2 border-cyan-600 text-cyan-400 font-mono text-sm h-12 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all">
            Sync Repos
          </Button>

          <Button className="w-full bg-[#0a0a1f] hover:bg-[#1a1a3f] border-2 border-cyan-600 text-cyan-400 font-mono text-sm h-12 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all">
            Import POAPs
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button className="w-full bg-[#0a0a1f] hover:bg-[#1a1a3f] border-2 border-purple-500 text-purple-400 font-mono text-xs h-10 rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all">
              Customize Appearance
            </Button>

            <Button
              asChild
              className="w-full bg-[#0a0a1f] hover:bg-[#1a1a3f] border-2 border-purple-500 text-purple-400 font-mono text-xs h-10 rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all"
            >
              <a href="/world">Continue to World</a>
            </Button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-4 text-cyan-500 opacity-50 text-xs font-mono">
          {"["}STATUS: ONLINE{"]"}
        </div>
        <div className="absolute top-10 right-4 text-cyan-500 opacity-50 text-xs font-mono">
          {"["}v1.0.3{"]"}
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-cyan-500/50" />
      <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-cyan-500/50" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-cyan-500/50" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-cyan-500/50" />
    </div>
  )
}
