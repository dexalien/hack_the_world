"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface HackerProfile {
  id: string
  name: string
  role: string
  avatar: string
  skills: string[]
  poaps: { name: string; icon: string }[]
  location: string
  level?: number
  techStack?: string[]
  links?: { portfolio?: string; farcaster?: string; github?: string }
  talentProtocolUsername?: string
  bio?: string
}

// Mock data for demonstration
const mockHackers: Record<string, HackerProfile[]> = {
  "New York": [
    {
      id: "1",
      name: "Alice",
      role: "Frontend",
      avatar: "🐱",
      skills: ["JavaScript", "React", "TypeScript"],
      poaps: [{ name: "ETHGlobal", icon: "🌐" }],
      location: "New York",
      level: 8,
      techStack: ["⚛️", "📘", "🎨", "🔷"],
      links: { portfolio: "#", github: "#", farcaster: "#" },
      talentProtocolUsername: "alice.eth",
      bio: "Building the future of web3 UX",
    },
    {
      id: "2",
      name: "Morgan",
      role: "Designer",
      avatar: "🦊",
      skills: ["Figma", "UI/UX", "Product Design"],
      poaps: [{ name: "Devconnect", icon: "🔌" }],
      location: "New York",
      level: 6,
      techStack: ["🎨", "✨", "🖌️"],
      links: { portfolio: "#", farcaster: "#" },
      talentProtocolUsername: "morgan.eth",
      bio: "Crafting delightful user experiences",
    },
  ],
  "Buenos Aires": [
    {
      id: "3",
      name: "Charlie",
      role: "Backend",
      avatar: "🦊",
      skills: ["Python", "Node.js", "GraphQL"],
      poaps: [
        { name: "Devconnect", icon: "🔌" },
        { name: "POAP", icon: "💜" },
      ],
      location: "Buenos Aires",
      level: 9,
      techStack: ["🐍", "💚", "🔷", "🗄️"],
      links: { portfolio: "#", github: "#" },
      talentProtocolUsername: "charlie.eth",
      bio: "Infrastructure architect & API specialist",
    },
  ],
  London: [
    {
      id: "4",
      name: "Jordan",
      role: "Full-Stack",
      avatar: "🐱",
      skills: ["React", "Solidity", "Web3"],
      poaps: [{ name: "ETHDenver", icon: "⛰️" }],
      location: "London",
      level: 7,
      techStack: ["⚛️", "⛓️", "🔷", "🦄"],
      links: { portfolio: "#", github: "#", farcaster: "#" },
      talentProtocolUsername: "jordan.eth",
      bio: "Smart contract developer & DeFi enthusiast",
    },
  ],
  "New Delhi": [
    {
      id: "5",
      name: "Priya",
      role: "Blockchain",
      avatar: "🐱",
      skills: ["Solidity", "Rust", "Security"],
      poaps: [{ name: "ETHIndia", icon: "🇮🇳" }],
      location: "New Delhi",
      level: 10,
      techStack: ["⛓️", "🦀", "🔒", "🛡️"],
      links: { portfolio: "#", github: "#" },
      talentProtocolUsername: "priya.eth",
      bio: "Security researcher & smart contract auditor",
    },
  ],
  Tokyo: [
    {
      id: "6",
      name: "Yuki",
      role: "AI/ML",
      avatar: "🦊",
      skills: ["Python", "TensorFlow", "DataViz"],
      poaps: [{ name: "ETHGlobal Tokyo", icon: "🗼" }],
      location: "Tokyo",
      level: 8,
      techStack: ["🐍", "🤖", "📊", "🧠"],
      links: { portfolio: "#", github: "#", farcaster: "#" },
      talentProtocolUsername: "yuki.eth",
      bio: "AI researcher building intelligent dApps",
    },
  ],
}

