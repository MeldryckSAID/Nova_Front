"use client"

import { useEffect, useCallback } from "react"

interface SyncData {
  id: string
  type: string
  data: any
  timestamp: number
}

export function useBackgroundSync() {
  // Ajouter des données à synchroniser
  const addToSyncQueue = useCallback(async (type: string, data: any) => {
    const syncItem: SyncData = {
      id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: Date.now(),
    }

    try {
      // Stocker en localStorage (en attendant IndexedDB)
      const existingQueue = JSON.parse(localStorage.getItem("syncQueue") || "[]")
      existingQueue.push(syncItem)
      localStorage.setItem("syncQueue", JSON.stringify(existingQueue))

      // Déclencher la synchronisation si en ligne
      if (navigator.onLine && "serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready
        if ("sync" in registration) {
          await registration.sync.register("background-sync")
          console.log("🔄 Background sync enregistré")
        }
      }

      return syncItem.id
    } catch (error) {
      console.error("Erreur lors de l'ajout à la queue de sync:", error)
      return null
    }
  }, [])

  // Traiter la queue de synchronisation
  const processSyncQueue = useCallback(async () => {
    try {
      const syncQueue: SyncData[] = JSON.parse(localStorage.getItem("syncQueue") || "[]")

      if (syncQueue.length === 0) return

      console.log("📤 Traitement de la queue de sync:", syncQueue.length, "éléments")

      const processedIds: string[] = []

      for (const item of syncQueue) {
        try {
          // Simuler l'envoi au serveur
          await simulateServerSync(item)
          processedIds.push(item.id)
          console.log("✅ Sync réussie pour:", item.type, item.id)
        } catch (error) {
          console.error("❌ Échec sync pour:", item.type, item.id, error)
          // Garder l'élément dans la queue pour retry
        }
      }

      // Supprimer les éléments traités avec succès
      if (processedIds.length > 0) {
        const remainingQueue = syncQueue.filter((item) => !processedIds.includes(item.id))
        localStorage.setItem("syncQueue", JSON.stringify(remainingQueue))
        console.log("🗑️ Supprimé", processedIds.length, "éléments de la queue")
      }
    } catch (error) {
      console.error("Erreur lors du traitement de la queue:", error)
    }
  }, [])

  // Simuler l'envoi au serveur (à remplacer par de vrais appels API)
  const simulateServerSync = async (item: SyncData): Promise<void> => {
    // Simulation d'un délai réseau
    await new Promise((resolve) => setTimeout(resolve, 1000))

    switch (item.type) {
      case "booking":
        console.log("📅 Sync booking:", item.data)
        break
      case "message":
        console.log("💬 Sync message:", item.data)
        break
      case "profile":
        console.log("👤 Sync profile:", item.data)
        break
      default:
        console.log("📦 Sync data:", item.type, item.data)
    }
  }

  // Obtenir le statut de la queue
  const getSyncQueueStatus = useCallback(() => {
    const syncQueue: SyncData[] = JSON.parse(localStorage.getItem("syncQueue") || "[]")
    return {
      count: syncQueue.length,
      oldestItem: syncQueue.length > 0 ? syncQueue[0] : null,
      types: [...new Set(syncQueue.map((item) => item.type))],
    }
  }, [])

  // Vider la queue manuellement
  const clearSyncQueue = useCallback(() => {
    localStorage.setItem("syncQueue", "[]")
    console.log("🗑️ Queue de sync vidée manuellement")
  }, [])

  useEffect(() => {
    // Traiter la queue quand on revient en ligne
    const handleOnline = () => {
      console.log("🌐 Connexion rétablie, traitement de la queue...")
      processSyncQueue()
    }

    window.addEventListener("online", handleOnline)

    // Traiter la queue au chargement si en ligne
    if (navigator.onLine) {
      processSyncQueue()
    }

    return () => {
      window.removeEventListener("online", handleOnline)
    }
  }, [processSyncQueue])

  return {
    addToSyncQueue,
    processSyncQueue,
    getSyncQueueStatus,
    clearSyncQueue,
  }
}
