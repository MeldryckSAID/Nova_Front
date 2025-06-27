"use client"

import { useState } from "react"
import Image from "next/image"

interface AvatarSelectorProps {
  selectedAvatar: string
  onAvatarSelect: (avatar: string) => void
  label?: string
  error?: string
}

const avatars = [
  { id: "guy-1", name: "Guy 1", src: "/images/avatars/guy-1.svg" },
  { id: "guy-2", name: "Guy 2", src: "/images/avatars/guy-2.svg" },
  { id: "guy-3", name: "Guy 3", src: "/images/avatars/guy-3.svg" },
  { id: "guy-4", name: "Guy 4", src: "/images/avatars/guy-4.svg" },
  { id: "woman-1", name: "Woman 1", src: "/images/avatars/woman-1.svg" },
  { id: "woman-2", name: "Woman 2", src: "/images/avatars/woman-2.svg" },
  { id: "woman-3", name: "Woman 3", src: "/images/avatars/woman-3.svg" },
  { id: "woman-4", name: "Woman 4", src: "/images/avatars/woman-4.svg" },
  { id: "woman-5", name: "Woman 5", src: "/images/avatars/woman-5.svg" },
]

export function AvatarSelector({ selectedAvatar, onAvatarSelect, label, error }: AvatarSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedAvatarData = avatars.find((avatar) => avatar.src === selectedAvatar)

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-primary-text dark:text-dark-base-text">
          {label} <span className="text-soft-error-red">*</span>
        </label>
      )}

      {/* Avatar sélectionné */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-light-blue-gray/20 dark:border-royal-blue/30 bg-light-blue-gray/10 dark:bg-royal-blue/10">
          {selectedAvatar ? (
            <Image
              src={selectedAvatar || "/placeholder.svg"}
              alt={selectedAvatarData?.name || "Avatar sélectionné"}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary-text/70 dark:text-dark-base-text/70">
              <span className="text-2xl">👤</span>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 border border-light-blue-gray/20 dark:border-royal-blue/30 rounded-md hover:bg-light-blue-gray/10 dark:hover:bg-royal-blue/10 text-primary-text dark:text-dark-base-text focus:outline-none focus:ring-2 focus:ring-royal-blue transition-colors"
        >
          {selectedAvatar ? "Changer d'avatar" : "Choisir un avatar"}
        </button>
      </div>

      {/* Grille de sélection */}
      {isOpen && (
        <div className="mt-4 p-4 border border-light-blue-gray/20 dark:border-royal-blue/30 rounded-lg bg-light-blue-gray/10 dark:bg-royal-blue/10">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {avatars.map((avatar) => (
              <button
                key={avatar.id}
                type="button"
                onClick={() => {
                  onAvatarSelect(avatar.src)
                  setIsOpen(false)
                }}
                className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all hover:scale-105 ${
                  selectedAvatar === avatar.src
                    ? "border-royal-blue ring-2 ring-royal-blue/20"
                    : "border-light-blue-gray/20 dark:border-royal-blue/30 hover:border-royal-blue/50"
                }`}
              >
                <Image
                  src={avatar.src || "/placeholder.svg"}
                  alt={avatar.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="mt-3 text-sm text-primary-text/70 dark:text-dark-base-text/70 hover:text-primary-text dark:hover:text-dark-base-text transition-colors"
          >
            Fermer la sélection
          </button>
        </div>
      )}

      {/* Message d'erreur */}
      {error && <p className="text-sm text-soft-error-red">{error}</p>}
    </div>
  )
}
