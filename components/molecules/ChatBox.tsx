"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "../atoms/Avatar"
import { Send, X } from "lucide-react"

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  timestamp: string
}

interface ChatBoxProps {
  bookingId: string
  currentUserId: string
  currentUserName: string
  currentUserAvatar: string
  otherUserName: string
  otherUserAvatar: string
  isOpen: boolean
  onClose: () => void
}

export function ChatBox({
  bookingId,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  otherUserName,
  otherUserAvatar,
  isOpen,
  onClose,
}: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Charger les messages existants
    const savedMessages = JSON.parse(localStorage.getItem(`chat-${bookingId}`) || "[]")
    setMessages(savedMessages)
  }, [bookingId])

  useEffect(() => {
    // Scroll vers le bas quand de nouveaux messages arrivent
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      senderName: currentUserName,
      senderAvatar: currentUserAvatar,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
    }

    const updatedMessages = [...messages, message]
    setMessages(updatedMessages)
    localStorage.setItem(`chat-${bookingId}`, JSON.stringify(updatedMessages))
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 z-50">
      <div className="h-full flex flex-col bg-white dark:bg-blue-gray-dark rounded-lg border border-light-blue-gray/20 dark:border-royal-blue/30 shadow-lg">
        <div className="flex flex-row items-center justify-between p-4 pb-2 border-b border-light-blue-gray/20 dark:border-royal-blue/30">
          <h3 className="text-lg font-semibold text-primary-text dark:text-dark-base-text">Chat - {otherUserName}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-primary-text dark:text-dark-base-text hover:bg-light-blue-gray/10 dark:hover:bg-royal-blue/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 flex flex-col p-4 pt-2">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {messages.length === 0 ? (
              <div className="text-center text-primary-text/70 dark:text-dark-base-text/70 py-8">
                <p>Aucun message pour le moment.</p>
                <p className="text-sm">Commencez la conversation !</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === currentUserId ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[80%] ${
                      message.senderId === currentUserId ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <Avatar src={message.senderAvatar} alt={message.senderName} size="sm" className="flex-shrink-0" />
                    <div
                      className={`rounded-lg p-3 ${
                        message.senderId === currentUserId
                          ? "bg-royal-blue text-white"
                          : "bg-light-blue-gray/20 dark:bg-royal-blue/20 text-primary-text dark:text-dark-base-text"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.senderId === currentUserId
                            ? "text-white/70"
                            : "text-primary-text/70 dark:text-dark-base-text/70"
                        }`}
                      >
                        {new Date(message.timestamp).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input de message */}
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre message..."
              className="flex-1 bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30 text-primary-text dark:text-dark-base-text placeholder:text-primary-text/70 dark:placeholder:text-dark-base-text/70"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-royal-blue hover:bg-royal-blue/90 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
