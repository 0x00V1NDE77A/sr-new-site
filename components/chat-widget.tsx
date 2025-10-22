"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm here to help you learn more about SR Holding's agricultural operations. How can I assist you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!message.trim()) return

    const newMessage = {
      id: messages.length + 1,
      text: message,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages([...messages, newMessage])
    setMessage("")
    setIsTyping(true)

    // Simulate bot response with typing indicator
    setTimeout(() => {
      setIsTyping(false)
      const botResponse = {
        id: messages.length + 2,
        text: "Thank you for your message! Our team will get back to you shortly with detailed information about our agricultural operations and services.",
        isBot: true,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
    }, 2000)
  }

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 260, damping: 20 }}
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="relative">
          <Button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-white shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-white/20 backdrop-blur-sm relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <MessageCircle className="w-7 h-7 relative z-10" />
          </Button>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-sm p-6 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-white to-gray-200 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">SR Holding AI</h3>
                  <p className="text-gray-400 text-sm">Online • Ready to help</p>
                </div>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full w-8 h-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto h-80 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-start space-x-3 ${msg.isBot ? "justify-start" : "justify-end flex-row-reverse space-x-reverse"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.isBot
                        ? "bg-gradient-to-r from-white to-gray-200"
                        : "bg-gradient-to-r from-gray-700 to-gray-600"
                    }`}
                  >
                    {msg.isBot ? <Bot className="w-4 h-4 text-black" /> : <User className="w-4 h-4 text-white" />}
                  </div>
                  <div
                    className={`max-w-xs px-4 py-3 rounded-2xl text-sm shadow-lg ${
                      msg.isBot
                        ? "bg-gradient-to-r from-white/10 to-white/5 text-white border border-white/10 backdrop-blur-sm"
                        : "bg-gradient-to-r from-white to-gray-100 text-black"
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <p className={`text-xs mt-2 ${msg.isBot ? "text-gray-400" : "text-gray-600"}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start space-x-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-white to-gray-200 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-black" />
                  </div>
                  <div className="bg-gradient-to-r from-white/10 to-white/5 px-4 py-3 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/10 bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-sm">
              <div className="flex space-x-3 items-end">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 bg-white/10 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-white/30 border border-white/10 backdrop-blur-sm placeholder-gray-400 transition-all duration-200"
                  />
                </div>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="w-12 h-12 bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
