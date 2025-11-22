"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface City {
  name: string
  x: number // percentage from left
  y: number // percentage from top
  region: string
}

const cities: City[] = [
  { name: "New York", x: 25, y: 35, region: "North America" },
  { name: "Buenos Aires", x: 32, y: 72, region: "South America" },
  { name: "London", x: 50, y: 28, region: "Europe" },
  { name: "New Delhi", x: 70, y: 42, region: "Asia" },
  { name: "Tokyo", x: 82, y: 38, region: "Asia" },
]

export default function WorldMapPage() {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)

  const handleFindHackers = (cityName: string) => {
    console.log(`[v0] Finding hackers in ${cityName}`)
    window.location.href = `/world/hackers?city=${encodeURIComponent(cityName)}`
  }

  const handleFindEvents = (cityName: string) => {
    console.log(`[v0] Finding events in ${cityName}`)
    // Implement find events logic
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a1f] overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-[#0a0a1f] to-transparent py-6 px-8">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Link href="/">
            <Button className="bg-[#1a1a3f] hover:bg-[#252550] border-2 border-cyan-500 text-cyan-300 font-mono text-sm px-6">
              ← Back to Protocol
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-[#00ff88] tracking-wider font-mono pixel-text">GLOBAL HACKER MAP</h1>
          <div className="w-32" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Map Container - Scrollable on mobile, full on desktop */}
      <div className="absolute inset-0 overflow-x-auto md:overflow-hidden pt-24">
        <div className="relative min-w-[1400px] md:min-w-0 md:w-full h-full">
          {/* World Map Background */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full max-w-[1400px] mx-auto">
              {/* Map Image */}
              <img
                src="/images/pixel-world-map.jpg"
                alt="Pixel World Map"
                className="w-full h-full object-contain opacity-90"
              />

              {/* City Markers */}
              {cities.map((city) => (
                <div
                  key={city.name}
                  className="absolute"
                  style={{
                    left: `${city.x}%`,
                    top: `${city.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  onMouseEnter={() => setHoveredCity(city.name)}
                  onMouseLeave={() => setHoveredCity(null)}
                >
                  {/* City Building Icon */}
                  <div className="relative cursor-pointer group">
                    <div className="text-4xl animate-bounce filter drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">🏛️</div>

                    {/* City Label */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <div className="bg-[#1a1a3f] border-2 border-[#00ff88] px-3 py-1 rounded shadow-[0_0_15px_rgba(0,255,136,0.4)]">
                        <p className="text-[#00ff88] font-mono text-xs font-bold tracking-wide uppercase">
                          {city.name}
                        </p>
                      </div>
                    </div>

                    {/* Hover Modal */}
                    {hoveredCity === city.name && (
                      <div className="absolute top-full mt-12 left-1/2 -translate-x-1/2 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="bg-[#0a0a1f] border-2 border-cyan-500 rounded-lg p-4 shadow-[0_0_30px_rgba(34,211,238,0.6)] min-w-[200px]">
                          {/* Modal Header */}
                          <div className="mb-3 pb-2 border-b border-cyan-500/30">
                            <p className="text-cyan-400 font-mono text-xs mb-1">{city.region}</p>
                            <p className="text-white font-mono text-sm font-bold">{city.name}</p>
                          </div>

                          {/* Action Buttons */}
                          <div className="space-y-2">
                            <Button
                              onClick={() => handleFindHackers(city.name)}
                              className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 border border-purple-400 text-white font-mono text-xs h-9 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                            >
                              👥 Find Hackers
                            </Button>
                            <Button
                              onClick={() => handleFindEvents(city.name)}
                              className="w-full bg-[#1a1a3f] hover:bg-[#252550] border border-cyan-500 text-cyan-300 font-mono text-xs h-9 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                            >
                              🔍 Find Events
                            </Button>
                          </div>

                          {/* Modal Arrow */}
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#0a0a1f] border-l-2 border-t-2 border-cyan-500 rotate-45" />
                        </div>
                      </div>
                    )}

                    {/* Pulsing ring animation */}
                    <div className="absolute inset-0 -m-2">
                      <div className="w-full h-full rounded-full border-2 border-cyan-500 animate-ping opacity-75" />
                    </div>
                  </div>
                </div>
              ))}

              {/* Decorative pixel characters at bottom */}
              <div className="absolute bottom-8 right-8 flex gap-4">
                <div className="text-5xl animate-bounce" style={{ animationDelay: "0s" }}>
                  🐱
                </div>
                <div className="text-5xl animate-bounce" style={{ animationDelay: "0.2s" }}>
                  🐱
                </div>
                <div className="text-5xl animate-bounce" style={{ animationDelay: "0.4s" }}>
                  🐱
                </div>
              </div>
            </div>
          </div>

          {/* Background Grid Effect */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
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
        </div>
      </div>

      {/* Mobile Scroll Hint */}
      <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-[#1a1a3f] border-2 border-cyan-500 px-4 py-2 rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.4)] animate-pulse">
          <p className="text-cyan-300 font-mono text-xs">← Scroll to explore →</p>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-20 left-4 w-12 h-12 border-l-2 border-t-2 border-cyan-500/30 pointer-events-none" />
      <div className="absolute top-20 right-4 w-12 h-12 border-r-2 border-t-2 border-cyan-500/30 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-cyan-500/30 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-cyan-500/30 pointer-events-none" />
    </div>
  )
}
