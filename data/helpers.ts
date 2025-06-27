export interface Helper {
  id: string
  name: string
  title: string
  specialty: string
  status: "available" | "busy" | "offline"
  rating: number
  schedule: string
  peopleHelped: number
  avatar: string
  description: string
  availability: string[]
  hourlyRate?: number
  languages: string[]
  experience: number
}

export const helpers: Helper[] = [
  {
    id: "1",
    name: "Jeremie Malcom",
    title: "Math Expert",
    specialty: "Développement",
    status: "available",
    rating: 4.5,
    schedule: "19H-21H",
    peopleHelped: 10,
    avatar: "/images/avatars/guy-1.svg",
    description:
      "Bonjour moi c'est jérémie comment puis je t'aider et bien en planifiant un plan d'action afin de t'aider a t'organiser ta façon de coder etc a tout suite",
    availability: [
      "11/06/2025 : 19H à 22H",
      "14/06/2025 : 19H à 22H",
      "25/06/2025 : 19H à 22H",
      "1/07/2025 : 19H à 22H",
    ],
    hourlyRate: 25,
    languages: ["Français", "Anglais"],
    experience: 3,
  },
  {
    id: "2",
    name: "David",
    title: "Code Mentor",
    specialty: "Programmation",
    status: "available",
    rating: 4.8,
    schedule: "14H-18H",
    peopleHelped: 25,
    avatar: "/images/avatars/guy-2.svg",
    description:
      "Développeur full-stack avec 5 ans d'expérience. Je peux t'aider avec JavaScript, React, Node.js et bien plus encore. Mon approche est pratique et orientée projet.",
    availability: ["12/06/2025 : 14H à 18H", "15/06/2025 : 14H à 18H", "18/06/2025 : 14H à 18H"],
    hourlyRate: 30,
    languages: ["Français", "Anglais"],
    experience: 5,
  },
  {
    id: "3",
    name: "Mike",
    title: "Language Pro",
    specialty: "Langues",
    status: "busy",
    rating: 4.2,
    schedule: "10H-12H",
    peopleHelped: 15,
    avatar: "/images/avatars/guy-3.svg",
    description:
      "Professeur de langues passionné. Je propose des cours d'anglais, d'espagnol et de français. Méthode interactive et personnalisée selon tes besoins.",
    availability: ["13/06/2025 : 10H à 12H", "16/06/2025 : 10H à 12H"],
    hourlyRate: 20,
    languages: ["Français", "Anglais", "Espagnol"],
    experience: 4,
  },
  {
    id: "4",
    name: "Sarah",
    title: "Science Helper",
    specialty: "Sciences",
    status: "available",
    rating: 4.7,
    schedule: "16H-20H",
    peopleHelped: 30,
    avatar: "/images/avatars/woman-2.svg",
    description:
      "Doctorante en physique, je t'aide en mathématiques, physique et chimie. Pédagogie adaptée à tous les niveaux, du collège au supérieur.",
    availability: ["15/06/2025 : 16H à 20H", "17/06/2025 : 16H à 20H", "20/06/2025 : 16H à 20H"],
    hourlyRate: 35,
    languages: ["Français", "Anglais"],
    experience: 6,
  },
  {
    id: "5",
    name: "Emma",
    title: "Art Teacher",
    specialty: "Arts plastiques",
    status: "available",
    rating: 4.6,
    schedule: "15H-18H",
    peopleHelped: 18,
    avatar: "/images/avatars/woman-3.svg",
    description:
      "Artiste et professeure d'arts plastiques. Je t'accompagne dans tes projets créatifs et t'aide à développer ta technique artistique.",
    availability: ["16/06/2025 : 15H à 18H", "19/06/2025 : 15H à 18H"],
    hourlyRate: 28,
    languages: ["Français"],
    experience: 4,
  },
  {
    id: "6",
    name: "Lucas",
    title: "Music Coach",
    specialty: "Musique",
    status: "available",
    rating: 4.4,
    schedule: "17H-20H",
    peopleHelped: 22,
    avatar: "/images/avatars/guy-4.svg",
    description:
      "Musicien professionnel et professeur de musique. Piano, guitare, solfège... Je t'aide à progresser dans la musique qui te passionne.",
    availability: ["17/06/2025 : 17H à 20H", "20/06/2025 : 17H à 20H"],
    hourlyRate: 32,
    languages: ["Français", "Anglais"],
    experience: 7,
  },
]

export function getHelperById(id: string): Helper | undefined {
  return helpers.find((helper) => helper.id === id)
}
