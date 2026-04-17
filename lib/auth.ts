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

  if (profileError) {
    console.error('Error fetching profile:', profileError)
  }

  if (!profile) {
    // Profile row is missing — return auth user with default role
    return { ...user, role: 'user' as UserRole, full_name: user.email?.split('@')[0] || null }
  }

  return { ...user, ...profile } as any
}

export async function getUserRole(): Promise<UserRole | null> {
  const profile = await getUserProfile()
  return profile?.role || null
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}
