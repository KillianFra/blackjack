import { supabase } from '../supabase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { LoginRequest, LoginResponse, RegisterRequest, User } from '$lib/auth/types';
import { env } from '$env/dynamic/public';
import { error } from 'console';


export async function register(registerData: RegisterRequest): Promise<LoginResponse> {
  const { username, password, confirmPwd } = registerData;

  if (password !== confirmPwd) {
    throw new Error('Passwords do not match');
  }

  // Hash du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insertion de l'utilisateur dans la base de données Supabase
  const { data: user, error: insertError } = await supabase
    .from('users')
    .insert([{ username, password: hashedPassword }])
    .select()
    .single();

    console.log('User registered:', user, error);
  if (insertError || !user) {
    console.error('Insertion error details:', insertError);
    throw new Error(insertError?.message || 'User insertion failed');
  }

  const userResponse: User = { id: user.id.toString(), username: user.username };
  const token = jwt.sign({ sub: user.id, username: user.username }, env.PUBLIC_SECRET_TOKEN, { expiresIn: '1h' });

  return { token, user: userResponse };
}

// Connexion d'un utilisateur
export async function login(username: string, password: string): Promise<LoginResponse> {
  // Vérification de l'utilisateur dans Supabase
  const { data: userRecord, error: fetchError } = await supabase
    .from('users')
    .select()
    .eq('username', username)
    .limit(1)
    .single()
  console.log('User record:', userRecord);
  if (fetchError || !userRecord) {
    throw new Error('User not found');
  }

  // Vérifier le mot de passe
  const isPasswordValid = await bcrypt.compare(password, userRecord.password);

  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  const user: User = { id: userRecord.id.toString(), username: userRecord.username };
  const token = jwt.sign({ sub: user.id, username: user.username }, env.PUBLIC_SECRET_TOKEN, { expiresIn: '1h' });

  return { token, user };
}

// Déconnexion d'un utilisateur
export async function logout(token: string): Promise<void> {
}
