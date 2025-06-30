'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ScrollHeader } from '../../components/organisms/ScrollHeader';
import { Footer } from '../../components/organisms/Footer';
import { MultiSelect } from '../../components/molecules/MultiSelect';
import { AvatarSelector } from '../../components/molecules/AvatarSelector';
import { TimeSlotSelector } from '../../components/molecules/TimeSlotSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { TimeSlot } from '../../types';

const specialtyOptions = [
  'Mathématiques',
  'Programmation',
  'Langues étrangères',
  'Sciences physiques',
  'Histoire-Géographie',
  'Littérature',
  'Arts plastiques',
  'Musique',
  'Économie',
  'Philosophie',
  'Biologie',
  'Chimie',
  'Informatique',
  'Marketing',
  'Comptabilité',
  'Droit',
  'Psychologie',
  'Architecture',
  'Design graphique',
  'Photographie',
];

export default function HelperSignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    avatar: '',
    specialties: [] as string[],
    timeSlots: [] as TimeSlot[],
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange =
    (field: string) => (value: string | string[] | TimeSlot[]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Le nom est requis');
      return false;
    }
    if (!formData.email.trim()) {
      setError("L'email est requis");
      return false;
    }
    if (!formData.password.trim()) {
      setError('Le mot de passe est requis');
      return false;
    }
    if (!formData.avatar) {
      setError('Veuillez choisir un avatar');
      return false;
    }
    if (formData.specialties.length === 0) {
      setError('Veuillez sélectionner au moins une spécialité');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Simulation d'inscription helper
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newHelper = {
        id: `helper-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar,
        specialties: formData.specialties,
        timeSlots: formData.timeSlots,
        description: formData.description,
        rating: 0,
        totalSessions: 0,
        status: 'available' as const,
        userType: 'helper',
      };

      // Sauvegarder le helper
      const existingHelpers = JSON.parse(
        localStorage.getItem('helpers') || '[]'
      );
      localStorage.setItem(
        'helpers',
        JSON.stringify([...existingHelpers, newHelper])
      );

      // Connecter automatiquement le helper
      localStorage.setItem('user', JSON.stringify(newHelper));

      router.push('/helper-dashboard');
    } catch (err) {
      setError("Une erreur est survenue lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollHeader />
      <main className="flex-1 bg-alt-background dark:bg-dark-background">
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-6">
            <Card className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30">
              <CardHeader>
                <CardTitle className="text-3xl text-center text-primary-text dark:text-dark-base-text">
                  Devenir Helper
                </CardTitle>
                <p className="text-center text-primary-text/70 dark:text-dark-base-text/70">
                  Rejoignez notre communauté d'experts et aidez les étudiants à
                  progresser
                </p>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert
                    variant="destructive"
                    className="mb-6 bg-soft-error-red/10 border-soft-error-red/20 text-soft-error-red"
                  >
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Informations personnelles */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-primary-text dark:text-dark-base-text">
                      Informations personnelles
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label
                          htmlFor="name"
                          className="text-primary-text dark:text-dark-base-text"
                        >
                          Nom complet *
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleChange('name')(e.target.value)}
                          required
                          className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/30 dark:border-royal-blue/30 text-primary-text dark:text-dark-base-text placeholder:text-primary-text/50 dark:placeholder:text-dark-base-text/50 focus:border-royal-blue focus:ring-royal-blue/20"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="email"
                          className="text-primary-text dark:text-dark-base-text"
                        >
                          Email *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleChange('email')(e.target.value)
                          }
                          required
                          className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/30 dark:border-royal-blue/30 text-primary-text dark:text-dark-base-text placeholder:text-primary-text/50 dark:placeholder:text-dark-base-text/50 focus:border-royal-blue focus:ring-royal-blue/20"
                        />
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="password"
                        className="text-primary-text dark:text-dark-base-text"
                      >
                        Mot de passe *
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          handleChange('password')(e.target.value)
                        }
                        required
                        className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/30 dark:border-royal-blue/30 text-primary-text dark:text-dark-base-text placeholder:text-primary-text/50 dark:placeholder:text-dark-base-text/50 focus:border-royal-blue focus:ring-royal-blue/20"
                      />
                    </div>

                    <AvatarSelector
                      label="Choisissez votre avatar"
                      selectedAvatar={formData.avatar}
                      onAvatarSelect={handleChange('avatar')}
                      error={
                        !formData.avatar
                          ? 'Veuillez choisir un avatar'
                          : undefined
                      }
                    />
                  </div>

                  {/* Compétences */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-primary-text dark:text-dark-base-text">
                      Vos compétences
                    </h3>

                    <MultiSelect
                      label="Spécialités *"
                      options={specialtyOptions}
                      selected={formData.specialties}
                      onChange={handleChange('specialties')}
                      placeholder="Sélectionnez vos domaines d'expertise..."
                      minSelection={1}
                      maxSelection={10}
                      error={
                        formData.specialties.length === 0
                          ? 'Sélectionnez au moins une spécialité'
                          : undefined
                      }
                    />

                    <div>
                      <Label
                        htmlFor="description"
                        className="text-primary-text dark:text-dark-base-text"
                      >
                        Description de votre profil
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          handleChange('description')(e.target.value)
                        }
                        rows={4}
                        placeholder="Présentez-vous et décrivez votre approche pédagogique..."
                        className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/30 dark:border-royal-blue/30 text-primary-text dark:text-dark-base-text placeholder:text-primary-text/50 dark:placeholder:text-dark-base-text/50 focus:border-royal-blue focus:ring-royal-blue/20"
                      />
                    </div>
                  </div>

                  {/* Disponibilités */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-primary-text dark:text-dark-base-text">
                      Vos disponibilités
                    </h3>
                    <p className="text-primary-text/70 dark:text-dark-base-text/70">
                      Définissez vos créneaux de disponibilité. Vous pourrez les
                      modifier plus tard.
                    </p>

                    <TimeSlotSelector
                      timeSlots={formData.timeSlots}
                      onChange={handleChange('timeSlots')}
                      maxSlots={5}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-royal-blue hover:bg-royal-blue/90 text-white"
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? 'Inscription en cours...' : 'Devenir Helper'}
                  </Button>
                </form>

                <div className="text-center mt-6">
                  <Button
                    variant="link"
                    onClick={() => router.push('/connexion')}
                    className="text-royal-blue hover:text-royal-blue/80"
                  >
                    Déjà inscrit ? Se connecter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
