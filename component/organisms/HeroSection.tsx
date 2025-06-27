"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section className="bg-royal-blue text-white py-20 min-h-[80vh] flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        <div>
          <div className="flex items-center mb-6">
            <Image src="/images/nova_logo.svg" alt="NOVA Logo" width={320} height={320} className="w-80 h-80 mr-6" />
          </div>
          <div className="text-3xl space-y-3 mb-8">
            <p className="transform transition-all duration-500 hover:translate-x-2 hover:text-white">Apprendre</p>
            <p className="transform transition-all duration-500 hover:translate-x-2 hover:text-white">Echanger</p>
            <p className="transform transition-all duration-500 hover:translate-x-2 hover:text-white">Progresser</p>
          </div>
          <p className="text-xl text-blue-200 mb-8 max-w-lg">
            Rejoignez notre communauté d'apprentissage et progressez avec l'aide de nos experts.
          </p>
          <Link href="/connexion">
            <button className="bg-white text-royal-blue px-8 py-3 rounded-lg font-semibold hover:bg-light-blue-gray/90 hover:text-royal-blue transition-all transform hover:scale-105 shadow-lg border border-white/20">
              Commencer maintenant
            </button>
          </Link>
        </div>

        <div className="flex justify-center">
          <div
            className="relative transform transition-transform duration-300 ease-out"
            style={{
              transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.05)`,
            }}
          >
            <div className="relative">
              {/* Effet de glow derrière l'image */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-blue-300/20 rounded-3xl blur-xl scale-110"></div>

              {/* Container principal */}
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
                {/* Si l'image ne charge pas, on affiche un fallback */}
                {!imageLoaded && (
                  <div className="w-full h-80 max-w-md mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-6xl mb-4">📚</div>
                      <h3 className="text-xl font-semibold mb-2">Apprentissage en ligne</h3>
                      <p className="text-blue-100">Connectez-vous avec nos experts</p>
                    </div>
                  </div>
                )}

                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Illu-xvQpKOOL5HUSHxiKJM3Se1fyHY5NzE.png"
                  alt="Illustration d'apprentissage en ligne"
                  className={`w-full h-auto max-w-md mx-auto transition-opacity duration-500 ${
                    imageLoaded ? "opacity-100" : "opacity-0 absolute inset-0"
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(false)}
                  style={{ maxWidth: "400px" }}
                />
              </div>

              {/* Particules flottantes - PLUS DE JAUNE */}
              <div className="absolute -top-4 -left-4 w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <div className="absolute -bottom-6 -right-6 w-4 h-4 bg-blue-300 rounded-full animate-bounce"></div>
              <div className="absolute top-1/2 -left-8 w-2 h-2 bg-white rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