function HackersContent() {
  const searchParams = useSearchParams()
  const city = searchParams.get("city") || "New York"
  const [hackers, setHackers] = useState<HackerProfile[]>([])
  const [selectedHacker, setSelectedHacker] = useState<HackerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate API call
    setLoading(true)
    setTimeout(() => {
      setHackers(mockHackers[city] || [])
      setLoading(false)
    }, 500)
  }, [city])

  const handleInvite = (hacker: HackerProfile) => {
    const requests = JSON.parse(localStorage.getItem("matchRequests") || "[]")
    const newRequest = {
      id: Date.now(),
      hacker,
      status: "pending",
      timestamp: new Date().toISOString(),
    }
    requests.push(newRequest)
    localStorage.setItem("matchRequests", JSON.stringify(requests))

    toast({
      title: "Match Request Sent!",
      description: `Sent match request to ${hacker.name}`,
    })
    setSelectedHacker(null)
  }

  return (
    <div className="min-h-screen bg-[#0a0a1f] relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(0, 255, 136, 0.3) 1px, transparent 1px),
              linear-gradient(rgba(0, 255, 136, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            animation: "gridMove 20s linear infinite",
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-b from-[#0a0a1f] via-[#0a0a1f]/90 to-transparent py-6 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link href="/world">
              <Button className="bg-[#1a1a3f] hover:bg-[#252550] border-2 border-cyan-500 text-cyan-300 font-mono text-sm">
                ← Back to Map
              </Button>
            </Link>
            <Link href="/world/matches">
              <Button className="bg-[#1a1a3f] hover:bg-[#252550] border-2 border-purple-500 text-purple-300 font-mono text-sm">
                My Matches 🤝
              </Button>
            </Link>
            <div className="text-right">
              <p className="text-cyan-400 font-mono text-xs mb-1">LOCATION</p>
              <h2 className="text-2xl font-bold text-[#00ff88] font-mono tracking-wider">{city}</h2>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#00ff88] tracking-wider font-mono text-center pixel-text">
            FIND HACKERS
          </h1>
        </div>
      </div>

      {/* Hackers List */}
      <div className="relative z-10 px-4 md:px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin text-6xl">⚙️</div>
              <p className="text-cyan-400 font-mono mt-4">Loading hackers...</p>
            </div>
          ) : hackers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-cyan-400 font-mono text-lg">No hackers found in {city}</p>
            </div>
          ) : (
            hackers.map((hacker) => (
              <div
                key={hacker.id}
                className="bg-[#1a1a3f] border-2 border-purple-500 rounded-lg p-6 shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-purple-900 rounded-lg flex items-center justify-center text-6xl border-2 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                      {hacker.avatar}
                    </div>
                    {/* Like/Save Icon */}
                    <div className="mt-3 flex justify-center">
                      <button className="text-2xl hover:scale-110 transition-transform">❤️</button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-2xl font-bold text-[#00ff88] font-mono">{hacker.name}</h3>
                        <p className="text-cyan-400 font-mono text-sm">{hacker.role}</p>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {hacker.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-purple-900/50 border border-purple-500 text-purple-200 px-3 py-1 rounded font-mono text-xs uppercase tracking-wide"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* POAPs */}
                    <div className="flex flex-wrap gap-3 items-center mb-4">
                      {hacker.poaps.map((poap, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 bg-[#0a0a1f] border border-cyan-500/50 px-3 py-1 rounded"
                        >
                          <span className="text-lg">{poap.icon}</span>
                          <span className="text-cyan-300 font-mono text-xs">{poap.name}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => setSelectedHacker(hacker)}
                      className="w-full md:w-auto bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-400 hover:to-orange-600 text-white font-mono text-sm font-bold px-6 py-2 rounded shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] transition-all"
                    >
                      View Portfolio
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Profile Modal */}
      <Dialog open={!!selectedHacker} onOpenChange={(open) => !open && setSelectedHacker(null)}>
        <DialogContent className="max-w-2xl bg-[#0a0a1f] border-2 border-cyan-500 text-white p-0 gap-0 overflow-hidden">
          {selectedHacker && (
            <div className="relative">
              {/* Glowing background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20 pointer-events-none" />

              <div className="relative p-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-6 mb-6 pb-6 border-b border-cyan-500/30">
                  {/* Large Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-purple-900 rounded-lg flex items-center justify-center text-8xl border-2 border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.6)]">
                      {selectedHacker.avatar}
                    </div>
                  </div>

                  {/* Name & Basic Info */}
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-[#00ff88] font-mono mb-2 uppercase tracking-wider">
                      {selectedHacker.name}
                    </h2>
                    {selectedHacker.talentProtocolUsername && (
                      <p className="text-cyan-400 font-mono text-sm mb-2 flex items-center gap-2">
                        🔗 {selectedHacker.talentProtocolUsername}
                      </p>
                    )}
                    <p className="text-cyan-300 font-mono text-lg mb-2 flex items-center gap-2">
                      💼 {selectedHacker.role}
                    </p>
                    <p className="text-purple-400 font-mono text-sm flex items-center gap-2">
                      📍 {selectedHacker.location}
                    </p>
                    {selectedHacker.bio && <p className="text-gray-400 text-sm mt-3 italic">{selectedHacker.bio}</p>}
                  </div>
                </div>

                {/* Talent Protocol Skills */}
                <div className="mb-6">
                  <h3 className="text-cyan-400 font-mono text-sm mb-3 flex items-center justify-between">
                    <span>TALENT PROTOCOL SKILLS</span>
                    {selectedHacker.level && (
                      <span className="bg-purple-900 border border-purple-500 px-3 py-1 rounded text-xs flex items-center gap-2">
                        <span className="text-pink-400">★ ★</span>
                        <span className="text-white">LEVEL {selectedHacker.level}</span>
                        <span className="text-purple-300">HACKER BUILDER</span>
                      </span>
                    )}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedHacker.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-[#1a1a3f] border border-cyan-500 text-cyan-300 px-4 py-2 rounded font-mono text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tech Stack */}
                {selectedHacker.techStack && (
                  <div className="mb-6">
                    <h3 className="text-cyan-400 font-mono text-sm mb-3">TECH STACK</h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedHacker.techStack.map((tech, idx) => (
                        <div
                          key={idx}
                          className="w-12 h-12 bg-[#1a1a3f] border border-purple-500 rounded flex items-center justify-center text-2xl hover:scale-110 transition-transform cursor-pointer"
                        >
                          {tech}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* POAPs & NFT Tickets */}
                <div className="mb-6">
                  <h3 className="text-cyan-400 font-mono text-sm mb-3">POAPS & NFT TICKETS</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedHacker.poaps.map((poap, idx) => (
                      <div
                        key={idx}
                        className="bg-[#1a1a3f] border border-purple-500 rounded px-4 py-3 flex items-center gap-3 hover:border-cyan-500 transition-colors cursor-pointer"
                      >
                        <span className="text-3xl">{poap.icon}</span>
                        <div>
                          <p className="text-white font-mono text-xs font-bold">{poap.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Links */}
                {selectedHacker.links && (
                  <div className="mb-6">
                    <h3 className="text-cyan-400 font-mono text-sm mb-3">LINKS</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedHacker.links.portfolio && (
                        <Button className="bg-[#1a1a3f] hover:bg-[#252550] border border-cyan-500 text-cyan-300 font-mono text-xs h-9">
                          🌐 Portfolio
                        </Button>
                      )}
                      {selectedHacker.links.farcaster && (
                        <Button className="bg-[#1a1a3f] hover:bg-[#252550] border border-purple-500 text-purple-300 font-mono text-xs h-9">
                          🎯 Farcaster
                        </Button>
                      )}
                      {selectedHacker.links.github && (
                        <Button className="bg-[#1a1a3f] hover:bg-[#252550] border border-gray-500 text-gray-300 font-mono text-xs h-9">
                          💻 GitHub
                        </Button>
                      )}
                      <Button className="bg-[#1a1a3f] hover:bg-[#252550] border border-cyan-500 text-cyan-300 font-mono text-xs h-9">
                        🏆 Talent Protocol
                      </Button>
                    </div>
                  </div>
                )}

                {/* Invite Button */}
                <Button
                  onClick={() => handleInvite(selectedHacker)}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white font-mono text-lg font-bold py-6 rounded shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:shadow-[0_0_40px_rgba(168,85,247,0.8)] transition-all uppercase tracking-wider"
                >
                  REQUEST MATCH
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-cyan-500/30 pointer-events-none z-0" />
      <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-cyan-500/30 pointer-events-none z-0" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-cyan-500/30 pointer-events-none z-0" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-cyan-500/30 pointer-events-none z-0" />

      <style jsx>{`
        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
      `}</style>
    </div>
  )
}

export default function FindHackersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a1f] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin text-6xl">⚙️</div>
            <p className="text-cyan-400 font-mono mt-4">Loading...</p>
          </div>
        </div>
      }
    >
      <HackersContent />
    </Suspense>
  )
}
