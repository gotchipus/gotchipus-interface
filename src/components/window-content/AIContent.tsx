"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Send } from "lucide-react"

export default function AIContent() {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hello! I'm PusAI. How can I help you today?", isUser: false },
  ])
  const [input, setInput] = useState("")
  const [hopAnimation, setHopAnimation] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Bunny hopping animation
  useEffect(() => {
    const interval = setInterval(() => {
      setHopAnimation((prev) => (prev + 1) % 3)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (input.trim() === "") return

    // Add user message
    setMessages((prev) => [...prev, { text: input, isUser: true }])

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I'm still learning, but I'll try my best to help!",
        "That's an interesting question. Let me think...",
        "Gotchipus is evolving every day, just like me!",
        "I'm your virtual assistant in this Windows 98 world.",
        "Have you explored all the desktop icons yet?",
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setMessages((prev) => [...prev, { text: randomResponse, isUser: false }])
    }, 1000)

    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-full">
      {/* Left side - Bungotchi pet display */}
      <div className="w-1/2 bg-[#c0c0c0] border-r border-[#808080] flex flex-col items-center justify-center p-4">
        <div
          className="w-32 h-32 relative"
          style={{
            transform: `translateY(${hopAnimation === 1 ? "-5px" : "0"})`,
            transition: "transform 0.2s ease-in-out",
          }}
        >
          {/* Pixel art rabbit - simplified for this example */}
          <div className="w-full h-full bg-[#c0c0c0] relative">
            {/* Ears */}
            <div className="absolute w-6 h-16 bg-gray-300 rounded-t-full left-4 top-[-8px]"></div>
            <div className="absolute w-6 h-16 bg-gray-300 rounded-t-full right-4 top-[-8px]"></div>
            <div className="absolute w-4 h-12 bg-pink-200 rounded-t-full left-5 top-[-6px]"></div>
            <div className="absolute w-4 h-12 bg-pink-200 rounded-t-full right-5 top-[-6px]"></div>

            {/* Head */}
            <div className="absolute w-24 h-20 bg-gray-300 rounded-full left-4 top-8"></div>

            {/* Eyes */}
            <div className="absolute w-4 h-4 bg-black rounded-full left-10 top-16"></div>
            <div className="absolute w-4 h-4 bg-black rounded-full right-10 top-16"></div>
            <div className="absolute w-1 h-1 bg-white rounded-full left-11 top-17"></div>
            <div className="absolute w-1 h-1 bg-white rounded-full right-11 top-17"></div>

            {/* Nose */}
            <div className="absolute w-3 h-2 bg-pink-300 rounded-full left-[14.5px] top-20"></div>

            {/* Body */}
            <div className="absolute w-28 h-24 bg-gray-300 rounded-full left-2 top-24"></div>

            {/* Tail */}
            <div className="absolute w-8 h-8 bg-gray-300 rounded-full right-0 top-28"></div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm">Your Gotchipus</p>
          <p className="text-xs text-gray-600">Happiness: 100%</p>
        </div>
      </div>

      {/* Right side - Chat area */}
      <div className="w-1/2 flex flex-col bg-white">
        <div className="flex-1 overflow-y-auto p-2">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.isUser ? "text-right" : "text-left"}`}>
              <div
                className={`inline-block px-3 py-2 rounded-md max-w-[80%] ${
                  msg.isUser ? "bg-[#c0c0c0] text-black" : "bg-[#000080] text-white"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-[#808080] p-2 bg-[#c0c0c0]">
          <div className="flex">
            <textarea
              className="flex-1 p-2 h-10 resize-none border border-[#808080] shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#fff] bg-white"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="ml-2 px-2 bg-[#c0c0c0] border-2 border-[#dfdfdf] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] flex items-center justify-center"
              onClick={handleSendMessage}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

