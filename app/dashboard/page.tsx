'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ScrollHeader } from '../../components/organisms/ScrollHeader';
import { Footer } from '../../components/organisms/Footer';
import { Avatar } from '../../components/atoms/Avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const helpers = [
  {
    id: '1',
    name: 'Jeremie Malcom',
    specialty: 'Développement',
    avatar: '/images/avatars/guy-1.svg',
    nextAvailability: '11/06/2025',
    schedule: '19H à 22H',
  },
  {
    id: '2',
    name: 'David',
    specialty: 'Programmation',
    avatar: '/images/avatars/guy-2.svg',
    nextAvailability: '12/06/2025',
    schedule: '14H à 18H',
  },
  {
    id: '4',
    name: 'Sarah',
    specialty: 'Sciences',
    avatar: '/images/avatars/woman-2.svg',
    nextAvailability: '15/06/2025',
    schedule: '16H à 20H',
  },
];

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      router.push('/connexion');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  if (!user) return null;

  const contactedHelpers = helpers.filter((helper) =>
    user.contactedHelpers?.includes(helper.id)
  );

  return (
    <div className="min-h-screen flex flex-col bg-alt-background dark:bg-dark-background">
      <ScrollHeader />
      <main className="flex-1">
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            {/* En-tête utilisateur */}
            <div className="flex items-center justify-between mb-8">
              <div></div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Image
                    src="/images/nova_logo.svg"
                    alt="NOVA Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8 mr-3"
                  />
                  <h1 className="text-2xl font-bold text-primary-text dark:text-dark-base-text">
                    Bonjour {user.name}
                  </h1>
                </div>
                <Avatar
                  src={user.avatar || '/images/avatars/woman-1.svg'}
                  alt={user.name}
                  size="lg"
                />
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => router.push('/profile')}
                    className="bg-royal-blue hover:bg-royal-blue/90 text-white"
                  >
                    Modifier le profil
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="bg-soft-error-red hover:bg-soft-error-red/90 text-white"
                  >
                    Me déconnecter
                  </Button>
                </div>
              </div>
            </div>

            {/* Informations utilisateur */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <Card className="shadow-lg bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30">
                <CardHeader>
                  <CardTitle className="text-primary-text dark:text-dark-base-text">
                    Vos besoins
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-primary-text/70 dark:text-dark-base-text/70">
                    {user.needs ||
                      'Aucun besoin spécifique renseigné pour le moment.'}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-lg bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30">
                <CardHeader>
                  <CardTitle className="text-primary-text dark:text-dark-base-text">
                    Vos domaines d'intérêt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {user.specialties && user.specialties.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.specialties.map(
                        (specialty: string, index: number) => (
                          <Badge
                            key={index}
                            className="bg-royal-blue text-white hover:bg-royal-blue/90"
                          >
                            {specialty}
                          </Badge>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-primary-text/70 dark:text-dark-base-text/70">
                      Aucune spécialité renseignée.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Réservations */}
            <Card className="shadow-lg bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30">
              <CardHeader>
                <CardTitle className="text-3xl text-primary-text dark:text-dark-base-text">
                  Mes Réservations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  // Récupérer les réservations de l'utilisateur
                  const bookings = JSON.parse(
                    localStorage.getItem('bookingRequests') || '[]'
                  );
                  const userBookings = bookings.filter(
                    (booking: any) => booking.studentId === user.id
                  );

                  if (userBookings.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <p className="text-primary-text/70 dark:text-dark-base-text/70 mb-4">
                          Vous n'avez aucune réservation pour le moment.
                        </p>
                        <Button
                          onClick={() => router.push('/helper')}
                          className="bg-royal-blue hover:bg-royal-blue/90 text-white"
                        >
                          Découvrir les helpers
                        </Button>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      {userBookings.map((booking: any) => {
                        const helper = helpers.find(
                          (h) => h.id === booking.helperId
                        );
                        const canJoinMeeting = booking.status === 'accepted';

                        return (
                          <Card
                            key={booking.id}
                            className="shadow-sm bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30"
                          >
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  {helper && (
                                    <Avatar
                                      src={helper.avatar}
                                      alt={helper.name}
                                      size="md"
                                    />
                                  )}
                                  <div>
                                    <h3 className="text-lg font-bold text-primary-text dark:text-dark-base-text">
                                      {helper?.name || 'Helper'}
                                    </h3>
                                    <p className="text-sm text-primary-text/70 dark:text-dark-base-text/70">
                                      {new Date(
                                        booking.requestedDate
                                      ).toLocaleDateString('fr-FR', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                      })}
                                    </p>
                                    {booking.message && (
                                      <p className="text-sm text-primary-text/70 dark:text-dark-base-text/70 mt-1">
                                        "{booking.message}"
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge
                                    className={
                                      booking.status === 'pending'
                                        ? 'bg-royal-blue/20 text-royal-blue border-royal-blue/30'
                                        : booking.status === 'accepted'
                                          ? 'bg-success-green text-white'
                                          : booking.status === 'rejected'
                                            ? 'bg-soft-error-red text-white'
                                            : 'bg-primary-text/20 text-primary-text dark:bg-dark-base-text/20 dark:text-dark-base-text'
                                    }
                                  >
                                    {booking.status === 'pending'
                                      ? 'En attente'
                                      : booking.status === 'accepted'
                                        ? 'Confirmée'
                                        : booking.status === 'rejected'
                                          ? 'Refusée'
                                          : 'Terminée'}
                                  </Badge>
                                  {canJoinMeeting && (
                                    <Button
                                      size="sm"
                                      onClick={() => router.push('/')}
                                      className="bg-success-green hover:bg-success-green/90 text-white"
                                    >
                                      🎥 Bientôt disponible
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
