"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MeetingRoom } from "../../../components/molecules/MeetingRoom"
import { ChatBox } from "../../../components/molecules/ChatBox"
import type { BookingRequest, Helper } from "../../../types"

interface MeetingPageProps {
  params: { bookingId: string }
}

export default function MeetingPage({ params }: MeetingPageProps) {
  const router = useRouter()
  const [booking, setBooking] = useState<BookingRequest | null>(null)
  const [helper, setHelper] = useState<Helper | null>(null)
  const [student, setStudent] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)

  useEffect(() => {
    // Récupérer l'utilisateur connecté
    const savedUser = localStorage.getItem("user")
    if (!savedUser) {
      router.push("/connexion")
      return
    }
    setCurrentUser(JSON.parse(savedUser))

    // Récupérer la réservation
    const bookings: BookingRequest[] = JSON.parse(localStorage.getItem("bookingRequests") || "[]")
    const foundBooking = bookings.find((b) => b.id === params.bookingId)

    if (!foundBooking || foundBooking.status !== "accepted") {
      router.push("/dashboard")
      return
    }
    setBooking(foundBooking)

    // Récupérer les informations du helper
    const defaultHelpers = [
      {
        id: "1",
        name: "Jeremie Malcom",
        avatar: "/images/avatars/guy-1.svg",
        email: "jeremie@example.com",
      },
      {
        id: "2",
        name: "David",
        avatar: "/images/avatars/guy-2.svg",
        email: "david@example.com",
      },
    ]

    const savedHelpers = JSON.parse(localStorage.getItem("helpers") || "[]")
    const allHelpers = [...defaultHelpers, ...savedHelpers]
    const foundHelper = allHelpers.find((h) => h.id === foundBooking.helperId)
    setHelper(foundHelper || null)

    // Récupérer les informations du student (pour l'instant, on utilise l'utilisateur connecté)
    // Dans un vrai système, on récupérerait les infos du student via son ID
    const mockStudent = {
      id: foundBooking.studentId,
      name: "Rachel",
      avatar: "/images/avatars/woman-1.svg",
    }
    setStudent(mockStudent)
  }, [params.bookingId, router])

  const handleEndMeeting = () => {
    // Marquer la session comme terminée
    const bookings: BookingRequest[] = JSON.parse(localStorage.getItem("bookingRequests") || "[]")
    const updatedBookings = bookings.map((b) =>
      b.id === params.bookingId ? { ...b, status: "completed" as const } : b,
    )
    localStorage.setItem("bookingRequests", JSON.stringify(updatedBookings))

    // Rediriger vers le dashboard
    if (currentUser?.userType === "helper") {
      router.push("/helper-dashboard")
    } else {
      router.push("/dashboard")
    }
  }

  if (!booking || !helper || !student || !currentUser) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white">Chargement de la salle de réunion...</p>
      </div>
    )
  }

  // Récupérer les informations du créneau
  const timeSlot = helper.timeSlots?.find((slot) => slot.id === booking.timeSlotId)
  const timeSlotDisplay = timeSlot ? `${timeSlot.startTime} - ${timeSlot.endTime}` : "Créneau non défini"

  return (
    <>
      <MeetingRoom
        bookingId={booking.id}
        helperName={helper.name}
        helperAvatar={helper.avatar}
        studentName={student.name}
        studentAvatar={student.avatar}
        scheduledDate={new Date(booking.requestedDate).toLocaleDateString("fr-FR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
        timeSlot={timeSlotDisplay}
        onEndMeeting={handleEndMeeting}
      />

      <ChatBox
        bookingId={booking.id}
        currentUserId={currentUser.id}
        currentUserName={currentUser.name}
        currentUserAvatar={currentUser.avatar}
        otherUserName={currentUser.userType === "helper" ? student.name : helper.name}
        otherUserAvatar={currentUser.userType === "helper" ? student.avatar : helper.avatar}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Bouton flottant pour ouvrir le chat */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg z-40"
        >
          💬
        </button>
      )}
    </>
  )
}
