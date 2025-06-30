import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NOVA',
    short_name: 'NOVA',
    description:
      'Une application progressive pour apprendre, échanger et progresser avec des experts',
    start_url: '/',
    display: 'standalone',
    background_color: '#2c3e91',
    theme_color: '#2c3e91',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'fr',
    categories: ['education', 'productivity', 'social'],
    screenshots: [
      {
        src: '/images/home.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: "Page d'accueil NOVA",
      },
      {
        src: '/images/helper-page.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Liste des helpers',
      },
    ],
    icons: [
      {
        src: '/favicon.ico',
        sizes: '16x16 32x32',
        type: 'image/x-icon',
      },
      {
        src: '/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/nova_logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'Trouver un Helper',
        short_name: 'Helpers',
        description: 'Découvrir les experts disponibles',
        url: '/helper',
        icons: [{ src: '/icon-192x192.png', sizes: '192x192' }],
      },
      {
        name: 'Mon Dashboard',
        short_name: 'Dashboard',
        description: 'Accéder à mon espace personnel',
        url: '/dashboard',
        icons: [{ src: '/icon-192x192.png', sizes: '192x192' }],
      },
      {
        name: 'Se connecter',
        short_name: 'Connexion',
        description: 'Accéder à mon compte',
        url: '/connexion',
        icons: [{ src: '/icon-192x192.png', sizes: '192x192' }],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
    edge_side_panel: {
      preferred_width: 400,
    },
  };
}
