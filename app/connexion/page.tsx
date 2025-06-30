"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ScrollHeader } from "../../components/organisms/ScrollHeader"
import { Footer } from "../../components/organisms/Footer"
import { MultiSelect } from "../../components/molecules/MultiSelect"
import { AvatarSelector } from "../../components/molecules/AvatarSelector"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

const categoriesOptions = 

export default function ConnexionPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    needs: "",
    specialties: [] as string[],
    avatar: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (field: string) => (value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!isLogin && formData.specialties.length === 0) {
      setError("Veuillez sélectionner au moins une spécialité")
      return false
    }
    if (!isLogin && formData.specialties.length > 5) {
      setError("Vous ne pouvez sélectionner que 5 spécialités maximum")
      return false
    }
    if (!isLogin && !formData.avatar) {
      setError("Veuillez choisir un avatar")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) return

    setLoading(true)

    try {
      if (isLogin) {
        // Vérifier les comptes de test
        const testAccounts = [
          { email: "rachel@example.com", type: "student" },
          { email: "jeremie@example.com", type: "helper" },
          { email: "david@example.com", type: "helper" },
        ]

        const account = testAccounts.find((acc) => acc.email === formData.email)

        if (account && formData.password === "password") {
          const mockUser = {
            id: account.email === "rachel@example.com" ? "user-1" : account.email === "jeremie@example.com" ? "1" : "2",
            name:
              account.email === "rachel@example.com"
                ? "Rachel"
                : account.email === "jeremie@example.com"
                  ? "Jeremie Malcom"
                  : "David",
            email: formData.email,
            avatar:
              account.email === "rachel@example.com"
                ? "/images/avatars/woman-1.svg"
                : account.email === "jeremie@example.com"
                  ? "/images/avatars/guy-1.svg"
                  : "/images/avatars/guy-2.svg",
            userType: account.type,
            ...(account.type === "student" && {
              needs:
                "Je recherche un helper compréhensif et disponible lors des après midi pour m'aider sur un sujet sur la comptabilité.",
              specialties: ["Comptabilité", "Économie"],
              contactedHelpers: ["1", "2", "4"],
            }),
            ...(account.type === "helper" && {
              specialties:
                account.email === "jeremie@example.com"
                  ? ["Développement", "Programmation"]
                  : ["Programmation", "Informatique"],
              timeSlots:
                account.email === "jeremie@example.com"
                  ? [
                      { id: "slot-1", day: "Lundi", startTime: "19:00", endTime: "21:00", isRecurring: true },
                      { id: "slot-2", day: "Mercredi", startTime: "19:00", endTime: "21:00", isRecurring: true },
                    ]
                  : [
                      { id: "slot-3", day: "Mardi", startTime: "14:00", endTime: "18:00", isRecurring: true },
                      { id: "slot-4", day: "Jeudi", startTime: "14:00", endTime: "18:00", isRecurring: true },
                    ],
              description:
                account.email === "jeremie@example.com"
                  ? "Développeur expérimenté spécialisé en JavaScript et React"
                  : "Full-stack developer avec 5 ans d'expérience",
              rating: account.email === "jeremie@example.com" ? 4.5 : 4.8,
              totalSessions: account.email === "jeremie@example.com" ? 10 : 25,
              status: "available",
            }),
          }

          localStorage.setItem("user", JSON.stringify(mockUser))

          if (account.type === "helper") {
            router.push("/helper-dashboard")
          } else {
            router.push("/dashboard")
          }
        } else {
          setError("Identifiants incorrects")
        }
      } else {
        const newUser = {
          id: `user-${Date.now()}`,
          name: formData.name,
          email: formData.email,
          avatar: formData.avatar,
          needs: formData.needs || "",
          specialties: formData.specialties,
          contactedHelpers: [],
          userType: "student",
        }
        localStorage.setItem("user", JSON.stringify(newUser))
        router.push("/dashboard")
      }
    } catch (err) {
      setError("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-alt-background dark:bg-dark-background">
      <ScrollHeader />
      <main className="flex-1">
        <div className="py-16 min-h-screen flex items-center">
          <div className="max-w-lg mx-auto w-full px-6">
            <Card className="shadow-lg bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30">
              <CardHeader>
                <CardTitle className="text-center text-primary-text dark:text-dark-base-text">
                  {isLogin ? "Connexion" : "Inscription"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert
                    variant="destructive"
                    className="mb-4 bg-soft-error-red/10 border-soft-error-red/20 text-soft-error-red"
                  >
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {!isLogin && (
                    <>
                      <div>
                        <Label htmlFor="name" className="text-primary-text dark:text-dark-base-text">
                          Nom complet *
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleChange("name")(e.target.value)}
                          required={!isLogin}
                          className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30 text-primary-text dark:text-dark-base-text"
                        />
                      </div>

                      <AvatarSelector
                        label="Choisissez votre avatar"
                        selectedAvatar={formData.avatar}
                        onAvatarSelect={handleChange("avatar")}
                        error={!formData.avatar ? "Veuillez choisir un avatar" : undefined}
                      />
                    </>
                  )}

                  <div>
                    <Label htmlFor="email" className="text-primary-text dark:text-dark-base-text">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email")(e.target.value)}
                      required
                      className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30 text-primary-text dark:text-dark-base-text"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-primary-text dark:text-dark-base-text">
                      Mot de passe *
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleChange("password")(e.target.value)}
                      required
                      className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30 text-primary-text dark:text-dark-base-text"
                    />
                  </div>

                  {!isLogin && (
                    <>
                      <div>
                        <Label htmlFor="needs" className="text-primary-text dark:text-dark-base-text">
                          Vos besoins (facultatif)
                        </Label>
                        <Textarea
                          id="needs"
                          value={formData.needs}
                          onChange={(e) => handleChange("needs")(e.target.value)}
                          rows={3}
                          placeholder="Décrivez vos besoins d'apprentissage..."
                          className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30 text-primary-text dark:text-dark-base-text"
                        />
                      </div>

                      <MultiSelect
                        label="Spécialités d'intérêt *"
                        options={categoriesOptions}
                        selected={formData.specialties}
                        onChange={handleChange("specialties")}
                        placeholder="Sélectionnez vos domaines d'intérêt..."
                        minSelection={1}
                        maxSelection={5}
                        error={formData.specialties.length === 0 ? "Sélectionnez au moins une spécialité" : undefined}
                      />
                    </>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-royal-blue hover:bg-royal-blue/90 text-white"
                    disabled={
                      loading ||
                      (!isLogin && (formData.specialties.length === 0 || !formData.avatar || !formData.name.trim()))
                    }
                  >
                    {loading ? "..." : isLogin ? "Se connecter" : "S'inscrire"}
                  </Button>
                </form>

                <div className="text-center mt-6">
                  <Button
                    variant="link"
                    onClick={() => {
                      setIsLogin(!isLogin)
                      setError("")
                      setFormData({ email: "", password: "", name: "", needs: "", specialties: [], avatar: "" })
                    }}
                    className="text-royal-blue hover:text-royal-blue/80"
                  >
                    {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
                  </Button>
                </div>

                {isLogin && (
                  <Alert className="mt-4 bg-royal-blue/5 border-royal-blue/20">
                    <AlertDescription className="text-sm space-y-3">
                      <div className="font-semibold text-center text-royal-blue">
                        🎯 Comptes de test avec scénarios :
                      </div>

                      <div className="space-y-2">
                        <div className="p-2 bg-royal-blue/10 rounded">
                          <strong className="text-royal-blue">👩‍🎓 Rachel (Student) :</strong> rachel@example.com /
                          password
                          <div className="text-xs text-primary-text/70 dark:text-dark-base-text/70 mt-1">
                            • 1 demande en attente avec David (à accepter)
                            <br />• 1 session confirmée avec Jérémie (accès visio + chat)
                          </div>
                        </div>

                        <div className="p-2 bg-success-green/10 rounded">
                          <strong className="text-success-green">👨‍💻 Jérémie (Helper) :</strong> jeremie@example.com /
                          password
                          <div className="text-xs text-primary-text/70 dark:text-dark-base-text/70 mt-1">
                            • 1 session confirmée avec Rachel (accès visio + chat)
                          </div>
                        </div>

                        <div className="p-2 bg-royal-blue/10 rounded">
                          <strong className="text-royal-blue">👨‍💻 David (Helper) :</strong> david@example.com /
                          password
                          <div className="text-xs text-primary-text/70 dark:text-dark-base-text/70 mt-1">
                            • 1 demande en attente de Rachel (à accepter/refuser)
                          </div>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
