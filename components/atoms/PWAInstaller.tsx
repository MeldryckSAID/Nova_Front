'use client';

import { useState, useEffect } from 'react';
import { Download, X, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showPWAStatus, setShowPWAStatus] = useState(false);
  const [cacheSize, setCacheSize] = useState(0);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia(
        '(display-mode: standalone)'
      ).matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isInWebAppiOS);
    };

    // Gérer l'événement d'installation
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstall(true);
    };

    // Vérifier les mises à jour du Service Worker
    const checkForUpdates = () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          setUpdateAvailable(true);
        });
      }
    };

    // Obtenir la taille du cache
    const getCacheSize = async () => {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = (event) => {
          if (event.data.type === 'CACHE_SIZE') {
            setCacheSize(event.data.size);
          }
        };
        navigator.serviceWorker.controller.postMessage(
          { type: 'GET_CACHE_SIZE' },
          [messageChannel.port2]
        );
      }
    };

    checkIfInstalled();
    checkForUpdates();
    getCacheSize();

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowInstall(false);
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const handleUpdate = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  const clearCache = async () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        if (event.data.type === 'CACHE_CLEARED') {
          setCacheSize(0);
          alert('Cache vidé avec succès !');
        }
      };
      navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' }, [
        messageChannel.port2,
      ]);
    }
  };

  return (
    <>
      {/* Bouton d'installation */}
      {showInstall && !isInstalled && (
        <div className="fixed bottom-4 right-4 z-50">
          <Card className="w-80 bg-white dark:bg-blue-gray-dark border-royal-blue/30 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-primary-text dark:text-dark-base-text">
                  📱 Installer NOVA
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInstall(false)}
                  className="text-primary-text dark:text-dark-base-text"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-primary-text/70 dark:text-dark-base-text/70 mb-4">
                Installez NOVA sur votre appareil pour une expérience optimale !
              </p>
              <div className="flex space-x-2">
                <Button
                  onClick={handleInstall}
                  className="flex-1 bg-royal-blue hover:bg-royal-blue/90 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Installer
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowInstall(false)}
                  className="border-royal-blue/30 text-royal-blue hover:bg-royal-blue/10"
                >
                  Plus tard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notification de mise à jour */}
      {updateAvailable && (
        <div className="fixed bottom-4 left-4 z-50">
          <Card className="w-80 bg-white dark:bg-blue-gray-dark border-royal-blue/30 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-primary-text dark:text-dark-base-text">
                    🚀 Mise à jour disponible
                  </h4>
                  <p className="text-sm text-primary-text/70 dark:text-dark-base-text/70">
                    Une nouvelle version est prête
                  </p>
                </div>
                <Button
                  onClick={handleUpdate}
                  size="sm"
                  className="bg-royal-blue hover:bg-royal-blue/90 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Mettre à jour
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bouton de statut PWA */}
      <button
        onClick={() => setShowPWAStatus(!showPWAStatus)}
        className="fixed bottom-4 left-4 bg-royal-blue/10 hover:bg-royal-blue/20 text-royal-blue p-2 rounded-full transition-all z-30"
        title="Statut PWA"
      >
        <Download className="w-4 h-4" />
      </button>

      {/* Panel de statut PWA */}
      {showPWAStatus && (
        <div className="fixed bottom-16 left-4 z-50">
          <Card className="w-72 bg-white dark:bg-blue-gray-dark border-royal-blue/30 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-primary-text dark:text-dark-base-text">
                  📊 Statut PWA
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPWAStatus(false)}
                  className="text-primary-text dark:text-dark-base-text"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-primary-text/70 dark:text-dark-base-text/70">
                  Installée :
                </span>
                <Badge
                  className={
                    isInstalled
                      ? 'bg-success-green text-white'
                      : 'bg-royal-blue/20 text-royal-blue'
                  }
                >
                  {isInstalled ? 'Oui' : 'Non'}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-primary-text/70 dark:text-dark-base-text/70">
                  Cache :
                </span>
                <span className="text-primary-text dark:text-dark-base-text">
                  {cacheSize} éléments
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-primary-text/70 dark:text-dark-base-text/70">
                  Service Worker :
                </span>
                <Badge className="bg-success-green text-white">
                  {'serviceWorker' in navigator ? 'Actif' : 'Inactif'}
                </Badge>
              </div>

              {cacheSize > 0 && (
                <Button
                  onClick={clearCache}
                  variant="outline"
                  size="sm"
                  className="w-full border-soft-error-red/30 text-soft-error-red hover:bg-soft-error-red/10 bg-transparent"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Vider le cache
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
