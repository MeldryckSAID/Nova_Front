"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ScrollHeader } from "../../components/organisms/ScrollHeader"
import { Footer } from "../../components/organisms/Footer"
import { Avatar } from "../../components/atoms/Avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Helper, BookingRequest } from "../../types"
import Image from "next/image"

export default function HelperDashboardPage() {
  const [helper, setHelper] = useState<Helper | null>(null)
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([])
  const router = useRouter()

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      if (userData.userType === "helper") {
        setHelper(userData)
        // Charger les demandes de réservation
        const requests = JSON.parse(localStorage.getItem("bookingRequests") || "[]")
        setBookingRequests(requests.filter((req: BookingRequest) => req.helperId === userData.id))
      } else {
        router.push("/connexion")
      }
    } else {
      router.push("/connexion")
    }
  }, [router])

  const handleBookingAction = (requestId: string, action: "accepted" | "rejected") => {
    const updatedRequests = bookingRequests.map((req) => (req.id === requestId ? { ...req, status: action } : req))
    setBookingRequests(updatedRequests)

    // Mettre à jour dans localStorage
    const allRequests = JSON.parse(localStorage.getItem("bookingRequests") || "[]")
    const newAllRequests = allRequests.map((req: BookingRequest) =>
      req.id === requestId ? { ...req, status: action } : req,
    )
    localStorage.setItem("bookingRequests", JSON.stringify(newAllRequests))
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!helper) return null

  const pendingRequests = bookingRequests.filter((req) => req.status === "pending")
  const acceptedRequests = bookingRequests.filter((req) => req.status === "accepted")

  return (
    <div className="min-h-screen flex flex-col bg-alt-background dark:bg-dark-background">
      <ScrollHeader />
      <main className="flex-1">
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            {/* En-tête helper */}
            <div className="flex items-center justify-between mb-8">
              <div></div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Image src="/images/nova_logo.svg" alt="NOVA Logo" width={32} height={32} className="w-8 h-8 mr-3" />
                  <h1 className="text-2xl font-bold text-primary-text dark:text-dark-base-text">
                    Dashboard Helper - {helper.name}
                  </h1>
                </div>
                <Avatar src={helper.avatar} alt={helper.name} size="lg" />
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => router.push("/helper-profile")}
                    className="bg-royal-blue hover:bg-royal-blue/90 text-white"
                  >
                    Modifier le profil
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="bg-soft-error-red hover:bg-soft-error-red/90 text-white"
                  >
                    Me déconnecter
                  </Button>
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-royal-blue">{helper.totalSessions || 0}</div>
                  <div className="text-sm text-primary-text/70 dark:text-dark-base-text/70">Sessions totales</div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-success-green">{helper.rating || 0}/5</div>
                  <div className="text-sm text-primary-text/70 dark:text-dark-base-text/70">Note moyenne</div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-royal-blue">{pendingRequests.length}</div>
                  <div className="text-sm text-primary-text/70 dark:text-dark-base-text/70">Demandes en attente</div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-royal-blue">{helper.timeSlots.length}</div>
                  <div className="text-sm text-primary-text/70 dark:text-dark-base-text/70">Créneaux définis</div>
                </CardContent>
              </Card>
            </div>

            {/* Contenu principal */}
            <Tabs defaultValue="requests" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30">
                <TabsTrigger
                  value="requests"
                  className="data-[state=active]:bg-royal-blue data-[state=active]:text-white text-primary-text dark:text-dark-base-text hover:bg-royal-blue/10 dark:hover:bg-royal-blue/20"
                >
                  Demandes de réservation
                </TabsTrigger>
                <TabsTrigger
                  value="schedule"
                  className="data-[state=active]:bg-royal-blue data-[state=active]:text-white text-primary-text dark:text-dark-base-text hover:bg-royal-blue/10 dark:hover:bg-royal-blue/20"
                >
                  Mes créneaux
                </TabsTrigger>
                <TabsTrigger
                  value="profile"
                  className="data-[state=active]:bg-royal-blue data-[state=active]:text-white text-primary-text dark:text-dark-base-text hover:bg-royal-blue/10 dark:hover:bg-royal-blue/20"
                >
                  Mon profil
                </TabsTrigger>
              </TabsList>

              <TabsContent value="requests" className="space-y-6">
                <Card className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30">
                  <CardHeader>
                    <CardTitle className="text-primary-text dark:text-dark-base-text">
                      Demandes en attente ({pendingRequests.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {pendingRequests.length > 0 ? (
                      <div className="space-y-4">
                        {pendingRequests.map((request) => (
                          <Card
                            key={request.id}
                            className="p-4 bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-primary-text dark:text-dark-base-text">
                                  Demande de réservation
                                </h4>
                                <p className="text-sm text-primary-text/70 dark:text-dark-base-text/70">
                                  Date demandée : {request.requestedDate}
                                </p>
                                {request.message && (
                                  <p className="text-sm text-primary-text/70 dark:text-dark-base-text/70 mt-2">
                                    Message : "{request.message}"
                                  </p>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleBookingAction(request.id, "accepted")}
                                  className="bg-success-green hover:bg-success-green/90 text-white"
                                >
                                  Accepter
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleBookingAction(request.id, "rejected")}
                                  className="border-soft-error-red/30 text-soft-error-red hover:bg-soft-error-red/10"
                                >
                                  Refuser
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-primary-text/70 dark:text-dark-base-text/70 text-center py-8">
                        Aucune demande en attente
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30">
                  <CardHeader>
                    <CardTitle className="text-primary-text dark:text-dark-base-text">
                      Réservations confirmées ({acceptedRequests.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {acceptedRequests.length > 0 ? (
                      <div className="space-y-4">
                        {acceptedRequests.map((request) => {
                          const timeSlot = helper.timeSlots.find((slot) => slot.id === request.timeSlotId)
                          const canJoinMeeting = request.status === "accepted"

                          return (
                            <Card
                              key={request.id}
                              className="p-4 bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-primary-text dark:text-dark-base-text">
                                    Session programmée
                                  </h4>
                                  <p className="text-sm text-primary-text/70 dark:text-dark-base-text/70">
                                    Date :{" "}
                                    {new Date(request.requestedDate).toLocaleDateString("fr-FR", {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </p>
                                  {timeSlot && (
                                    <p className="text-sm text-primary-text/70 dark:text-dark-base-text/70">
                                      Horaire : {timeSlot.startTime} - {timeSlot.endTime}
                                    </p>
                                  )}
                                  {request.message && (
                                    <p className="text-sm text-primary-text/70 dark:text-dark-base-text/70 mt-1">
                                      Message : "{request.message}"
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge className="bg-success-green text-white">Confirmée</Badge>
                                  {canJoinMeeting && (
                                    <Button
                                      size="sm"
                                      onClick={() => router.push("/")}
                                      className="bg-success-green hover:bg-success-green/90 text-white"
                                    >
                                      🎥 Bientôt disponible
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </Card>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-primary-text/70 dark:text-dark-base-text/70 text-center py-8">
                        Aucune réservation confirmée
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="schedule">
                <Card className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30">
                  <CardHeader>
                    <CardTitle className="text-primary-text dark:text-dark-base-text">
                      Mes créneaux de disponibilité
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {helper.timeSlots.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {helper.timeSlots.map((slot) => (
                          <Card
                            key={slot.id}
                            className="p-4 bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-primary-text dark:text-dark-base-text">{slot.day}</h4>
                                <p className="text-sm text-primary-text/70 dark:text-dark-base-text/70">
                                  {slot.startTime} - {slot.endTime}
                                </p>
                              </div>
                              <Badge
                                className={
                                  slot.isRecurring ? "bg-royal-blue text-white" : "bg-royal-blue/20 text-royal-blue"
                                }
                              >
                                {slot.isRecurring ? "Récurrent" : "Ponctuel"}
                              </Badge>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-primary-text/70 dark:text-dark-base-text/70 text-center py-8">
                        Aucun créneau défini. Ajoutez vos disponibilités pour recevoir des demandes.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="profile">
                <Card className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30">
                  <CardHeader>
                    <CardTitle className="text-primary-text dark:text-dark-base-text">Mon profil</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-6">
                      <Avatar src={helper.avatar} alt={helper.name} size="lg" />
                      <div>
                        <h2 className="text-2xl font-bold text-primary-text dark:text-dark-base-text">{helper.name}</h2>
                        <p className="text-primary-text/70 dark:text-dark-base-text/70">{helper.email}</p>
                        {helper.hourlyRate && (
                          <p className="text-sm text-primary-text/70 dark:text-dark-base-text/70">
                            Tarif : {helper.hourlyRate}€/heure
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-primary-text dark:text-dark-base-text">
                        Spécialités
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {helper.specialties.map((specialty, index) => (
                          <Badge key={index} className="bg-royal-blue text-white">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {helper.description && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-primary-text dark:text-dark-base-text">
                          Description
                        </h3>
                        <p className="text-primary-text/70 dark:text-dark-base-text/70">{helper.description}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
