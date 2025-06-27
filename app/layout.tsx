import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "../contexts/ThemeContext"
import { AuthProvider } from "../contexts/AuthContext"
import { PWAInstaller } from "../components/atoms/PWAInstaller"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NOVA - Apprendre Echanger Progresser",
  description: "Une application progressive pour apprendre, échanger et progresser",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <PWAInstaller />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
