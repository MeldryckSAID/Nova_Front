'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ScrollHeader } from '../../components/organisms/ScrollHeader';
import { Footer } from '../../components/organisms/Footer';
import { MultiSelect } from '../../components/molecules/MultiSelect';
import { AvatarSelector } from '../../components/molecules/AvatarSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import url from '@/src/outils/generalUrl'

export default function ConnexionPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    lastname: '',
    firstname: '',
    email: '',
    password: '',
    sexe: '',
    birthdate: '',
    role: '',
    SkillsCategory: [] as number[],
    avatar: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [categoriesOptions, setCategoriesOptions] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${url.value}categories/all`);
        const data = await res.json();
        setCategoriesOptions(
          Array.isArray(data)
            ? data.map((cat: any) => ({ id: cat.id, name: cat.name }))
            : []
        );
      } catch {
        setCategoriesOptions([]);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (field: string) => (value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (isLogin) {
      if (!formData.email.trim() || !formData.password.trim()) {
        setError('Email et mot de passe requis');
        return false;
      }
    } else {
      if (!formData.lastname.trim() || !formData.firstname.trim()) {
        setError('Nom et prénom requis');
        return false;
      }
      if (!formData.email.trim() || !formData.password.trim()) {
        setError('Email et mot de passe requis');
        return false;
      }
      if (formData.SkillsCategory.length === 0) {
        setError('Veuillez sélectionner au moins une spécialité');
        return false;
      }
      if (!formData.avatar) {
        setError('Veuillez choisir un avatar');
        return false;
      }
      if (!formData.role) {
        setError('Veuillez choisir un rôle');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
    setLoading(true);

    try {
      if (isLogin) {
        // Connexion
        const res = await fetch(`${url.value}auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
        const account = await res.json();
        if (res.ok && account) {
          localStorage.setItem('user', JSON.stringify(account));
          if (account.type === 'helper') {
            router.push('/helper-dashboard');
          } else {
            router.push('/dashboard');
          }
        } else {
          setError('Identifiants incorrects');
        }
      } else {
        // Inscription
        const res = await fetch(`${url.value}auth/inscription`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok && data) {
          localStorage.setItem('user', JSON.stringify(data));
          router.push('/dashboard');
        } else {
          setError(data?.message || "Erreur lors de l'inscription");
          console.log('Erreur API:', data?.message);
        }
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-alt-background dark:bg-dark-background">
      <ScrollHeader />
      <main className="flex-1">
        <div className="py-16 min-h-screen flex items-center">
          <div className="max-w-lg mx-auto w-full px-6">
            <Card className="shadow-lg bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30">
              <CardHeader>
                <CardTitle className="text-center text-primary-text dark:text-dark-base-text">
                  {isLogin ? 'Connexion' : 'Inscription'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert
                    variant="destructive"
                    className="mb-4 bg-soft-error-red/10 border-soft-error-red/20 text-soft-error-red"
                  >
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {!isLogin ? (
                    <>
                      <div>
                        <Label htmlFor="lastname" className="text-primary-text dark:text-dark-base-text">
                          Nom *
                        </Label>
                        <Input
                          id="lastname"
                          value={formData.lastname}
                          onChange={(e) => handleChange('lastname')(e.target.value)}
                          required
                          className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30 text-primary-text dark:text-dark-base-text"
                        />
                      </div>
                      <div>
                        <Label htmlFor="firstname" className="text-primary-text dark:text-dark-base-text">
                          Prénom *
                        </Label>
                        <Input
                          id="firstname"
                          value={formData.firstname}
                          onChange={(e) => handleChange('firstname')(e.target.value)}
                          required
                          className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30 text-primary-text dark:text-dark-base-text"
                        />
                      </div>
                      <div>
                        <Label htmlFor="sexe" className="text-primary-text dark:text-dark-base-text">
                          Sexe
                        </Label>
                        <select
                          id="sexe"
                          value={formData.sexe}
                          onChange={(e) => handleChange('sexe')(e.target.value)}
                          className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30 text-primary-text dark:text-dark-base-text rounded-md w-full py-2 px-3"
                          required
                        >
                          <option value="">Sélectionnez</option>
                          <option value="Homme">Homme</option>
                          <option value="Femme">Femme</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="birthdate" className="text-primary-text dark:text-dark-base-text">
                          Date de naissance
                        </Label>
                        <Input
                          id="birthdate"
                          type="date"
                          value={formData.birthdate}
                          onChange={(e) => handleChange('birthdate')(e.target.value)}
                          className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30 text-primary-text dark:text-dark-base-text"
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
                      {/* <div>
                        <Label htmlFor="Skill" className="text-primary-text dark:text-dark-base-text">
                          Compétences (facultatif)
                        </Label>
                        <Input
                          id="Skill"
                          value={formData.Skill.join(', ')}
                          onChange={(e) =>
                            handleChange('Skill')(e.target.value.split(',').map((s: string) => s.trim()))
                          }
                          placeholder="Ex: React, Node.js"
                          className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30 text-primary-text dark:text-dark-base-text"
                        />
                      </div> */}
                      <MultiSelect
                        label="Spécialités d'intérêt *"
                        options={categoriesOptions}
                        selected={formData.SkillsCategory}
                        onChange={handleChange('SkillsCategory')}
                        placeholder="Sélectionnez vos domaines d'intérêt..."
                        minSelection={1}
                        error={
                          formData.SkillsCategory.length === 0
                            ? 'Sélectionnez au moins une spécialité'
                            : undefined
                        }
                      />
                      <div>
                        <Label htmlFor="email" className="text-primary-text dark:text-dark-base-text">
                          Email *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange('email')(e.target.value)}
                          required
                          className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30 text-primary-text dark:text-dark-base-text"
                        />
                      </div>
                      <div>
                        <Label htmlFor="password" className="text-primary-text dark:text-dark-base-text">
                          Mot de passe *
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => handleChange('password')(e.target.value)}
                          required
                          className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30 text-primary-text dark:text-dark-base-text"
                        />
                      </div>
                      <div>
                        <Label htmlFor="role" className="text-primary-text dark:text-dark-base-text">
                          Rôle *
                        </Label>
                        <select
                          id="role"
                          value={formData.role}
                          onChange={(e) => handleChange('role')(e.target.value)}
                          required
                          className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30 text-primary-text dark:text-dark-base-text rounded-md w-full py-2 px-3"
                        >
                          <option value="">Sélectionnez un rôle</option>
                          <option value="student">Étudiant</option>
                          <option value="helper">Helper</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <Label htmlFor="email" className="text-primary-text dark:text-dark-base-text">
                          Email *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange('email')(e.target.value)}
                          required
                          className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30 text-primary-text dark:text-dark-base-text"
                        />
                      </div>
                      <div>
                        <Label htmlFor="password" className="text-primary-text dark:text-dark-base-text">
                          Mot de passe *
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => handleChange('password')(e.target.value)}
                          required
                          className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30 text-primary-text dark:text-dark-base-text"
                        />
                      </div>
                    </>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-royal-blue hover:bg-royal-blue/90 text-white"
                    disabled={loading}
                  >
                    {loading ? '...' : isLogin ? 'Se connecter' : "S'inscrire"}
                  </Button>
                </form>

                <div className="text-center mt-6">
                  <Button
                    variant="link"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError('');
                      setFormData({
                        lastname: '',
                        firstname: '',
                        email: '',
                        password: '',
                        sexe: '',
                        birthdate: '',
                        role: '',
                        SkillsCategory: [],
                        avatar: '',
                      });
                    }}
                    className="text-royal-blue hover:text-royal-blue/80"
                  >
                    {isLogin
                      ? "Pas encore de compte ? S'inscrire"
                      : 'Déjà un compte ? Se connecter'}
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
