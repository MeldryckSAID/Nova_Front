"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Sun, Moon } from "lucide-react"
import { Logo } from "../atoms/Logo"

export function ScrollHeader() {
  const [theme, setTheme] = useState("light")
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  return (
    <>
      {/* Header principal */}
      <header className="bg-royal-blue px-6 py-4 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="transition-all duration-300 hover:scale-110 hover:z-50 relative">
            <Logo />
          </div>
          <nav className="flex items-center space-x-2">
            <Link
              href="/"
              className="text-white hover:text-white transition-all duration-300 px-3 py-2 rounded-lg hover:scale-105 hover:z-50 relative hover:bg-white/30 hover:shadow-lg hover:mx-1"
            >
              Home
            </Link>
            <Link
              href="/helper"
              className="text-white hover:text-white transition-all duration-300 px-3 py-2 rounded-lg hover:scale-105 hover:z-50 relative hover:bg-white/30 hover:shadow-lg hover:mx-1"
            >
              Helpers
            </Link>
            {user ? (
              <>
                {user.userType === "helper" ? (
                  <Link
                    href="/helper-dashboard"
                    className="text-white hover:text-white transition-all duration-300 px-3 py-2 rounded-lg hover:scale-105 hover:z-50 relative hover:bg-white/30 hover:shadow-lg hover:mx-1"
                  >
                    Dashboard Helper
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="text-white hover:text-white transition-all duration-300 px-3 py-2 rounded-lg hover:scale-105 hover:z-50 relative hover:bg-white/30 hover:shadow-lg hover:mx-1"
                  >
                    Dashboard
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  href="/connexion"
                  className="text-white hover:text-white transition-all duration-300 px-3 py-2 rounded-lg hover:scale-105 hover:z-50 relative hover:bg-white/30 hover:shadow-lg hover:mx-1"
                >
                  Connexion
                </Link>
                <Link
                  href="/helper-signup"
                  className="text-white hover:text-white transition-all duration-300 px-3 py-2 rounded-lg hover:scale-105 hover:z-50 relative hover:bg-white/30 hover:shadow-lg hover:mx-1"
                >
                  Devenir Helper
                </Link>
              </>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/10 hover:bg-white/30 transition-all duration-300 hover:scale-110 hover:z-50 relative hover:shadow-lg hover:mx-1"
            >
              {theme === "light" ? <Moon className="w-5 h-5 text-white" /> : <Sun className="w-5 h-5 text-white" />}
            </button>
          </nav>
        </div>
      </header>

      {/* Header sticky */}
      {isScrolled && (
        <header className="fixed top-0 left-0 right-0 z-50 px-6 py-3 bg-royal-blue/95 backdrop-blur-md shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="transition-all duration-300 hover:scale-110 hover:z-[60] relative">
              <Logo />
            </div>
            <nav className="flex items-center space-x-2">
              <Link
                href="/"
                className="text-white hover:text-white text-sm transition-all duration-300 px-3 py-2 rounded-lg hover:scale-105 hover:z-[60] relative hover:bg-white/30 hover:shadow-lg hover:mx-1"
              >
                Home
              </Link>
              <Link
                href="/helper"
                className="text-white hover:text-white text-sm transition-all duration-300 px-3 py-2 rounded-lg hover:scale-105 hover:z-[60] relative hover:bg-white/30 hover:shadow-lg hover:mx-1"
              >
                Helpers
              </Link>
              {user ? (
                <>
                  {user.userType === "helper" ? (
                    <Link
                      href="/helper-dashboard"
                      className="text-white hover:text-white text-sm transition-all duration-300 px-3 py-2 rounded-lg hover:scale-105 hover:z-[60] relative hover:bg-white/30 hover:shadow-lg hover:mx-1"
                    >
                      Dashboard Helper
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard"
                      className="text-white hover:text-white text-sm transition-all duration-300 px-3 py-2 rounded-lg hover:scale-105 hover:z-[60] relative hover:bg-white/30 hover:shadow-lg hover:mx-1"
                    >
                      Dashboard
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link
                    href="/connexion"
                    className="text-white hover:text-white text-sm transition-all duration-300 px-3 py-2 rounded-lg hover:scale-105 hover:z-[60] relative hover:bg-white/30 hover:shadow-lg hover:mx-1"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/helper-signup"
                    className="text-white hover:text-white text-sm transition-all duration-300 px-3 py-2 rounded-lg hover:scale-105 hover:z-[60] relative hover:bg-white/30 hover:shadow-lg hover:mx-1"
                  >
                    Devenir Helper
                  </Link>
                </>
              )}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-white/10 hover:bg-white/30 transition-all duration-300 hover:scale-110 hover:z-[60] relative hover:shadow-lg hover:mx-1"
              >
                {theme === "light" ? <Moon className="w-4 h-4 text-white" /> : <Sun className="w-4 h-4 text-white" />}
              </button>
            </nav>
          </div>
        </header>
      )}
    </>
  )
}
