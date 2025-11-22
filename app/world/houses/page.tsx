"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/router"

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
      priceType: "week",
      maxMembers: 4,
      requiredSkills: [],
      requiredPOAPs: [],
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
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(0, 255, 136, 0.3) 1px, transparent 1px),
            linear-gradient(rgba(0, 255, 136, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          animation: "gridMove 20s linear infinite",
        }}
      />

      <div className="relative z-20 bg-gradient-to-b from-[#0a0a1f] via-[#0a0a1f]/95 to-transparent py-4 px-4 md:px-8 border-b border-cyan-500/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <Link href="/world/matches">
              <Button className="bg-[#1a1a3f] hover:bg-[#252550] border-2 border-cyan-500 text-cyan-300 font-mono text-sm">
                ← Back
              </Button>
            </Link>
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

      <div className="relative z-10 h-[calc(100vh-160px)] md:h-[calc(100vh-180px)]">
        {/* Night city background */}
        <div
          ref={scrollContainerRef}
          className="h-full overflow-x-auto overflow-y-hidden scrollbar-hide relative"
          style={{
            backgroundImage: `linear-gradient(180deg, #0d1b2a 0%, #1b263b 30%, #2d4356 60%, #1a3a2d 100%)`,
          }}
        >
          {/* Starry sky effect */}
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full animate-pulse"
                style={{
                  width: `${Math.random() * 3}px`,
                  height: `${Math.random() * 3}px`,
                  top: `${Math.random() * 50}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                }}
              />
            ))}
          </div>

          {/* Scrollable world container */}
          <div className="h-full relative" style={{ width: `${houses.length * 450 + 1000}px`, minWidth: "200vw" }}>
            {/* Ground layer */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1a3a2d] to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-[#1a3a2d] border-t-4 border-[#00ff88]/20" />

            {/* City lights in background */}
            <div className="absolute top-10 left-10 w-16 h-32 bg-gradient-to-b from-purple-600/30 to-transparent blur-xl" />
            <div className="absolute top-20 left-[30%] w-24 h-40 bg-gradient-to-b from-cyan-500/30 to-transparent blur-xl" />
            <div className="absolute top-5 right-[20%] w-20 h-36 bg-gradient-to-b from-pink-500/30 to-transparent blur-xl" />

            {/* Hacker House Cards floating in the night city */}
            {houses.map((house, idx) => (
              <div
                key={house.id}
                className="absolute bottom-28 md:bottom-32 transition-all duration-300"
                style={{ left: `${300 + idx * 450}px` }}
              >
                <div
                  className="cursor-pointer transform hover:scale-105 hover:-translate-y-2 transition-all w-72 md:w-80"
                  onClick={() => setSelectedHouse(house)}
                >
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
              </div>
            ))}

            {/* Cat explorer character */}
            <div
              className="absolute bottom-20 md:bottom-24 transition-all duration-700 ease-out z-30"
              style={{ left: `${150 + catPosition}px` }}
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

            {/* Decorative trees */}
            {[...Array(houses.length + 3)].map((_, i) => (
              <div
                key={i}
                className="absolute bottom-24 opacity-60"
                style={{
                  left: `${50 + i * 380}px`,
                  transform: `scale(${0.8 + Math.random() * 0.4})`,
                }}
              >
                <div className="text-4xl md:text-5xl">🌲</div>
              </div>
            ))}

            {/* Street lamps */}
            {[...Array(Math.floor(houses.length / 2) + 2)].map((_, i) => (
              <div key={i} className="absolute bottom-24" style={{ left: `${200 + i * 800}px` }}>
                <div className="relative">
                  <div className="w-2 h-20 bg-gray-600 mx-auto" />
                  <div className="w-6 h-6 bg-yellow-400 rounded-full mx-auto shadow-[0_0_30px_rgba(250,204,21,0.8)] animate-pulse" />
                </div>
              </div>
            ))}
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
