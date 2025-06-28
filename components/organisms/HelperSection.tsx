import Link from "next/link"
import { Avatar } from "../atoms/Avatar"

const helpers = [
  {
    id: "1",
    name: "Jeremie Malcom",
    title: "Math Expert",
    specialty: "Développement",
    status: "available" as const,
    avatar: "/images/avatars/guy-1.svg",
  },
  {
    id: "2",
    name: "David",
    title: "Code Mentor",
    specialty: "Programmation",
    status: "available" as const,
    avatar: "/images/avatars/guy-2.svg",
  },
  {
    id: "3",
    name: "Mike",
    title: "Language Pro",
    specialty: "Langues",
    status: "busy" as const,
    avatar: "/images/avatars/guy-3.svg",
  },
  {
    id: "4",
    name: "Sarah",
    title: "Science Helper",
    specialty: "Sciences",
    status: "available" as const,
    avatar: "/images/avatars/woman-2.svg",
  },
  {
    id: "5",
    name: "Emma",
    title: "Art Teacher",
    specialty: "Arts plastiques",
    status: "available" as const,
    avatar: "/images/avatars/woman-3.svg",
  },
  {
    id: "6",
    name: "Lucas",
    title: "Music Coach",
    specialty: "Musique",
    status: "available" as const,
    avatar: "/images/avatars/guy-4.svg",
  },
]

export function HelperSection() {
  return (
    <section className="py-16 min-h-screen bg-alt-background dark:bg-dark-background">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-royal-blue dark:text-white mb-4">Helper disponible</h2>
        <p className="text-center text-primary-text dark:text-dark-base-text mb-12 max-w-2xl mx-auto">
          Découvrez nos experts disponibles pour vous accompagner dans votre apprentissage.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {helpers.map((helper) => (
            <Link key={helper.id} href={`/helper/${helper.id}`}>
              <div className="bg-white dark:bg-blue-gray-dark rounded-lg shadow-lg p-6 h-64 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group border border-light-blue-gray/20 dark:border-royal-blue/30">
                <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                  <div className="relative">
                    <Avatar src={helper.avatar} alt={helper.name} size="md" />
                    <div
                      className={`absolute -bottom-1 -right-1 w-6 h-6 ${
                        helper.status === "available" ? "bg-success-green" : "bg-desaturated-gold"
                      } rounded-full border-2 border-white dark:border-blue-gray-dark`}
                    ></div>
                  </div>

                  <div className="text-center space-y-2">
                    <h3 className="font-semibold text-primary-text dark:text-dark-base-text">{helper.name}</h3>
                    <p className="text-sm font-medium text-royal-blue dark:text-royal-blue">{helper.title}</p>
                    <p className="text-sm text-primary-text/70 dark:text-dark-base-text/70">{helper.specialty}</p>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        helper.status === "available"
                          ? "bg-success-green/10 text-success-green dark:bg-success-green/20"
                          : "bg-desaturated-gold/10 text-desaturated-gold dark:bg-desaturated-gold/20"
                      }`}
                    >
                      {helper.status === "available" ? "Disponible" : "Occupé"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
