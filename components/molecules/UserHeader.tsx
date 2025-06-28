"use client"

import { useAuth } from "../../contexts/AuthContext"

export function UserHeader() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <div className="flex items-center justify-between mb-8">
      <div></div>
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-primary-text dark:text-dark-base-text">Bonjour {user.name}</h1>
        <img
          src={user.avatar || "/placeholder.svg"}
          alt={user.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-royal-blue/20"
        />
        <button
          onClick={logout}
          className="bg-soft-error-red text-white px-4 py-2 rounded-lg hover:bg-soft-error-red/90 transition-colors"
        >
          Me déconnecter
        </button>
      </div>
    </div>
  )
}
