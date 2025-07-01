'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ScrollHeader } from '../../components/organisms/ScrollHeader';
import { Footer } from '../../components/organisms/Footer';
import { MultiSelect } from '../../components/molecules/MultiSelect';
import { AvatarSelector } from '../../components/molecules/AvatarSelector';
import { Avatar } from '../../components/atoms/Avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: '',
    needs: '',
    specialties: [] as string[],
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
      setUser(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        avatar: userData.avatar || '',
        needs: userData.needs || '',
        specialties: userData.specialties || [],
      });
    } else {
      router.push('/connexion');
    }
  }, [router]);

  const handleChange = (field: string) => (value: string | string[]) => {
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

      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar,
        needs: formData.needs,
        specialties: formData.specialties,
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
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
      name: user.name || '',
      email: user.email || '',
      avatar: user.avatar || '',
      needs: user.needs || '',
      specialties: user.specialties || [],
    });
    setIsEditing(false);
    setError('');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollHeader />
      <main className="flex-1 bg-alt-background dark:bg-dark-background">
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-6">
            <Card className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-3xl text-royal-blue dark:text-white">
                  Mon Profil
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
                      <Avatar src={user.avatar} alt={user.name} size="lg" />
                      <div>
                        <h2 className="text-2xl font-bold text-primary-text dark:text-dark-base-text">
                          {user.name}
                        </h2>
                        <p className="text-primary-text/70 dark:text-dark-base-text/70">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-primary-text dark:text-dark-base-text mb-3">
                        Vos besoins
                      </h3>
                      <p className="text-primary-text/70 dark:text-dark-base-text/70 bg-light-blue-gray/10 dark:bg-royal-blue/10 p-4 rounded-lg">
                        {user.needs || 'Aucun besoin spécifique renseigné.'}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-primary-text dark:text-dark-base-text mb-3">
                        Domaines d'intérêt
                      </h3>
                      {user.specialties && user.specialties.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {user.specialties.map(
                            (specialty: string, index: number) => (
                              <span
                                key={index}
                                className="inline-block px-3 py-1 bg-royal-blue text-white border border-royal-blue/20 rounded-full text-sm"
                              >
                                {specialty}
                              </span>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="text-primary-text/70 dark:text-dark-base-text/70 bg-light-blue-gray/10 dark:bg-royal-blue/10 p-4 rounded-lg">
                          Aucune spécialité renseignée.
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
                        className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30 text-primary-text dark:text-dark-base-text"
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
                        className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30 text-primary-text dark:text-dark-base-text"
                      />
                    </div>

                    <AvatarSelector
                      label="Avatar"
                      selectedAvatar={formData.avatar}
                      onAvatarSelect={handleChange('avatar')}
                      error={
                        !formData.avatar
                          ? 'Veuillez choisir un avatar'
                      }
                    />

                    <div>
                      <Label
                        htmlFor="needs"
                        className="text-primary-text dark:text-dark-base-text"
                      >
                        Vos besoins (facultatif)
                      </Label>
                      <Textarea
                        id="needs"
                        value={formData.needs}
                        onChange={(e) => handleChange('needs')(e.target.value)}
                        rows={4}
                        placeholder="Décrivez vos besoins d'apprentissage..."
                        className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30 text-primary-text dark:text-dark-base-text placeholder:text-primary-text/50 dark:placeholder:text-dark-base-text/50"
                      />
                    </div>

                    <MultiSelect
                      label="Spécialités d'intérêt *"
                      options={specialtyOptions}
                      selected={formData.specialties}
                      onChange={handleChange('specialties')}
                      placeholder="Sélectionnez vos domaines d'intérêt..."
                      minSelection={1}
                      maxSelection={5}
                      error={
                        formData.specialties.length === 0
                          ? 'Sélectionnez au moins une spécialité'
                          : undefined
                      }
                    />

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
                        className="border-royal-blue/30 text-royal-blue hover:bg-royal-blue/10  dark:hover:bg-royal-blue/20 dark:bg-royal-blue dark:text-white "
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
