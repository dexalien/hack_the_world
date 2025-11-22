"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Video, VideoOff, Mic, MicOff, Monitor, LogOut, Plane, Send } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface AnimatedCat {
  id: number
  avatar: string
  x: number
  y: number
  direction: "left" | "right"
  speed: number
  message: string
  showMessage: boolean
}

export default function HackerHouseRoom() {
  const params = useParams()
  const router = useRouter()
  const [showTripPlanner, setShowTripPlanner] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [videoOn, setVideoOn] = useState(true)
  const [audioOn, setAudioOn] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const [animatedCats, setAnimatedCats] = useState<AnimatedCat[]>([
    { id: 1, avatar: "🐱", x: 10, y: 60, direction: "right", speed: 0.3, message: "meow!", showMessage: false },
    { id: 2, avatar: "🐈", x: 70, y: 40, direction: "left", speed: 0.25, message: "nya~", showMessage: false },
    { id: 3, avatar: "😺", x: 40, y: 70, direction: "right", speed: 0.35, message: "mrow?", showMessage: false },
    { id: 4, avatar: "😸", x: 90, y: 50, direction: "left", speed: 0.2, message: "purr", showMessage: false },
  ])

  // Mock house data - in production would fetch from API
  const house = {
    id: params.id,
    name: "Cyber Creators Lab",
    city: "Buenos Aires",
    members: [
      { name: "Max", avatar: "🐱", color: "purple" },
      { name: "Luna", avatar: "🐻", color: "orange" },
      { name: "Hax", avatar: "🐱", color: "blue" },
      { name: "Nova", avatar: "🐱", color: "pink" },
    ],
    chat: [
      { user: "Luna", message: "hi!", color: "orange" },
      { user: "Luna", message: "Luna max✨", color: "orange" },
      { user: "Luna", message: "hello", color: "orange" },
    ],
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedCats((cats) =>
        cats.map((cat) => {
          let newX = cat.x
          let newDirection = cat.direction

          // Move cat
          if (cat.direction === "right") {
            newX += cat.speed
            if (newX > 95) newDirection = "left"
          } else {
            newX -= cat.speed
            if (newX < 5) newDirection = "right"
          }

          // Random meowing
          const shouldShowMessage = Math.random() < 0.01
          const showMessage = shouldShowMessage ? true : cat.showMessage && Math.random() < 0.9

          return {
            ...cat,
            x: newX,
            direction: newDirection,
            showMessage,
          }
        }),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/trip-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          city: house.city,
          teamSize: house.members.length,
        }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        role: "assistant",
        content: data.text,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("[v0] Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0118] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0b2e] to-[#0a0118]" />

      <div className="relative z-10 h-screen flex">
        {/* Main room area */}
        <div className="flex-1 flex flex-col">
          {/* Room scene */}
          <div className="flex-1 relative bg-gradient-to-b from-purple-900/10 to-transparent">
            {animatedCats.map((cat) => (
              <div
                key={cat.id}
                className="absolute transition-all duration-100 ease-linear"
                style={{
                  left: `${cat.x}%`,
                  top: `${cat.y}%`,
                  transform: cat.direction === "left" ? "scaleX(-1)" : "scaleX(1)",
                }}
              >
                <div className="relative">
                  <div className="text-6xl animate-bounce" style={{ animationDuration: "1.5s" }}>
                    {cat.avatar}
                  </div>
                  {cat.showMessage && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-purple-600/90 border border-purple-400 rounded-lg px-3 py-1 whitespace-nowrap animate-pulse">
                      <div className="text-white font-mono text-xs">{cat.message}</div>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-purple-600/90 rotate-45 border-r border-b border-purple-400" />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Overlay controls at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={() => setAudioOn(!audioOn)}
                  className={`${
                    audioOn ? "bg-purple-600 hover:bg-purple-500" : "bg-red-600 hover:bg-red-500"
                  } text-white font-mono px-6 py-3`}
                >
                  {audioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  <span className="ml-2">{audioOn ? "Mute" : "Unmute"}</span>
                </Button>

                <Button
                  onClick={() => setVideoOn(!videoOn)}
                  className={`${
                    videoOn ? "bg-purple-600 hover:bg-purple-500" : "bg-red-600 hover:bg-red-500"
                  } text-white font-mono px-6 py-3`}
                >
                  {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                  <span className="ml-2">{videoOn ? "Stop Video" : "Start Video"}</span>
                </Button>

                <Button className="bg-blue-600 hover:bg-blue-500 text-white font-mono px-6 py-3">
                  <Monitor className="w-5 h-5" />
                  <span className="ml-2">Share Screen</span>
                </Button>

                <Button
                  onClick={() => setShowTripPlanner(true)}
                  className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white font-mono px-8 py-3 shadow-[0_0_20px_rgba(34,197,94,0.5)]"
                >
                  <Plane className="w-5 h-5" />
                  <span className="ml-2">Plan My Trip</span>
                </Button>

                <Button
                  onClick={() => router.push("/world/houses")}
                  className="bg-red-600 hover:bg-red-500 text-white font-mono px-6 py-3"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="ml-2">Leave</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-80 bg-[#1a0b2e] border-l-2 border-purple-500/30 flex flex-col">
          {/* House info */}
          <div className="p-4 border-b-2 border-purple-500/30">
            <h2 className="text-yellow-400 font-mono text-lg font-bold mb-3">Hacker House</h2>
            <div className="space-y-2">
              {house.members.map((member, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="text-2xl">{member.avatar}</div>
                  <span className="text-cyan-400 font-mono text-sm">{member.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Team chat */}
          <div className="flex-1 p-4 overflow-y-auto">
            {house.chat.map((msg, idx) => (
              <div key={idx} className="mb-3">
                <div className={`text-${msg.color}-400 font-mono text-xs font-bold`}>{msg.user}:</div>
                <div className="text-gray-300 font-mono text-sm ml-2">{msg.message}</div>
              </div>
            ))}
          </div>

          {/* Chat input */}
          <div className="p-4 border-t-2 border-purple-500/30">
            <Input
              placeholder="Type a message..."
              className="bg-[#2a1b3e] border-purple-500/50 text-white font-mono placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Trip Planner Modal */}
      {showTripPlanner && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-3xl bg-[#1a0b2e] border-2 border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.5)] max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b-2 border-purple-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400 font-mono mb-1">
                    TRIP PLANNER AI
                  </h2>
                  <p className="text-cyan-400 font-mono text-sm">
                    Planning for {house.city} • {house.members.length} team members
                  </p>
                </div>
                <Button
                  onClick={() => setShowTripPlanner(false)}
                  className="bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/50"
                >
                  Close
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea ref={scrollRef} className="flex-1 p-6">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <Plane className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-400 font-mono mb-2">Welcome to Trip Planner AI!</h3>
                  <p className="text-cyan-400 font-mono text-sm">
                    I'll help you plan accommodations, activities, and logistics for your team in {house.city}.
                  </p>
                  <p className="text-gray-400 font-mono text-xs mt-4">
                    Try asking: "Find affordable accommodation for {house.members.length} people" or "What are the best
                    coworking spaces?"
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {messages.map((message, idx) => (
                  <div key={idx} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === "user"
                          ? "bg-purple-600/30 border border-purple-500/50"
                          : "bg-green-600/20 border border-green-500/50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-mono font-bold ${
                            message.role === "user" ? "text-purple-400" : "text-green-400"
                          }`}
                        >
                          {message.role === "user" ? "You" : "AI Assistant"}
                        </span>
                      </div>
                      <p className="text-white font-mono text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-green-600/20 border border-green-500/50 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-100" />
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-200" />
                        <span className="text-green-400 font-mono text-xs ml-2">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-6 border-t-2 border-purple-500/30">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about your trip..."
                  disabled={isLoading}
                  className="flex-1 bg-[#2a1b3e] border-purple-500/50 text-white font-mono placeholder:text-gray-500"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white font-mono px-6"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
