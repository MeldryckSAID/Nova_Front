"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ScrollHeader } from "../../components/organisms/ScrollHeader"
import { Footer } from "../../components/organisms/Footer"
import { Avatar } from "../../components/atoms/Avatar"
import { BookingModal } from "../../components/molecules/BookingModal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Helper, BookingRequest } from "../../types"

// Helpers par défaut + ceux ajoutés dynamiquement
const defaultHelpers: Helper[] = [
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
  },
]

export default function HelperListPage() {
  const [helpers, setHelpers] = useState<Helper[]>([])
  const [filteredHelpers, setFilteredHelpers] = useState<Helper[]>([])
  const [specialtyFilter, setSpecialtyFilter] = useState("all")
  const [dayFilter, setDayFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // Charger les helpers (par défaut + ceux ajoutés)
    const savedHelpers = JSON.parse(localStorage.getItem("helpers") || "[]")
    const allHelpers = [...defaultHelpers, ...savedHelpers]
    setHelpers(allHelpers)
    setFilteredHelpers(allHelpers)
  }, [])

  useEffect(() => {
    // Filtrer les helpers
    let filtered = helpers

    if (specialtyFilter !== "all") {
      filtered = filtered.filter((helper) =>
        helper.specialties.some((specialty) => specialty.toLowerCase().includes(specialtyFilter.toLowerCase())),
      )
    }

    if (dayFilter !== "all") {
      filtered = filtered.filter((helper) => helper.timeSlots.some((slot) => slot.day === dayFilter))
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (helper) =>
          helper.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          helper.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    setFilteredHelpers(filtered)
  }, [helpers, specialtyFilter, dayFilter, searchTerm])

  const handleBookingSubmit = (booking: Omit<BookingRequest, "id" | "createdAt">) => {
    const newBooking: BookingRequest = {
      ...booking,
      id: `booking-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }

    // Sauvegarder la réservation
    const existingBookings = JSON.parse(localStorage.getItem("bookingRequests") || "[]")
    localStorage.setItem("bookingRequests", JSON.stringify([...existingBookings, newBooking]))

    alert("Demande de réservation envoyée ! Le helper vous répondra bientôt.")
  }

  // Obtenir toutes les spécialités uniques
  const allSpecialties = Array.from(new Set(helpers.flatMap((helper) => helper.specialties))).sort()

  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]

  return (
    <div className="min-h-screen flex flex-col bg-alt-background dark:bg-dark-background">
      <ScrollHeader />
      <main className="flex-1">
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-royal-blue dark:text-white mb-4">Nos Helpers</h1>
              <p className="text-primary-text/70 dark:text-dark-base-text/70 max-w-2xl mx-auto">
                Découvrez tous nos experts disponibles pour vous accompagner dans votre apprentissage.
              </p>
            </div>

            {/* Filtres */}
            <Card className="mb-8 bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30">
              <CardHeader>
                <CardTitle className="text-primary-text dark:text-dark-base-text">Filtrer les helpers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="search" className="text-primary-text dark:text-dark-base-text">
                      Rechercher
                    </Label>
                    <Input
                      id="search"
                      placeholder="Nom ou spécialité..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30 text-primary-text dark:text-dark-base-text placeholder:text-primary-text/50 dark:placeholder:text-dark-base-text/50 focus:border-royal-blue focus:ring-royal-blue/20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="specialty" className="text-primary-text dark:text-dark-base-text">
                      Spécialité
                    </Label>
                    <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                      <SelectTrigger className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30 text-primary-text dark:text-dark-base-text focus:border-royal-blue focus:ring-royal-blue/20">
                        <SelectValue placeholder="Toutes les spécialités" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30">
                        <SelectItem
                          value="all"
                          className="text-primary-text dark:text-dark-base-text hover:bg-royal-blue/10 dark:hover:bg-royal-blue/20 focus:bg-royal-blue/10 dark:focus:bg-royal-blue/20 data-[highlighted]:bg-royal-blue/10 dark:data-[highlighted]:bg-royal-blue/20"
                        >
                          Toutes les spécialités
                        </SelectItem>
                        {allSpecialties.map((specialty) => (
                          <SelectItem
                            key={specialty}
                            value={specialty}
                            className="text-primary-text dark:text-dark-base-text hover:bg-royal-blue/10 dark:hover:bg-royal-blue/20 focus:bg-royal-blue/10 dark:focus:bg-royal-blue/20 data-[highlighted]:bg-royal-blue/10 dark:data-[highlighted]:bg-royal-blue/20"
                          >
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="day" className="text-primary-text dark:text-dark-base-text">
                      Jour disponible
                    </Label>
                    <Select value={dayFilter} onValueChange={setDayFilter}>
                      <SelectTrigger className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30 text-primary-text dark:text-dark-base-text focus:border-royal-blue focus:ring-royal-blue/20">
                        <SelectValue placeholder="Tous les jours" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30">
                        <SelectItem
                          value="all"
                          className="text-primary-text dark:text-dark-base-text hover:bg-royal-blue/10 dark:hover:bg-royal-blue/20 focus:bg-royal-blue/10 dark:focus:bg-royal-blue/20 data-[highlighted]:bg-royal-blue/10 dark:data-[highlighted]:bg-royal-blue/20"
                        >
                          Tous les jours
                        </SelectItem>
                        {days.map((day) => (
                          <SelectItem
                            key={day}
                            value={day}
                            className="text-primary-text dark:text-dark-base-text hover:bg-royal-blue/10 dark:hover:bg-royal-blue/20 focus:bg-royal-blue/10 dark:focus:bg-royal-blue/20 data-[highlighted]:bg-royal-blue/10 dark:data-[highlighted]:bg-royal-blue/20"
                          >
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSpecialtyFilter("all")
                        setDayFilter("all")
                        setSearchTerm("")
                      }}
                      className="w-full bg-white dark:bg-blue-gray-dark border-royal-blue/30 dark:text-white text-royal-blue hover:bg-royal-blue/10 dark:hover:bg-royal-blue/20 dark:hover:text-white hover:text-royal-blue focus-visible:ring-royal-blue/50"
                    >
                      Réinitialiser
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Liste des helpers */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHelpers.map((helper) => (
                <Card
                  key={helper.id}
                  className="hover:shadow-lg transition-shadow bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30"
                >
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <Avatar src={helper.avatar} alt={helper.name} size="lg" />
                    </div>
                    <CardTitle className="text-xl text-primary-text dark:text-dark-base-text">{helper.name}</CardTitle>
                    <div className="flex justify-center space-x-2">
                      <Badge
                        className={
                          helper.status === "available"
                            ? "bg-success-green text-white"
                            : "bg-royal-blue/20 text-royal-blue"
                        }
                      >
                        {helper.status === "available" ? "Disponible" : "Occupé"}
                      </Badge>
                      {helper.rating && (
                        <Badge className="bg-royal-blue text-white border-royal-blue/20">⭐ {helper.rating}</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-primary-text dark:text-dark-base-text">Spécialités</h4>
                      <div className="flex flex-wrap gap-1">
                        {helper.specialties.slice(0, 3).map((specialty, index) => (
                          <span
                            key={index}
                            className="inline-block px-3 py-1 bg-royal-blue text-white border border-royal-blue/20 rounded-full text-xs"
                          >
                            {specialty}
                          </span>
                        ))}
                        {helper.specialties.length > 3 && (
                          <span className="inline-block px-3 py-1 bg-royal-blue text-white border border-royal-blue/20 rounded-full text-xs">
                            +{helper.specialties.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 text-primary-text dark:text-dark-base-text">Disponibilités</h4>
                      <div className="space-y-1">
                        {helper.timeSlots.slice(0, 2).map((slot) => (
                          <div key={slot.id} className="text-sm text-primary-text/70 dark:text-dark-base-text/70">
                            {slot.day} : {slot.startTime} - {slot.endTime}
                          </div>
                        ))}
                        {helper.timeSlots.length > 2 && (
                          <div className="text-sm text-primary-text/50 dark:text-dark-base-text/50">
                            +{helper.timeSlots.length - 2} autres créneaux
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Link href={`/helper/${helper.id}`} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full bg-white dark:bg-blue-gray-dark border-royal-blue text-royal-blue hover:bg-royal-blue hover:text-white hover:border-royal-blue transition-all duration-200"
                        >
                          Voir le profil
                        </Button>
                      </Link>

                      {helper.timeSlots.length > 0 && (
                        <BookingModal helper={helper} onBookingSubmit={handleBookingSubmit}>
                          <Button className="flex-1 bg-royal-blue hover:bg-royal-blue/90 text-white">Réserver</Button>
                        </BookingModal>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredHelpers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-primary-text/70 dark:text-dark-base-text/70 text-lg">
                  Aucun helper trouvé avec ces critères.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSpecialtyFilter("all")
                    setDayFilter("all")
                    setSearchTerm("")
                  }}
                  className="mt-4 bg-white dark:bg-blue-gray-dark border-royal-blue/30 text-royal-blue hover:bg-royal-blue/10 dark:hover:bg-royal-blue/20"
                >
                  Voir tous les helpers
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
