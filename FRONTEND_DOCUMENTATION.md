# Documentation Front-End NOVA

## 🎯 Vue d'ensemble

NOVA utilise une architecture front-end moderne basée sur **Next.js 15** avec **TypeScript**, suivant les principes d'**Atomic Design** et les standards **PWA**.

##  Architecture Front-End

### Structure des dossiers
\`\`\`
app/                         # Next.js App Router
├── layout.tsx               # Layout principal avec providers
├── page.tsx                 # Page d'accueil
├── globals.css              # Styles globaux + variables CSS
├── manifest.ts              # PWA Manifest
├── connexion/               # Authentification
├── dashboard/               # Dashboard étudiant
├── helper/                  # Pages helpers
├── helper-dashboard/        # Dashboard helper
├── helper-profile/          # Profil helper
├── helper-signup/           # Inscription helper
└── profile/                 # Profil utilisateur

components/                  # Composants React (Atomic Design)
├── atoms/                   # Composants atomiques
│   ├── Avatar.tsx           # Composant avatar avec sélection
│   ├── Logo.tsx             # Logo NOVA animé
│   ├── PWAInstaller.tsx     # Installation PWA
│   └── ScrollReveal.tsx     # Animations au scroll
├── molecules/               # Composants moléculaires
│   ├── AvatarSelector.tsx   # Sélecteur d'avatar
│   ├── BookingModal.tsx     # Modal de réservation
│   ├── HelperCard.tsx       # Carte helper
│   ├── MultiSelect.tsx      # Multi-sélection
│   ├── TimeSlotSelector.tsx # Sélecteur de créneaux
│   └── UserHeader.tsx       # Header utilisateur
├── organisms/               # Composants organismes
│   ├── Footer.tsx           # Pied de page
│   ├── HelperSection.tsx    # Section helpers
│   ├── HeroSection.tsx      # Section hero
│   └── ScrollHeader.tsx     # Header avec scroll
└── ui/                      # shadcn/ui components

contexts/                     # Contextes React
├── AuthContext.tsx          # Authentification globale
└── ThemeContext.tsx         # Thème sombre/clair

hooks/                       # Hooks personnalisés
└── useBackgroundSync.ts     # Synchronisation PWA
\`\`\`

---

## Design System

### Palette de couleurs NOVA
\`\`\`css
:root {
  /* Couleurs principales */
  --royal-blue: #2c3e91;        /* Bleu principal NOVA */
  --light-blue-gray: #dbe4f0;   /* Gris-bleu clair */
  --primary-text: #1f2937;      /* Texte principal */
  --alt-background: #f1f5f9;    /* Arrière-plan alternatif */
  
  /* Couleurs fonctionnelles */
  --success-green: #27ae60;     /* Succès */
  --soft-error-red: #e74c3c;    /* Erreur */
  --warning-orange: #f39c12;    /* Avertissement */
}

.dark {
  --background: #0f172a;        /* Background sombre */
  --foreground: #f8fafc;        /* Texte clair */
  --card: #1f2a44;              /* Cartes sombres */
}
\`\`\`

### Composants UI standardisés
- **shadcn/ui** pour la cohérence
- **Tailwind CSS** pour la flexibilité
- **Lucide React** pour les icônes
- **Animations CSS** fluides

---


##  PWA Implementation

### Manifest PWA
\`\`\`typescript
// app/manifest.ts
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NOVA - Apprendre Echanger Progresser",
    short_name: "NOVA",
    description: "Plateforme d'apprentissage collaborative",
    start_url: "/",
    display: "standalone",
    background_color: "#2c3e91",
    theme_color: "#2c3e91",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      }
    ]
  }
}
\`\`\`

---

##  Hooks React Utilisés

###  Hooks implémentés 
- **useState** - Gestion d'état local
- **useEffect** - Effets de bord et lifecycle
- **useContext** - État global (Auth, Theme)
- **useCallback** - Optimisation des fonctions
- **useMemo** - Optimisation des calculs

## Responsive Design

### Breakpoints Tailwind
\`\`\`css
/* Mobile First Approach */
.container {
  @apply px-4;                    /* Mobile */
  @apply sm:px-6;                 /* 640px+ */
  @apply md:px-8;                 /* 768px+ */
  @apply lg:px-12;                /* 1024px+ */
  @apply xl:px-16;                /* 1280px+ */
}

/* Grid responsive */
.helper-grid {
  @apply grid grid-cols-1;       /* Mobile: 1 colonne */
  @apply md:grid-cols-2;         /* Tablet: 2 colonnes */
  @apply lg:grid-cols-3;         /* Desktop: 3 colonnes */
  @apply xl:grid-cols-4;         /* Large: 4 colonnes */
}
\`\`\`

---



### Procédure de migration
1. **Remplacer les atoms** par leurs équivalents React Native
2. **Adapter les styles** (Tailwind → StyleSheet)
3. **Modifier la navigation** (Next.js Router → React Navigation)
4. **Adapter les hooks** (localStorage → AsyncStorage)

---