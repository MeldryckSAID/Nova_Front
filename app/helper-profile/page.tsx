'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ScrollHeader } from '../../components/organisms/ScrollHeader';
import { Footer } from '../../components/organisms/Footer';
import { MultiSelect } from '../../components/molecules/MultiSelect';
import { AvatarSelector } from '../../components/molecules/AvatarSelector';
import { TimeSlotSelector } from '../../components/molecules/TimeSlotSelector';
import { Avatar } from '../../components/atoms/Avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import type { Helper, TimeSlot } from '../../types';

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

export default function HelperProfilePage() {
  const [helper, setHelper] = useState<Helper | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: '',
    description: '',
    specialties: [] as string[],
    timeSlots: [] as TimeSlot[],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.userType === 'helper') {
        setHelper(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          avatar: userData.avatar || '',
          description: userData.description || '',
          specialties: userData.specialties || [],
          timeSlots: userData.timeSlots || [],
        });
      } else {
        router.push('/dashboard');
      }
    } else {
      router.push('/connexion');
    }
  }, [router]);

  const handleChange =
    (field: string) => (value: string | string[] | TimeSlot[]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!formData.name.trim()) {
        setError('Le nom est requis');
        return;
      }
      if (!formData.email.trim()) {
        setError("L'email est requis");
        return;
      }
      if (!formData.avatar) {
        setError('Veuillez choisir un avatar');
        return;
      }
      if (formData.specialties.length === 0) {
        setError('Veuillez sélectionner au moins une spécialité');
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedHelper = {
        ...helper,
        id: helper?.id ?? '', // Ensure id is always a string
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar,
        description: formData.description,
        specialties: formData.specialties,
        timeSlots: formData.timeSlots,
        status: helper?.status ?? 'available', // Ensure status is always set
      };

      // Mettre à jour dans localStorage
      localStorage.setItem('user', JSON.stringify(updatedHelper));

      // Mettre à jour dans la liste des helpers
      const allHelpers = JSON.parse(localStorage.getItem('helpers') || '[]');
      const updatedHelpers = allHelpers.map((h: Helper) =>
        h.id === helper?.id ? updatedHelper : h
      );
      localStorage.setItem('helpers', JSON.stringify(updatedHelpers));

      setHelper(updatedHelper);
      setIsEditing(false);
      setSuccess('Profil mis à jour avec succès !');

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: helper?.name || '',
      email: helper?.email || '',
      avatar: helper?.avatar || '',
      description: helper?.description || '',
      specialties: helper?.specialties || [],
      timeSlots: helper?.timeSlots || [],
    });
    setIsEditing(false);
    setError('');
  };

  if (!helper) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollHeader />
      <main className="flex-1 bg-alt-background dark:bg-dark-background">
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-6">
            <Card className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-3xl text-primary-text dark:text-dark-base-text">
                  Mon Profil Helper
                </CardTitle>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-royal-blue hover:bg-royal-blue/90 text-white"
                  >
                    Modifier
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {success && (
                  <Alert className="mb-6 bg-success-green/10 border-success-green/20 text-success-green">
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}
                {error && (
                  <Alert
                    variant="destructive"
                    className="mb-6 bg-soft-error-red/10 border-soft-error-red/20 text-soft-error-red"
                  >
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {!isEditing ? (
                  <div className="space-y-8">
                    <div className="flex items-center space-x-6">
                      <Avatar src={helper.avatar} alt={helper.name} size="lg" />
                      <div>
                        <h2 className="text-2xl font-bold text-primary-text dark:text-dark-base-text">
                          {helper.name}
                        </h2>
                        <p className="text-primary-text/70 dark:text-dark-base-text/70">
                          {helper.email}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge className="bg-royal-blue/20 text-royal-blue border-royal-blue/30">
                            {helper.totalSessions || 0} sessions
                          </Badge>
                          <Badge className="bg-royal-blue/20 text-royal-blue border-royal-blue/30">
                            Note: {helper.rating || 0}/5
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-primary-text dark:text-dark-base-text mb-3">
                        Description
                      </h3>
                      <p className="text-primary-text/70 dark:text-dark-base-text/70 bg-light-blue-gray/10 dark:bg-royal-blue/10 p-4 rounded-lg border-light-blue-gray/20 dark:border-royal-blue/30">
                        {helper.description || 'Aucune description renseignée.'}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-primary-text dark:text-dark-base-text mb-3">
                        Spécialités
                      </h3>
                      {helper.specialties && helper.specialties.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {helper.specialties.map(
                            (specialty: string, index: number) => (
                              <Badge
                                key={index}
                                className="bg-royal-blue text-white hover:bg-royal-blue/90 border-royal-blue/20"
                              >
                                {specialty}
                              </Badge>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="text-primary-text/70 dark:text-dark-base-text/70 bg-light-blue-gray/10 dark:bg-royal-blue/10 p-4 rounded-lg border-light-blue-gray/20 dark:border-royal-blue/30">
                          Aucune spécialité renseignée.
                        </p>
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-primary-text dark:text-dark-base-text mb-3">
                        Créneaux de disponibilité
                      </h3>
                      {helper.timeSlots && helper.timeSlots.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {helper.timeSlots.map((slot) => (
                            <Card
                              key={slot.id}
                              className="p-4 bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30"
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
                                  className={
                                    slot.isRecurring
                                      ? 'bg-royal-blue text-white border-royal-blue/20'
                                      : 'bg-royal-blue/20 text-royal-blue border-royal-blue/30'
                                  }
                                >
                                  {slot.isRecurring ? 'Récurrent' : 'Ponctuel'}
                                </Badge>
                              </div>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <p className="text-primary-text/70 dark:text-dark-base-text/70 bg-light-blue-gray/10 dark:bg-royal-blue/10 p-4 rounded-lg border-light-blue-gray/20 dark:border-royal-blue/30">
                          Aucun créneau défini.
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
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
                        onChange={(e) => handleChange('email')(e.target.value)}
                        className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/30 dark:border-royal-blue/30 text-primary-text dark:text-dark-base-text placeholder:text-primary-text/50 dark:placeholder:text-dark-base-text/50 focus:border-royal-blue focus:ring-royal-blue/20"
                      />
                    </div>

                    <AvatarSelector
                      label="Avatar"
                      selectedAvatar={formData.avatar}
                      onAvatarSelect={handleChange('avatar')}
                      error={
                        !formData.avatar
                          ? 'Veuillez choisir un avatar'
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
                      <h3 className="text-lg font-semibold mb-4 text-primary-text dark:text-dark-base-text">
                        Créneaux de disponibilité
                      </h3>
                      <TimeSlotSelector
                        timeSlots={formData.timeSlots}
                        onChange={handleChange('timeSlots')}
                        maxSlots={5}
                      />
                    </div>

                    <div className="flex space-x-4 pt-6">
                      <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-royal-blue hover:bg-royal-blue/90 text-white"
                      >
                        {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={loading}
                        className=" bg-royal-blue hover:bg-royal-blue/90  dark:hover:bg-royal-blue/20 dark:bg-royal-blue border-royal-blue/30 text-primary-text dark:text-dark-base-text"
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
