import { createClient } from './supabase-server'

export type UserRole = 'admin' | 'staff' | 'co_admin' | 'user'

export async function getUserProfile() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) return null

  // Use maybeSingle() to avoid PGRST116 error when row doesn't exist
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  // Ensure role and is_active have valid defaults even if columns are missing or row is null
  let role = profile?.role || 'user';
  
  // EMERGENCY BYPASS: Force admin role for the owner (Case-Insensitive)
  const userEmail = user.email?.toLowerCase();
  const masterAdmins = ['kishnakushwaha91@gmail.com', 'vasudhaiventerprises001@gmail.com', 'anshu@gmail.com'];
  
  if (userEmail && masterAdmins.includes(userEmail)) {
    role = 'admin';
  }

  const safeProfile = {
    id: user.id,
    role: role,
    is_active: profile?.is_active ?? true,
    full_name: profile?.full_name || user.email?.split('@')[0] || 'User',
    ...profile
  }

  return { ...user, ...safeProfile } as any
}

export async function getUserRole(): Promise<UserRole | null> {
  const profile = await getUserProfile()
  return profile?.role || null
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}
