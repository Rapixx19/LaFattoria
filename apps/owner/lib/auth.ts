import { redirect } from 'next/navigation';
import { createServerClient } from './supabase/server';
import type { UserRole, Profile } from '@lafattoria/supabase';

export async function getCurrentUser(): Promise<Profile | null> {
  const supabase = await createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return profile;
}

export async function requireAuth(): Promise<Profile> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

export async function requireRole(roles: UserRole[]): Promise<Profile> {
  const user = await getCurrentUser();
  if (!user || !roles.includes(user.role as UserRole)) {
    redirect('/login');
  }
  return user;
}
