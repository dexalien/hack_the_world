"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface MatchRequest {
  id: number
  hacker: {
    id: string
    name: string
    role: string
    avatar: string
    location: string
    skills: string[]
  }
  status: "pending" | "accepted" | "declined"
  timestamp: string
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchRequest[]>([])
  const [selectedMatch, setSelectedMatch] = useState<MatchRequest | null>(null)
  const [acceptedCount, setAcceptedCount] = useState(0)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Load matches from localStorage
    const storedMatches = JSON.parse(localStorage.getItem("matchRequests") || "[]")
    setMatches(storedMatches)
    setAcceptedCount(storedMatches.filter((m: MatchRequest) => m.status === "accepted").length)
  }, [])

  const handleAcceptRequest = (matchId: number) => {
    const updatedMatches = matches.map((match) =>
      match.id === matchId ? { ...match, status: "accepted" as const } : match,
    )
    setMatches(updatedMatches)
    localStorage.setItem("matchRequests", JSON.stringify(updatedMatches))
    setAcceptedCount(updatedMatches.filter((m) => m.status === "accepted").length)

    toast({
      title: "Match Accepted!",
      description: "You can now create a Hacker House together",
    })
  }

  const handleDeclineRequest = (matchId: number) => {
    const updatedMatches = matches.map((match) =>
      match.id === matchId ? { ...match, status: "declined" as const } : match,
    )
    setMatches(updatedMatches)
    localStorage.setItem("matchRequests", JSON.stringify(updatedMatches))

    toast({
      title: "Match Declined",
      description: "Request has been declined",
    })
  }

  const handleCreateHackerHouse = () => {
    const acceptedMatches = matches.filter((m) => m.status === "accepted")
    if (acceptedMatches.length === 0) {
      toast({
        title: "No Accepted Matches",
        description: "Accept at least one match to create a Hacker House",
        variant: "destructive",
      })
      return
    }

    router.push("/world/houses")

    toast({
      title: "Creating Hacker House!",
      description: `Forming team with ${acceptedMatches.length} builder(s)`,
    })
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
            {acceptedCount > 0 && (
              <Button
                onClick={handleCreateHackerHouse}
                className="bg-gradient-to-r from-[#00ff88] to-cyan-500 hover:from-[#00ee77] hover:to-cyan-400 text-[#0a0a1f] font-mono text-sm font-bold px-6 shadow-[0_0_30px_rgba(0,255,136,0.6)] hover:shadow-[0_0_40px_rgba(0,255,136,0.8)] transition-all animate-pulse"
              >
                🏠 CREATE HACKER HOUSE ({acceptedCount})
              </Button>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#00ff88] tracking-wider font-mono text-center pixel-text mb-2">
            MY MATCHES
          </h1>
          <p className="text-cyan-400 font-mono text-sm text-center">
            {acceptedCount} accepted · {matches.filter((m) => m.status === "pending").length} pending ·{" "}
            {matches.filter((m) => m.status === "declined").length} declined
          </p>
        </div>
      </div>

      {/* Matches List */}
      <div className="relative z-10 px-4 md:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {matches.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🤝</div>
              <p className="text-cyan-400 font-mono text-lg mb-4">No match requests yet</p>
              <Link href="/world">
                <Button className="bg-[#1a1a3f] hover:bg-[#252550] border-2 border-cyan-500 text-cyan-300 font-mono">
                  Find Hackers
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Accepted Matches Section */}
              {matches.some((m) => m.status === "accepted") && (
                <div>
                  <h2 className="text-2xl font-bold text-[#00ff88] font-mono mb-4 flex items-center gap-2">
                    ✅ ACCEPTED MATCHES
                  </h2>
                  <div className="space-y-4">
                    {matches
                      .filter((match) => match.status === "accepted")
                      .map((match) => (
                        <div
                          key={match.id}
                          className="bg-[#1a1a3f] border-2 border-[#00ff88] rounded-lg p-6 shadow-[0_0_30px_rgba(0,255,136,0.3)] hover:shadow-[0_0_40px_rgba(0,255,136,0.5)] transition-all"
                        >
                          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-900 rounded-lg flex items-center justify-center text-5xl border-2 border-[#00ff88]">
                              {match.hacker.avatar}
                            </div>

                            <div className="flex-1">
                              <h3 className="text-2xl font-bold text-[#00ff88] font-mono">{match.hacker.name}</h3>
                              <p className="text-cyan-400 font-mono text-sm mb-2">{match.hacker.role}</p>
                              <p className="text-purple-400 font-mono text-xs">📍 {match.hacker.location}</p>
                              <div className="flex flex-wrap gap-2 mt-3">
                                {match.hacker.skills.slice(0, 3).map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-green-900/50 border border-green-500 text-green-200 px-2 py-1 rounded font-mono text-xs"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <Button
                              onClick={() => setSelectedMatch(match)}
                              className="bg-[#00ff88] hover:bg-[#00ee77] text-[#0a0a1f] font-mono text-sm font-bold"
                            >
                              View Profile
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Pending Requests Section */}
              {matches.some((m) => m.status === "pending") && (
                <div>
                  <h2 className="text-2xl font-bold text-cyan-400 font-mono mb-4 flex items-center gap-2">
                    ⏳ PENDING REQUESTS
                  </h2>
                  <div className="space-y-4">
                    {matches
                      .filter((match) => match.status === "pending")
                      .map((match) => (
                        <div
                          key={match.id}
                          className="bg-[#1a1a3f] border-2 border-cyan-500 rounded-lg p-6 shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] transition-all"
                        >
                          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-cyan-600 to-cyan-900 rounded-lg flex items-center justify-center text-5xl border-2 border-cyan-400">
                              {match.hacker.avatar}
                            </div>

                            <div className="flex-1">
                              <h3 className="text-2xl font-bold text-cyan-400 font-mono">{match.hacker.name}</h3>
                              <p className="text-cyan-300 font-mono text-sm mb-2">{match.hacker.role}</p>
                              <p className="text-purple-400 font-mono text-xs">📍 {match.hacker.location}</p>
                              <div className="flex flex-wrap gap-2 mt-3">
                                {match.hacker.skills.slice(0, 3).map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-cyan-900/50 border border-cyan-500 text-cyan-200 px-2 py-1 rounded font-mono text-xs"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleAcceptRequest(match.id)}
                                className="bg-[#00ff88] hover:bg-[#00ee77] text-[#0a0a1f] font-mono text-sm font-bold"
                              >
                                ✓ Accept
                              </Button>
                              <Button
                                onClick={() => handleDeclineRequest(match.id)}
                                variant="outline"
                                className="border-red-500 text-red-400 hover:bg-red-900/20 font-mono text-sm"
                              >
                                ✗ Decline
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Declined Requests Section */}
              {matches.some((m) => m.status === "declined") && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-500 font-mono mb-4 flex items-center gap-2">
                    ❌ DECLINED
                  </h2>
                  <div className="space-y-4">
                    {matches
                      .filter((match) => match.status === "declined")
                      .map((match) => (
                        <div
                          key={match.id}
                          className="bg-[#1a1a3f]/50 border-2 border-gray-600 rounded-lg p-6 opacity-60"
                        >
                          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-900 rounded-lg flex items-center justify-center text-5xl border-2 border-gray-500">
                              {match.hacker.avatar}
                            </div>

                            <div className="flex-1">
                              <h3 className="text-2xl font-bold text-gray-400 font-mono">{match.hacker.name}</h3>
                              <p className="text-gray-500 font-mono text-sm">{match.hacker.role}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      <Dialog open={!!selectedMatch} onOpenChange={(open) => !open && setSelectedMatch(null)}>
        <DialogContent className="max-w-2xl bg-[#0a0a1f] border-2 border-[#00ff88] text-white p-8">
          {selectedMatch && (
            <div>
              <div className="flex items-center gap-6 mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-green-900 rounded-lg flex items-center justify-center text-6xl border-2 border-[#00ff88]">
                  {selectedMatch.hacker.avatar}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[#00ff88] font-mono">{selectedMatch.hacker.name}</h2>
                  <p className="text-cyan-400 font-mono text-lg">{selectedMatch.hacker.role}</p>
                  <p className="text-purple-400 font-mono text-sm">📍 {selectedMatch.hacker.location}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-cyan-400 font-mono text-sm mb-3">SKILLS</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMatch.hacker.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-[#1a1a3f] border border-[#00ff88] text-[#00ff88] px-4 py-2 rounded font-mono text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-green-900/20 border border-[#00ff88] rounded-lg p-4 text-center">
                <p className="text-[#00ff88] font-mono text-sm">✅ MATCH CONFIRMED</p>
                <p className="text-cyan-400 font-mono text-xs mt-2">
                  Matched on {new Date(selectedMatch.timestamp).toLocaleDateString()}
                </p>
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
