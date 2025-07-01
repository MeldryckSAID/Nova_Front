'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ScrollHeader } from '../../../components/organisms/ScrollHeader';
import { Footer } from '../../../components/organisms/Footer';
import { Avatar } from '../../../components/atoms/Avatar';
import { BookingModal } from '../../../components/molecules/BookingModal';
import type { Helper, BookingRequest } from '../../../types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';

interface HelperProfilePageProps {
  params: { id: string };
}

// helpers par défaut (ceux codés en dur)
const defaultHelpers: Helper[] = [
  {
    id: '1',
    name: 'Jeremie Malcom',
    email: 'jeremie@example.com',
    avatar: '/images/avatars/guy-1.svg',
    specialties: ['Développement', 'Programmation'],
    timeSlots: [
      {
        id: 'slot-1',
        day: 'Lundi',
        startTime: '19:00',
        endTime: '21:00',
        isRecurring: true,
      },
      {
        id: 'slot-2',
        day: 'Mercredi',
        startTime: '19:00',
        endTime: '21:00',
        isRecurring: true,
      },
    ],
    description: 'Développeur expérimenté spécialisé en JavaScript et React',
    rating: 4.5,
    totalSessions: 10,
    status: 'available',
  },
  {
    id: '2',
    name: 'David',
    email: 'david@example.com',
    avatar: '/images/avatars/guy-2.svg',
    specialties: ['Programmation', 'Informatique'],
    timeSlots: [
      {
        id: 'slot-3',
        day: 'Mardi',
        startTime: '14:00',
        endTime: '18:00',
        isRecurring: true,
      },
      {
        id: 'slot-4',
        day: 'Jeudi',
        startTime: '14:00',
        endTime: '18:00',
        isRecurring: true,
      },
    ],
    description: "Full-stack developer avec 5 ans d'expérience",
    rating: 4.8,
    totalSessions: 25,
    status: 'available',
  },
];

