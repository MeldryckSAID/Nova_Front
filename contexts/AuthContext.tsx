"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar: string
  needs?: string
  specialties?: string[]
  contactedHelpers?: string[]
  userType?: "student" | "helper"
  timeSlots?: any[]
  description?: string
  rating?: number
  totalSessions?: number
  status?: "available" | "busy" | "offline"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<boolean>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Utilisateurs factices pour les tests
const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Rachel",
    email: "rachel@example.com",
    avatar: "/images/avatars/woman-1.svg",
    needs:
      "Je recherche un helper compréhensif et disponible lors des après midi pour m'aider sur un sujet sur la comptabilité.",
    specialties: ["Comptabilité", "Économie"],
    contactedHelpers: ["1", "2", "4"],
    userType: "student",
  },
  {
    id: "1",
    name: "Jeremie Malcom",
    email: "jeremie@example.com",
    avatar: "/images/avatars/guy-1.svg",
    specialties: ["Développement", "Programmation"],
    timeSlots: [
      { id: "slot-1", day: "Lundi", startTime: "19:00", endTime: "21:00", isRecurring: true },
      { id: "slot-2", day: "Mercredi", startTime: "19:00", endTime: "21:00", isRecurring: true },
    ],
    description: "Développeur expérimenté spécialisé en JavaScript et React",
    rating: 4.5,
    totalSessions: 10,
    status: "available",
    userType: "helper",
  },
  {
    id: "2",
    name: "David",
    email: "david@example.com",
    avatar: "/images/avatars/guy-2.svg",
    specialties: ["Programmation", "Informatique"],
    timeSlots: [
      { id: "slot-3", day: "Mardi", startTime: "14:00", endTime: "18:00", isRecurring: true },
      { id: "slot-4", day: "Jeudi", startTime: "14:00", endTime: "18:00", isRecurring: true },
    ],
    description: "Full-stack developer avec 5 ans d'expérience",
    rating: 4.8,
    totalSessions: 25,
    status: "available",
    userType: "helper",
  },
]

// Réservations de test
const mockBookings = [
  {
    id: "booking-test-1",
    studentId: "user-1",
    helperId: "2", // David
    timeSlotId: "slot-3",
    requestedDate: new Date().toISOString().split("T")[0], // Aujourd'hui
    message: "J'aimerais de l'aide en programmation JavaScript, merci !",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "booking-test-2",
    studentId: "user-1",
    helperId: "1", // Jérémie
    timeSlotId: "slot-1",
    requestedDate: new Date().toISOString().split("T")[0], // Aujourd'hui
    message: "Besoin d'aide pour un projet React, disponible aujourd'hui ?",
    status: "accepted",
    createdAt: new Date().toISOString(),
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    // Initialiser les réservations de test si elles n'existent pas
    const existingBookings = localStorage.getItem("bookingRequests")
    if (!existingBookings) {
      localStorage.setItem("bookingRequests", JSON.stringify(mockBookings))
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Vérifier dans les utilisateurs factices
    const foundUser = mockUsers.find((u) => u.email === email)

    if (foundUser && password === "password") {
      setUser(foundUser)
      localStorage.setItem("user", JSON.stringify(foundUser))

      // Initialiser les réservations de test à chaque connexion
      localStorage.setItem("bookingRequests", JSON.stringify(mockBookings))

      return true
    }

    // Vérifier dans les helpers créés dynamiquement
    const savedHelpers = JSON.parse(localStorage.getItem("helpers") || "[]")
    const foundHelper = savedHelpers.find((h: any) => h.email === email)

    if (foundHelper && password === "password") {
      setUser(foundHelper)
      localStorage.setItem("user", JSON.stringify(foundHelper))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulation d'une inscription student
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      avatar: "/images/avatars/woman-1.svg",
      contactedHelpers: [],
      userType: "student",
    }
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
    return true
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
