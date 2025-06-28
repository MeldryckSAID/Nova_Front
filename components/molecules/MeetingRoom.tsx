"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "../atoms/Avatar"
import { Video, VideoOff, Mic, MicOff, Phone, MessageCircle, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface MeetingRoomProps {
  bookingId: string
  helperName: string
  helperAvatar: string
  studentName: string
  studentAvatar: string
  scheduledDate: string
  timeSlot: string
  onEndMeeting: () => void
}

export function MeetingRoom({
  bookingId,
  helperName,
  helperAvatar,
  studentName,
  studentAvatar,
  scheduledDate,
  timeSlot,
  onEndMeeting,
}: MeetingRoomProps) {
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [isAudioOn, setIsAudioOn] = useState(false)
  const [meetingStarted, setMeetingStarted] = useState(false)
  const [duration, setDuration] = useState(0)
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null)
  const [permissionError, setPermissionError] = useState<string>("")
  const [isRequestingPermissions, setIsRequestingPermissions] = useState(false)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (meetingStarted) {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [meetingStarted])

  useEffect(() => {
    // Nettoyer le stream quand le composant se démonte
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [mediaStream])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const requestMediaPermissions = async () => {
    setIsRequestingPermissions(true)
    setPermissionError("")

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      setMediaStream(stream)
      setIsVideoOn(true)
      setIsAudioOn(true)

      // Afficher le stream local dans la vidéo
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      console.log("✅ Permissions accordées - Caméra et micro activés")
    } catch (error: any) {
      console.error("❌ Erreur d'accès aux médias:", error)

      if (error.name === "NotAllowedError") {
        setPermissionError(
          "Accès refusé à la caméra/microphone. Veuillez autoriser l'accès dans les paramètres de votre navigateur.",
        )
      } else if (error.name === "NotFoundError") {
        setPermissionError("Aucune caméra ou microphone détecté sur cet appareil.")
      } else if (error.name === "NotReadableError") {
        setPermissionError("Caméra ou microphone déjà utilisé par une autre application.")
      } else {
        setPermissionError(`Erreur d'accès aux médias: ${error.message}`)
      }
    } finally {
      setIsRequestingPermissions(false)
    }
  }

  const handleStartMeeting = async () => {
    if (!mediaStream) {
      await requestMediaPermissions()
    }
    setMeetingStarted(true)
  }

  const handleEndMeeting = () => {
    // Arrêter tous les tracks du stream
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => {
        track.stop()
        console.log(`🛑 Track ${track.kind} arrêté`)
      })
      setMediaStream(null)
    }

    setMeetingStarted(false)
    setDuration(0)
    setIsVideoOn(false)
    setIsAudioOn(false)
    onEndMeeting()
  }

  const toggleVideo = () => {
    if (mediaStream) {
      const videoTrack = mediaStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn
        setIsVideoOn(!isVideoOn)
        console.log(`📹 Vidéo ${!isVideoOn ? "activée" : "désactivée"}`)
      }
    }
  }

  const toggleAudio = () => {
    if (mediaStream) {
      const audioTrack = mediaStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !isAudioOn
        setIsAudioOn(!isAudioOn)
        console.log(`🎤 Audio ${!isAudioOn ? "activé" : "désactivé"}`)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête de la réunion */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Session d'apprentissage</CardTitle>
                <p className="text-gray-400">
                  {scheduledDate} - {timeSlot}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {meetingStarted && (
                  <Badge variant="secondary" className="bg-green-600">
                    En cours - {formatDuration(duration)}
                  </Badge>
                )}
                <Badge variant="outline">ID: {bookingId.slice(-8)}</Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Erreur de permissions */}
        {permissionError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {permissionError}
              <div className="mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={requestMediaPermissions}
                  disabled={isRequestingPermissions}
                >
                  {isRequestingPermissions ? "Demande en cours..." : "Réessayer"}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Zone vidéo principale */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Vidéo locale (utilisateur actuel) */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-0">
              <div className="relative aspect-video bg-gray-700 rounded-lg overflow-hidden">
                {mediaStream && isVideoOn ? (
                  <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                    {!mediaStream ? (
                      <div className="text-center">
                        <VideoOff className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">Caméra non autorisée</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <VideoOff className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">Caméra désactivée</p>
                      </div>
                    )}
                  </div>
                )}
                <div className="absolute bottom-4 left-4">
                  <Badge variant="secondary">Vous (Local)</Badge>
                </div>
                {/* Indicateur audio */}
                <div className="absolute top-4 right-4">
                  {isAudioOn ? <Mic className="w-5 h-5 text-green-400" /> : <MicOff className="w-5 h-5 text-red-400" />}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vidéo distante (simulation) */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-0">
              <div className="relative aspect-video bg-gray-700 rounded-lg overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="text-center">
                    <Avatar src={helperAvatar} alt={helperName} size="lg" />
                    <p className="text-white mt-2 text-sm">Participant distant</p>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4">
                  <Badge variant="secondary">{helperName} (Distant)</Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Mic className="w-5 h-5 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contrôles de la réunion */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-4">
              {!meetingStarted ? (
                <Button
                  onClick={handleStartMeeting}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isRequestingPermissions}
                >
                  <Video className="w-5 h-5 mr-2" />
                  {isRequestingPermissions ? "Demande d'autorisation..." : "Démarrer la session"}
                </Button>
              ) : (
                <>
                  <Button
                    variant={isAudioOn ? "secondary" : "destructive"}
                    size="lg"
                    onClick={toggleAudio}
                    disabled={!mediaStream}
                  >
                    {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </Button>

                  <Button
                    variant={isVideoOn ? "secondary" : "destructive"}
                    size="lg"
                    onClick={toggleVideo}
                    disabled={!mediaStream}
                  >
                    {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                  </Button>

                  <Button variant="destructive" size="lg" onClick={handleEndMeeting}>
                    <Phone className="w-5 h-5 mr-2" />
                    Terminer la session
                  </Button>
                </>
              )}

              <Button variant="outline" size="lg">
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat
              </Button>
            </div>

            {/* Statut des permissions */}
            {meetingStarted && (
              <div className="mt-4 text-center text-sm text-gray-400">
                <div className="flex items-center justify-center space-x-4">
                  <span className={`flex items-center ${isVideoOn ? "text-green-400" : "text-red-400"}`}>
                    {isVideoOn ? <Video className="w-4 h-4 mr-1" /> : <VideoOff className="w-4 h-4 mr-1" />}
                    Vidéo {isVideoOn ? "activée" : "désactivée"}
                  </span>
                  <span className={`flex items-center ${isAudioOn ? "text-green-400" : "text-red-400"}`}>
                    {isAudioOn ? <Mic className="w-4 h-4 mr-1" /> : <MicOff className="w-4 h-4 mr-1" />}
                    Audio {isAudioOn ? "activé" : "désactivé"}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informations de la session */}
        <Card className="bg-gray-800 border-gray-700 mt-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <h3 className="text-lg font-semibold text-white">Helper</h3>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <Avatar src={helperAvatar} alt={helperName} size="sm" />
                  <span className="text-gray-300">{helperName}</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Student</h3>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <Avatar src={studentAvatar} alt={studentName} size="sm" />
                  <span className="text-gray-300">{studentName}</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Session</h3>
                <p className="text-gray-300 mt-2">
                  {scheduledDate}
                  <br />
                  {timeSlot}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions pour les permissions */}
        {!mediaStream && !permissionError && (
          <Card className="bg-blue-900/20 border-blue-700 mt-6">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-blue-300 mb-2">📹 Autorisations requises</h3>
                <p className="text-blue-200 text-sm">
                  Pour participer à la session, vous devez autoriser l'accès à votre caméra et microphone.
                  <br />
                  Cliquez sur "Démarrer la session" et acceptez les autorisations dans votre navigateur.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
