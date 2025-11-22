"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface HackerHouse {
  id: number
  name: string
  location: string
  price: string
  priceType: "total" | "week" | "month"
  members: {
    avatar: string
    name: string
  }[]
  maxMembers: number
  requiredSkills: string[]
  requiredPOAPs: string[]
  joinRequestsOpen: boolean
  createdByUser?: boolean
}

interface MatchedHacker {
  id: string
  name: string
  role: string
  avatar: string
  location: string
  skills: string[]
}

export default function HackerHousesPage() {
  const [houses, setHouses] = useState<HackerHouse[]>([])
  const [selectedHouse, setSelectedHouse] = useState<HackerHouse | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [acceptedMatches, setAcceptedMatches] = useState<MatchedHacker[]>([])
  const { toast } = useToast()
  const [catPosition, setCatPosition] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const moveCat = (direction: "left" | "right") => {
    const container = scrollContainerRef.current
    if (!container) return

    const moveAmount = 300
    if (direction === "left") {
      setCatPosition((prev) => Math.max(0, prev - moveAmount))
      container.scrollBy({ left: -moveAmount, behavior: "smooth" })
    } else {
      setCatPosition((prev) => prev + moveAmount)
      container.scrollBy({ left: moveAmount, behavior: "smooth" })
    }
  }

  const handleSkillToggle = (skill: string) => {
    setNewHouse((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.includes(skill)
        ? prev.requiredSkills.filter((s) => s !== skill)
        : [...prev.requiredSkills, skill],
    }))
  }

  const handlePOAPToggle = (poap: string) => {
    setNewHouse((prev) => ({
      ...prev,
      requiredPOAPs: prev.requiredPOAPs.includes(poap)
        ? prev.requiredPOAPs.filter((p) => p !== poap)
        : [...prev.requiredPOAPs, poap],
    }))
  }

  const handleCreateHouse = () => {
    if (!newHouse.name || !newHouse.price) {
      toast({
        title: "Missing Information",
        description: "Please fill in house name and price",
        variant: "destructive",
      })
      return
    }

    const house: HackerHouse = {
      id: Date.now(),
      name: newHouse.name,
      location: newHouse.location,
      price: `$${newHouse.price}`,
      priceType: newHouse.priceType,
      members: acceptedMatches.slice(0, 2).map((m) => ({
        avatar: m.avatar,
        name: m.name,
      })),
      maxMembers: newHouse.maxMembers,
      requiredSkills: newHouse.requiredSkills,
      requiredPOAPs: newHouse.requiredPOAPs,
      joinRequestsOpen: true,
      createdByUser: true,
    }

    const updatedHouses = [...houses, house]
    setHouses(updatedHouses)
    localStorage.setItem("hackerHouses", JSON.stringify(updatedHouses))

    toast({
      title: "Hacker House Created!",
      description: `${house.name} is now live and accepting requests`,
    })

    setShowCreateModal(false)
    setNewHouse({
      name: "",
      location: "New York",
      price: "",
      priceType: "week" as "total" | "week" | "month",
      maxMembers: 4,
      requiredSkills: [] as string[],
      requiredPOAPs: [] as string[],
    })
  }

  const handleApplyToJoin = (houseId: number) => {
    toast({
      title: "Joined Successfully!",
      description: "Welcome to the hacker house",
    })
    router.push(`/world/houses/room/${houseId}`)
  }

  const [newHouse, setNewHouse] = useState({
    name: "",
    location: "New York",
    price: "",
    priceType: "week" as "total" | "week" | "month",
    maxMembers: 4,
    requiredSkills: [] as string[],
    requiredPOAPs: [] as string[],
  })

  const availableSkills = ["React", "Solidity", "Python", "TypeScript", "Rust", "Go", "Node.js", "Web3"]
  const availablePOAPs = ["ETHGlobal NYC 2024", "Devconnect 2023", "ETHDenver 2024", "Talent Protocol", "Base Builder"]

  useEffect(() => {
    const storedMatches = JSON.parse(localStorage.getItem("matchRequests") || "[]")
    const accepted = storedMatches.filter((m: any) => m.status === "accepted").map((m: any) => m.hacker)
    setAcceptedMatches(accepted)

    const storedHouses = JSON.parse(localStorage.getItem("hackerHouses") || "[]")
    if (storedHouses.length === 0) {
      const exampleHouses: HackerHouse[] = [
        {
          id: 1,
          name: "ETH Builder House",
          location: "New York",
          price: "$250",
          priceType: "total",
          members: [
            { avatar: "🐱", name: "Alice" },
            { avatar: "🦊", name: "Charlie" },
          ],
          maxMembers: 4,
          requiredSkills: ["React", "Solidity"],
          requiredPOAPs: ["ETHGlobal NYC 2024"],
          joinRequestsOpen: true,
        },
        {
          id: 2,
          name: "Web3 Dev Collective",
          location: "Buenos Aires",
          price: "$250",
          priceType: "week",
          members: [
            { avatar: "🐱", name: "Jordan" },
            { avatar: "🐰", name: "Sam" },
          ],
          maxMembers: 6,
          requiredSkills: ["Solidity", "TypeScript"],
          requiredPOAPs: ["Talent Protocol", "Devconnect 2023"],
          joinRequestsOpen: true,
        },
        {
          id: 3,
          name: "DeFi Hacker Haven",
          location: "London",
          price: "$400",
          priceType: "week",
          members: [{ avatar: "🦁", name: "Max" }],
          maxMembers: 4,
          requiredSkills: ["Rust", "Solidity"],
          requiredPOAPs: ["ETHDenver 2024"],
          joinRequestsOpen: true,
        },
      ]
      setHouses(exampleHouses)
      localStorage.setItem("hackerHouses", JSON.stringify(exampleHouses))
    } else {
      setHouses(storedHouses)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a1f] relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(0, 255, 136, 0.4) 1px, transparent 1px),
            linear-gradient(rgba(0, 255, 136, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
          animation: "gridMove 20s linear infinite",
        }}
      />

      <div className="relative z-20 bg-gradient-to-b from-[#0a0a1f] via-[#0a0a1f]/95 to-transparent py-4 px-4 md:px-8 border-b border-cyan-500/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <Button className="bg-[#1a1a3f] hover:bg-[#252550] border-2 border-cyan-500 text-cyan-300 font-mono text-sm">
              ← Back
            </Button>
            {acceptedMatches.length > 0 && (
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-[#00ff88] to-cyan-500 hover:from-[#00ee77] hover:to-cyan-400 text-[#0a0a1f] font-mono text-xs md:text-sm font-bold px-4 md:px-6 shadow-[0_0_30px_rgba(0,255,136,0.6)]"
              >
                + CREATE HOUSE
              </Button>
            )}
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-[#00ff88] tracking-wider font-mono text-center pixel-text mb-1">
            HACKER HOUSES
          </h1>
          <p className="text-cyan-400 font-mono text-xs md:text-sm text-center">
            Explore the night city • Find your builder collective
          </p>
        </div>
      </div>

      {/* Side-scrolling cyberpunk city exploration */}
      <div className="relative h-[calc(100vh-120px)] overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="h-full overflow-x-auto overflow-y-hidden scrollbar-hide relative"
          style={{
            backgroundImage: `linear-gradient(180deg, #0d0d2b 0%, #1a1a3e 20%, #0d1b2a 50%, #1b263b 80%, #1a2332 100%)`,
          }}
        >
          {/* Starry pixel sky */}
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white"
                style={{
                  width: `${Math.random() > 0.5 ? 2 : 1}px`,
                  height: `${Math.random() > 0.5 ? 2 : 1}px`,
                  top: `${Math.random() * 60}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random(),
                  animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          <div className="absolute inset-0 pointer-events-none">
            {/* Far background buildings - pixelated silhouettes */}
            <div className="absolute bottom-32 left-0 w-full h-64 opacity-30">
              {/* Tall building 1 */}
              <div className="absolute left-[10%] bottom-0 w-20 h-48 bg-gradient-to-t from-purple-900/80 to-purple-700/60 border-2 border-purple-500/30">
                {/* Windows */}
                {[...Array(8)].map((_, row) =>
                  [...Array(3)].map((_, col) => (
                    <div
                      key={`${row}-${col}`}
                      className="absolute w-2 h-2 bg-yellow-300/70"
                      style={{
                        left: `${col * 6 + 4}px`,
                        top: `${row * 6 + 4}px`,
                        animation:
                          Math.random() > 0.7 ? `pulse ${2 + Math.random() * 2}s ease-in-out infinite` : "none",
                      }}
                    />
                  )),
                )}
                {/* Antenna */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-1 h-8 bg-purple-400/50" />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </div>

              {/* Wide building 2 */}
              <div className="absolute left-[25%] bottom-0 w-32 h-40 bg-gradient-to-t from-cyan-900/80 to-cyan-700/60 border-2 border-cyan-500/30">
                {[...Array(7)].map((_, row) =>
                  [...Array(6)].map((_, col) => (
                    <div
                      key={`${row}-${col}`}
                      className="absolute w-2 h-2 bg-cyan-300/60"
                      style={{
                        left: `${col * 5 + 4}px`,
                        top: `${row * 5 + 4}px`,
                      }}
                    />
                  )),
                )}
              </div>

              {/* Tall building 3 */}
              <div className="absolute left-[45%] bottom-0 w-24 h-56 bg-gradient-to-t from-pink-900/80 to-pink-700/60 border-2 border-pink-500/30">
                {[...Array(10)].map((_, row) =>
                  [...Array(4)].map((_, col) => (
                    <div
                      key={`${row}-${col}`}
                      className="absolute w-2 h-2 bg-pink-300/70"
                      style={{
                        left: `${col * 5 + 4}px`,
                        top: `${row * 5 + 4}px`,
                        animation:
                          Math.random() > 0.8 ? `pulse ${1.5 + Math.random() * 2}s ease-in-out infinite` : "none",
                      }}
                    />
                  )),
                )}
              </div>

              {/* Building 4 */}
              <div className="absolute left-[65%] bottom-0 w-28 h-44 bg-gradient-to-t from-indigo-900/80 to-indigo-700/60 border-2 border-indigo-500/30">
                {[...Array(8)].map((_, row) =>
                  [...Array(5)].map((_, col) => (
                    <div
                      key={`${row}-${col}`}
                      className="absolute w-2 h-2 bg-indigo-300/60"
                      style={{
                        left: `${col * 5 + 4}px`,
                        top: `${row * 5 + 4}px`,
                      }}
                    />
                  )),
                )}
              </div>

              {/* Building 5 */}
              <div className="absolute left-[85%] bottom-0 w-20 h-52 bg-gradient-to-t from-green-900/80 to-green-700/60 border-2 border-green-500/30">
                {[...Array(9)].map((_, row) =>
                  [...Array(3)].map((_, col) => (
                    <div
                      key={`${row}-${col}`}
                      className="absolute w-2 h-2 bg-green-300/60"
                      style={{
                        left: `${col * 6 + 4}px`,
                        top: `${row * 5 + 4}px`,
                      }}
                    />
                  )),
                )}
              </div>
            </div>

            {/* Neon signs and holographic effects */}
            <div className="absolute top-24 left-[15%] text-xs font-bold text-cyan-400 opacity-70 animate-pulse border-2 border-cyan-400/50 px-2 py-1 bg-cyan-950/80">
              CYBER CAFE
            </div>
            <div className="absolute top-32 left-[50%] text-xs font-bold text-pink-400 opacity-70 animate-pulse border-2 border-pink-400/50 px-2 py-1 bg-pink-950/80">
              HACKERSPACE
            </div>
            <div className="absolute top-20 left-[75%] text-xs font-bold text-purple-400 opacity-70 animate-pulse border-2 border-purple-400/50 px-2 py-1 bg-purple-950/80">
              DEV ZONE
            </div>

            {/* Floating particles/digital rain effect */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-green-400 text-xs font-mono"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `float ${5 + Math.random() * 10}s linear infinite`,
                    animationDelay: `${Math.random() * 5}s`,
                  }}
                >
                  {Math.random() > 0.5 ? "01" : "10"}
                </div>
              ))}
            </div>
          </div>

          {/* Scrollable world container */}
          <div className="h-full relative" style={{ width: `${houses.length * 450 + 1000}px`, minWidth: "200vw" }}>
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1a2332] to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-[#1a2332] border-t-4 border-[#00ff88]/30">
              {/* Street lines */}
              <div className="absolute top-12 left-0 right-0 h-1 bg-yellow-400/30" />
              {/* Dashed center line */}
              <div className="absolute top-12 left-0 right-0 h-1 flex">
                {[...Array(50)].map((_, i) => (
                  <div key={i} className="w-8 h-1 bg-yellow-400/50 mr-4" />
                ))}
              </div>
            </div>

            {/* Hacker House Cards floating in the night city */}
            <div className="absolute bottom-32 left-20 right-0 flex gap-8 items-end pb-8">
              {houses.map((house) => (
                <div
                  key={house.id}
                  onClick={() => setSelectedHouse(house)}
                  className={`
                    relative flex-shrink-0 w-[400px] md:w-[500px] bg-gradient-to-br from-[#1a1a3f] to-[#0f0f2a] 
                    border-4 rounded-xl p-6 cursor-pointer
                    transition-all duration-300 hover:scale-105 hover:shadow-2xl
                    ${house.createdByUser ? "border-[#00ff88] shadow-[0_0_30px_rgba(0,255,136,0.5)]" : "border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]"}
                  `}
                >
                  {house.createdByUser && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-[#00ff88] to-cyan-500 text-[#0a0a1f] px-4 py-1 rounded-full font-mono text-xs font-bold shadow-lg animate-pulse">
                      YOUR HOUSE
                    </div>
                  )}

                  {/* Floating glow effect */}
                  <div className="absolute -inset-4 bg-purple-500/20 rounded-2xl blur-2xl animate-pulse" />

                  <div className="relative bg-[#1a1a3f] border-2 border-purple-500 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.5)]">
                    {/* JOIN OPEN badge */}
                    {house.joinRequestsOpen && (
                      <div className="bg-gradient-to-r from-purple-900 to-purple-700 border-b-2 border-purple-400 px-4 py-2 text-center shadow-[0_4px_20px_rgba(168,85,247,0.8)] animate-pulse">
                        <p className="text-purple-200 font-mono text-xs font-bold tracking-widest">
                          ⚡ JOIN REQUESTS OPEN ⚡
                        </p>
                      </div>
                    )}

                    {/* Card content */}
                    <div className="p-5">
                      <h3 className="text-xl md:text-2xl font-bold text-[#00ff88] font-mono mb-2 text-balance">
                        {house.name}
                      </h3>
                      <p className="text-cyan-400 font-mono text-sm mb-4">📍 {house.location}</p>

                      {/* Price and Members section */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {/* Price card */}
                        <div className="bg-[#0a0a1f] border-2 border-yellow-500 rounded-lg p-3 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                          <p className="text-yellow-400 font-mono text-xl font-bold mb-1">{house.price}</p>
                          <p className="text-yellow-300 font-mono text-xs">/{house.priceType}</p>
                          <div className="flex gap-1 mt-3">
                            {house.members.map((member, idx) => (
                              <div
                                key={idx}
                                className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-900 rounded flex items-center justify-center text-base border-2 border-purple-400 shadow-lg"
                              >
                                {member.avatar}
                              </div>
                            ))}
                            {house.members.length < house.maxMembers && (
                              <div className="w-8 h-8 bg-purple-900/30 border-2 border-dashed border-purple-500 rounded flex items-center justify-center text-purple-400 text-xs">
                                +{house.maxMembers - house.members.length}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Requirements card */}
                        <div className="bg-[#0a0a1f] border-2 border-cyan-500 rounded-lg p-3 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                          <p className="text-cyan-400 font-mono text-xs font-bold mb-2">REQUIRED</p>
                          <div className="space-y-1 mb-2">
                            {house.requiredSkills.slice(0, 2).map((skill, idx) => (
                              <div key={idx} className="flex items-center gap-1">
                                <span className="text-cyan-400 text-xs">⚡</span>
                                <span className="text-cyan-300 font-mono text-xs truncate">{skill}</span>
                              </div>
                            ))}
                            {house.requiredSkills.length > 2 && (
                              <p className="text-cyan-400/60 font-mono text-xs">
                                +{house.requiredSkills.length - 2} more
                              </p>
                            )}
                          </div>
                          {house.requiredPOAPs.length > 0 && (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <span className="text-purple-400 text-xs">🎫</span>
                                <span className="text-purple-300 font-mono text-xs truncate">
                                  {house.requiredPOAPs[0].split(" ").slice(0, 2).join(" ")}
                                </span>
                              </div>
                              {house.requiredPOAPs.length > 1 && (
                                <p className="text-purple-400/60 font-mono text-xs pl-4">
                                  +{house.requiredPOAPs.length - 1} more
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Member count */}
                      <p className="text-gray-400 font-mono text-xs mb-3">
                        👥 {house.members.length}/{house.maxMembers} members
                      </p>

                      {/* Apply button */}
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-mono text-sm font-bold shadow-[0_0_25px_rgba(168,85,247,0.6)] border border-purple-400">
                        VIEW DETAILS
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cat Character */}
            <div
              className="absolute bottom-28 transition-all duration-500 z-20"
              style={{ left: `${catPosition + 50}px` }}
            >
              <div className="relative">
                {/* Shadow */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-black/40 rounded-full blur-md" />

                {/* Cat character */}
                <div className="text-7xl md:text-8xl animate-bounce">🐱</div>

                {/* Player label */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-cyan-400 border-2 border-cyan-300 rounded-lg px-3 py-1 whitespace-nowrap shadow-[0_0_30px_rgba(6,182,212,0.9)] animate-pulse">
                  <p className="text-[#0a0a1f] font-mono text-xs font-bold">🎯 YOU</p>
                </div>
              </div>
            </div>
          </div>

          {/* Movement controls */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-40">
            <Button
              onClick={() => moveCat("left")}
              className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-[#0a0a1f] font-bold text-2xl md:text-3xl shadow-[0_0_30px_rgba(6,182,212,0.8)] border-4 border-cyan-300 transition-all hover:scale-110"
            >
              ←
            </Button>
            <Button
              onClick={() => moveCat("right")}
              className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-[#0a0a1f] font-bold text-2xl md:text-3xl shadow-[0_0_30px_rgba(6,182,212,0.8)] border-4 border-cyan-300 transition-all hover:scale-110"
            >
              →
            </Button>
          </div>
        </div>
      </div>

      {selectedHouse && (
        <Dialog open={!!selectedHouse} onOpenChange={() => setSelectedHouse(null)}>
          <DialogContent className="max-w-md bg-[#0a0a1f] border-2 border-purple-500 text-white p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-[#00ff88] font-mono mb-2 text-balance">
              {selectedHouse.name}
            </h2>
            <p className="text-cyan-400 font-mono text-sm mb-4">📍 {selectedHouse.location}</p>

            <div className="space-y-4">
              {/* Price section */}
              <div className="bg-[#1a1a3f] border-2 border-yellow-500 rounded-lg p-4 shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                <p className="text-yellow-400 font-mono text-3xl font-bold">
                  {selectedHouse.price}
                  <span className="text-lg">/{selectedHouse.priceType}</span>
                </p>
              </div>

              {/* Members section */}
              <div className="bg-[#1a1a3f] border-2 border-purple-500 rounded-lg p-4">
                <p className="text-purple-300 font-mono text-sm font-bold mb-3">
                  MEMBERS ({selectedHouse.members.length}/{selectedHouse.maxMembers})
                </p>
                <div className="flex gap-2 flex-wrap">
                  {selectedHouse.members.map((member, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center gap-1 bg-[#0a0a1f] border border-purple-400 rounded-lg p-2"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-900 rounded flex items-center justify-center text-2xl border-2 border-purple-400">
                        {member.avatar}
                      </div>
                      <p className="text-purple-300 font-mono text-xs">{member.name}</p>
                    </div>
                  ))}
                  {[...Array(selectedHouse.maxMembers - selectedHouse.members.length)].map((_, idx) => (
                    <div
                      key={`empty-${idx}`}
                      className="flex flex-col items-center gap-1 bg-[#0a0a1f] border-2 border-dashed border-purple-500/50 rounded-lg p-2"
                    >
                      <div className="w-12 h-12 rounded flex items-center justify-center text-purple-500 text-2xl">
                        +
                      </div>
                      <p className="text-purple-500/50 font-mono text-xs">Open</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required skills */}
              <div className="bg-[#1a1a3f] border-2 border-cyan-500 rounded-lg p-4">
                <p className="text-cyan-300 font-mono text-sm font-bold mb-3">REQUIRED SKILLS</p>
                <div className="flex flex-wrap gap-2">
                  {selectedHouse.requiredSkills.map((skill, idx) => (
                    <div key={idx} className="bg-[#0a0a1f] border border-cyan-400 rounded px-3 py-1">
                      <span className="text-cyan-300 font-mono text-xs">⚡ {skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required POAPs */}
              {selectedHouse.requiredPOAPs.length > 0 && (
                <div className="bg-[#1a1a3f] border-2 border-purple-500 rounded-lg p-4">
                  <p className="text-purple-300 font-mono text-sm font-bold mb-3">REQUIRED POAPS</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedHouse.requiredPOAPs.map((poap, idx) => (
                      <div key={idx} className="bg-[#0a0a1f] border border-purple-400 rounded px-3 py-1">
                        <span className="text-purple-300 font-mono text-xs">🎫 {poap}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Apply button */}
              <Button
                onClick={() => {
                  handleApplyToJoin(selectedHouse.id)
                  setSelectedHouse(null)
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-mono text-base font-bold py-6 shadow-[0_0_30px_rgba(168,85,247,0.7)] border-2 border-purple-400"
              >
                APPLY TO JOIN
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {showCreateModal && (
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="max-w-2xl bg-[#0a0a1f] border-2 border-[#00ff88] text-white p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-[#00ff88] font-mono mb-4">CREATE HACKER HOUSE</h2>

            <div className="space-y-4">
              {/* House Name */}
              <div>
                <Label className="text-cyan-300 font-mono text-sm mb-2 block">HOUSE NAME</Label>
                <Input
                  value={newHouse.name}
                  onChange={(e) => setNewHouse({ ...newHouse, name: e.target.value })}
                  placeholder="Enter house name..."
                  className="bg-[#1a1a3f] border-2 border-cyan-500 text-white font-mono"
                />
              </div>

              {/* Location */}
              <div>
                <Label className="text-cyan-300 font-mono text-sm mb-2 block">LOCATION</Label>
                <select
                  value={newHouse.location}
                  onChange={(e) => setNewHouse({ ...newHouse, location: e.target.value })}
                  className="w-full bg-[#1a1a3f] border-2 border-cyan-500 text-white font-mono p-2 rounded"
                >
                  <option value="New York">New York</option>
                  <option value="Buenos Aires">Buenos Aires</option>
                  <option value="London">London</option>
                  <option value="New Delhi">New Delhi</option>
                  <option value="Tokyo">Tokyo</option>
                </select>
              </div>

              {/* Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-cyan-300 font-mono text-sm mb-2 block">PRICE</Label>
                  <Input
                    type="number"
                    value={newHouse.price}
                    onChange={(e) => setNewHouse({ ...newHouse, price: e.target.value })}
                    placeholder="250"
                    className="bg-[#1a1a3f] border-2 border-yellow-500 text-white font-mono"
                  />
                </div>
                <div>
                  <Label className="text-cyan-300 font-mono text-sm mb-2 block">PRICE TYPE</Label>
                  <select
                    value={newHouse.priceType}
                    onChange={(e) => setNewHouse({ ...newHouse, priceType: e.target.value as any })}
                    className="w-full bg-[#1a1a3f] border-2 border-yellow-500 text-white font-mono p-2 rounded"
                  >
                    <option value="total">Total</option>
                    <option value="week">Per Week</option>
                    <option value="month">Per Month</option>
                  </select>
                </div>
              </div>

              {/* Max Members */}
              <div>
                <Label className="text-cyan-300 font-mono text-sm mb-2 block">MAX MEMBERS</Label>
                <Input
                  type="number"
                  value={newHouse.maxMembers}
                  onChange={(e) => setNewHouse({ ...newHouse, maxMembers: Number.parseInt(e.target.value) || 4 })}
                  min="2"
                  max="10"
                  className="bg-[#1a1a3f] border-2 border-purple-500 text-white font-mono"
                />
              </div>

              {/* Required Skills */}
              <div>
                <Label className="text-cyan-300 font-mono text-sm mb-3 block">REQUIRED SKILLS</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableSkills.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center gap-2 bg-[#1a1a3f] border border-cyan-500 rounded p-2"
                    >
                      <Checkbox
                        id={`skill-${skill}`}
                        checked={newHouse.requiredSkills.includes(skill)}
                        onCheckedChange={() => handleSkillToggle(skill)}
                        className="border-cyan-400"
                      />
                      <label htmlFor={`skill-${skill}`} className="text-cyan-300 font-mono text-xs cursor-pointer">
                        {skill}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required POAPs */}
              <div>
                <Label className="text-cyan-300 font-mono text-sm mb-3 block">REQUIRED POAPS</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {availablePOAPs.map((poap) => (
                    <div
                      key={poap}
                      className="flex items-center gap-2 bg-[#1a1a3f] border border-purple-500 rounded p-2"
                    >
                      <Checkbox
                        id={`poap-${poap}`}
                        checked={newHouse.requiredPOAPs.includes(poap)}
                        onCheckedChange={() => handlePOAPToggle(poap)}
                        className="border-purple-400"
                      />
                      <label htmlFor={`poap-${poap}`} className="text-purple-300 font-mono text-xs cursor-pointer">
                        {poap}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Initial Members */}
              {acceptedMatches.length > 0 && (
                <div className="bg-[#1a1a3f] border-2 border-purple-500 rounded-lg p-4">
                  <p className="text-purple-300 font-mono text-sm font-bold mb-2">INITIAL MEMBERS (Your Matches)</p>
                  <div className="flex gap-2 flex-wrap">
                    {acceptedMatches.slice(0, 2).map((match) => (
                      <div
                        key={match.id}
                        className="flex items-center gap-2 bg-[#0a0a1f] border border-purple-400 rounded px-3 py-1"
                      >
                        <span className="text-xl">{match.avatar}</span>
                        <span className="text-purple-300 font-mono text-xs">{match.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Create Button */}
              <Button
                onClick={handleCreateHouse}
                className="w-full bg-gradient-to-r from-[#00ff88] to-cyan-500 hover:from-[#00ee77] hover:to-cyan-400 text-[#0a0a1f] font-mono text-base font-bold py-6 shadow-[0_0_30px_rgba(0,255,136,0.8)] border-2 border-[#00ff88]"
              >
                CREATE HOUSE
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