export default function HelperProfilePage({ params }: HelperProfilePageProps) {
  const router = useRouter();
  const [helper, setHelper] = useState<Helper | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Récupérer l'utilisateur connecté
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    // Récupérer helpers dynamiques
    const localHelpers: Helper[] = JSON.parse(
      localStorage.getItem('helpers') || '[]'
    );
    const allHelpers = [...defaultHelpers, ...localHelpers];

    const found = allHelpers.find((h) => h.id === params.id);
    if (!found) {
      router.replace('/helper'); // redirige si introuvable
    } else {
      setHelper(found);
    }
  }, [params.id, router]);

  const handleBookingSubmit = (
    booking: Omit<BookingRequest, 'id' | 'createdAt'>
  ) => {
    const newBooking: BookingRequest = {
      ...booking,
      id: `booking-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    // Sauvegarder la réservation
    const existingBookings = JSON.parse(
      localStorage.getItem('bookingRequests') || '[]'
    );
    localStorage.setItem(
      'bookingRequests',
      JSON.stringify([...existingBookings, newBooking])
    );

    alert('Demande de réservation envoyée ! Le helper vous répondra bientôt.');
  };

  const handleContactHelper = () => {
    if (helper?.email) {
      const subject = encodeURIComponent(
        `Contact depuis NOVA - ${helper.name}`
      );
      const body = encodeURIComponent(`Bonjour ${helper.name},

Je vous contacte via la plateforme NOVA car je suis intéressé(e) par vos services.

Cordialement,
${currentUser?.name || 'Un utilisateur'}`);

      window.location.href = `mailto:${helper.email}?subject=${subject}&body=${body}`;
    }
  };

  if (!helper) {
    return (
      <div className="min-h-screen flex flex-col">
        <ScrollHeader />
        <main className="flex-1 flex items-center justify-center bg-alt-background dark:bg-dark-background">
          <p className="text-primary-text/70 dark:text-dark-base-text/70">
            Chargement du profil…
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  // Vérifier si l'utilisateur est connecté pour les actions
  const isLoggedIn = !!currentUser;
  const isStudent = currentUser?.userType !== 'helper';

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollHeader />
      <main className="flex-1 bg-alt-background dark:bg-dark-background">
        <div className="py-16">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-3xl text-primary-text dark:text-dark-base-text">
                      {helper.name}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      {helper.rating && (
                        <Badge
                          variant="secondary"
                          className="bg-royal-blue/10 text-royal-blue border-royal-blue/20"
                        >
                          ⭐ {helper.rating}/5
                        </Badge>
                      )}
                      <Badge
                        variant={
                          helper.status === 'available'
                            ? 'default'
                            : 'secondary'
                        }
                        className={
                          helper.status === 'available'
                            ? 'bg-soft-success-green text-white'
                            : 'bg-light-blue-gray/20 text-primary-text/70 dark:text-dark-base-text/70'
                        }
                      >
                        {helper.status === 'available'
                          ? 'Disponible'
                          : 'Occupé'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {helper.description && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-primary-text dark:text-dark-base-text">
                        À propos
                      </h3>
                      <p className="text-primary-text/70 dark:text-dark-base-text/70 leading-relaxed">
                        {helper.description}
                      </p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-primary-text dark:text-dark-base-text">
                      Spécialités
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {helper.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="inline-block px-3 py-1 bg-royal-blue text-white border border-royal-blue/20 rounded-full text-sm"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {helper.totalSessions !== undefined && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-primary-text dark:text-dark-base-text">
                        Expérience
                      </h3>
                      <p className="text-primary-text/70 dark:text-dark-base-text/70">
                        {helper.totalSessions} session
                        {helper.totalSessions > 1 ? 's' : ''} réalisée
                        {helper.totalSessions > 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30">
                <CardHeader>
                  <CardTitle className="text-primary-text dark:text-dark-base-text">
                    Créneaux de disponibilité
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {helper.timeSlots.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {helper.timeSlots.map((slot) => (
                        <div
                          key={slot.id}
                          className="p-4 border border-light-blue-gray/20 dark:border-royal-blue/30 rounded-lg bg-alt-background/50 dark:bg-dark-background/50"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-primary-text dark:text-dark-base-text">
                                {slot.day}
                              </h4>
                              <p className="text-sm text-primary-text/70 dark:text-dark-base-text/70">
                                {slot.startTime} - {slot.endTime}
                              </p>
                            </div>
                            <Badge
                              variant={
                                slot.isRecurring ? 'default' : 'secondary'
                              }
                              className={
                                slot.isRecurring
                                  ? 'bg-royal-blue text-white text-xs'
                                  : 'bg-light-blue-gray/20 text-primary-text/70 dark:text-dark-base-text/70 text-xs'
                              }
                            >
                              {slot.isRecurring ? 'Récurrent' : 'Ponctuel'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-primary-text/70 dark:text-dark-base-text/70 text-center py-8">
                      Aucun créneau de disponibilité défini pour le moment.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="text-center p-6 bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30">
                <div className="flex justify-center mb-4">
                  <Avatar src={helper.avatar} alt={helper.name} size="lg" />
                </div>
                <h2 className="text-xl font-bold text-primary-text dark:text-dark-base-text mb-2">
                  {helper.name}
                </h2>
                <Badge
                  variant={
                    helper.status === 'available' ? 'default' : 'secondary'
                  }
                  className={
                    helper.status === 'available'
                      ? 'bg-soft-success-green text-white'
                      : 'bg-light-blue-gray/20 text-primary-text/70 dark:text-dark-base-text/70'
                  }
                >
                  {helper.status === 'available' ? 'Disponible' : 'Occupé'}
                </Badge>
              </Card>

              {/* Actions */}
              <Card className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30">
                <CardContent className="p-6 space-y-4">
                  {/* Bouton de réservation */}
                  {helper.timeSlots.length > 0 && isLoggedIn && isStudent ? (
                    <BookingModal
                      helper={helper}
                      onBookingSubmit={handleBookingSubmit}
                    >
                      <Button
                        className="w-full bg-royal-blue hover:bg-royal-blue/90 text-white"
                        size="lg"
                      >
                        📅 Réserver un créneau
                      </Button>
                    </BookingModal>
                  ) : !isLoggedIn ? (
                    <Button
                      className="w-full bg-royal-blue hover:bg-royal-blue/90 text-white"
                      size="lg"
                      onClick={() => router.push('/connexion')}
                    >
                      📅 Se connecter pour réserver
                    </Button>
                  ) : !isStudent ? (
                    <Button
                      className="w-full bg-light-blue-gray/20 text-primary-text/50 dark:text-dark-base-text/50 cursor-not-allowed"
                      size="lg"
                      disabled
                    >
                      📅 Réservation (Students uniquement)
                    </Button>
                  ) : (
                    <Button
                      className="w-full bg-light-blue-gray/20 text-primary-text/50 dark:text-dark-base-text/50 cursor-not-allowed"
                      size="lg"
                      disabled
                    >
                      📅 Aucun créneau disponible
                    </Button>
                  )}

                  {/* Bouton de contact */}
                  <Button
                    variant="outline"
                    className="w-full border-royal-blue/30 text-royal-blue hover:bg-royal-blue/10 hover:border-royal-blue/50 bg-transparent"
                    size="lg"
                    onClick={handleContactHelper}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contacter par email
                  </Button>

                  {!isLoggedIn && (
                    <p className="text-xs text-primary-text/50 dark:text-dark-base-text/50 text-center">
                      Connectez-vous pour accéder à toutes les fonctionnalités
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Informations de contact */}
              <Card className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30">
                <CardHeader>
                  <CardTitle className="text-lg text-primary-text dark:text-dark-base-text">
                    Contact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 text-sm text-primary-text/70 dark:text-dark-base-text/70">
                    <Mail className="w-4 h-4" />
                    <span>{helper.email}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
