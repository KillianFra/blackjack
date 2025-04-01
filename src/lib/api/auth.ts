import { supabase } from '../supabase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { LoginRequest, LoginResponse, RegisterRequest, User } from '$lib/auth/types';

const JWT_SECRET = 'your_jwt_secret';


export async function register(userData: RegisterRequest): Promise<LoginResponse> {
  const { username, password, confirmPwd } = userData;

  if (password !== confirmPwd) {
    throw new Error('Passwords do not match');
  }

  // Hash du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insertion de l'utilisateur dans la base de données Supabase
  const { data: user, error: insertError } = await supabase
    .from('users')
    .insert([{ username, password: hashedPassword }])
    .select() // Ajoutez cette ligne pour récupérer les données insérées
    .single();

  if (insertError || !user) {
    console.error('Insertion error details:', insertError);
    throw new Error(insertError?.message || 'User insertion failed');
  }

  // Création du token
  const token = jwt.sign({ sub: user.id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });

  return { token, user };
}

// Connexion d'un utilisateur
export async function login(email: string, password: string): Promise<LoginResponse> {
  // Vérification de l'utilisateur dans Supabase
  const { data: userRecord, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('username', email)
    .single();

  if (fetchError || !userRecord) {
    throw new Error('User not found');
  }

  // Vérifier le mot de passe
  const isPasswordValid = await bcrypt.compare(password, userRecord.password);

  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  const user: User = { id: userRecord.id.toString(), username: userRecord.username };
  const token = jwt.sign({ sub: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

  // Créer une session pour cet utilisateur dans la table 'sessions'
  const { error: sessionError } = await supabase
    .from('sessions')
    .insert([{ user_id: user.id, token, expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString() }]);

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  return { token, user };
}

// Déconnexion d'un utilisateur
export async function logout(token: string): Promise<void> {
  // Supprimer la session de la base de données Supabase
  const { error: deleteError } = await supabase
    .from('sessions')
    .delete()
    .eq('token', token);

  if (deleteError) {
    throw new Error(deleteError.message);
  }
}
