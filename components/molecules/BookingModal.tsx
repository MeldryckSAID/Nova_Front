"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Helper, TimeSlot, BookingRequest } from "../../types"

interface BookingModalProps {
  helper: Helper
  onBookingSubmit: (booking: Omit<BookingRequest, "id" | "createdAt">) => void
  children: React.ReactNode
}

export function BookingModal({ helper, onBookingSubmit, children }: BookingModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<string>("")
  const [requestedDate, setRequestedDate] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!selectedSlot) {
      setError("Veuillez sélectionner un créneau")
      return
    }
    if (!requestedDate) {
      setError("Veuillez sélectionner une date")
      return
    }

    // Vérifier que la date est dans le futur
    const selectedDate = new Date(requestedDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      setError("Veuillez sélectionner une date future")
      return
    }

    setLoading(true)

    try {
      // Récupérer l'utilisateur connecté
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}")

      if (!currentUser.id) {
        setError("Vous devez être connecté pour réserver")
        return
      }

      const booking: Omit<BookingRequest, "id" | "createdAt"> = {
        studentId: currentUser.id,
        helperId: helper.id,
        timeSlotId: selectedSlot,
        requestedDate,
        message: message.trim() || undefined,
        status: "pending",
      }

      onBookingSubmit(booking)

      // Réinitialiser le formulaire
      setSelectedSlot("")
      setRequestedDate("")
      setMessage("")
      setIsOpen(false)
    } catch (err) {
      setError("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  // Générer les dates disponibles pour les 4 prochaines semaines
  const getAvailableDates = (timeSlot: TimeSlot) => {
    const dates = []
    const today = new Date()

    for (let i = 1; i <= 28; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      // Vérifier si le jour correspond au créneau
      const dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
      if (dayNames[date.getDay()] === timeSlot.day) {
        dates.push(date.toISOString().split("T")[0])
      }
    }

    return dates
  }

  const selectedTimeSlot = helper.timeSlots.find((slot) => slot.id === selectedSlot)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30">
        <DialogHeader>
          <DialogTitle className="text-primary-text dark:text-dark-base-text">
            Réserver un créneau avec {helper.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="bg-soft-error-red/10 border-soft-error-red/20 text-soft-error-red">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="timeSlot" className="text-primary-text dark:text-dark-base-text">
              Créneau disponible *
            </Label>
            <Select value={selectedSlot} onValueChange={setSelectedSlot}>
              <SelectTrigger className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30 text-primary-text dark:text-dark-base-text">
                <SelectValue placeholder="Choisir un créneau" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30">
                {helper.timeSlots.map((slot) => (
                  <SelectItem
                    key={slot.id}
                    value={slot.id}
                    className="text-primary-text dark:text-dark-base-text hover:bg-light-blue-gray/10 dark:hover:bg-royal-blue/10"
                  >
                    {slot.day} - {slot.startTime} à {slot.endTime}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTimeSlot && (
            <div>
              <Label htmlFor="date" className="text-primary-text dark:text-dark-base-text">
                Date souhaitée *
              </Label>
              <Select value={requestedDate} onValueChange={setRequestedDate}>
                <SelectTrigger className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30 text-primary-text dark:text-dark-base-text">
                  <SelectValue placeholder="Choisir une date" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30">
                  {getAvailableDates(selectedTimeSlot).map((date) => (
                    <SelectItem
                      key={date}
                      value={date}
                      className="text-primary-text dark:text-dark-base-text hover:bg-light-blue-gray/10 dark:hover:bg-royal-blue/10"
                    >
                      {new Date(date).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="message" className="text-primary-text dark:text-dark-base-text">
              Message (optionnel)
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Décrivez brièvement vos besoins ou questions..."
              className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30 text-primary-text dark:text-dark-base-text placeholder:text-primary-text/70 dark:placeholder:text-dark-base-text/70"
            />
          </div>

          <div className="flex space-x-2">
            <Button type="submit" disabled={loading} className="flex-1 bg-royal-blue hover:bg-royal-blue/90 text-white">
              {loading ? "Envoi..." : "Envoyer la demande"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-light-blue-gray/20 dark:border-royal-blue/30 text-primary-text dark:text-dark-base-text hover:bg-light-blue-gray/10 dark:hover:bg-royal-blue/10"
            >
              Annuler
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
