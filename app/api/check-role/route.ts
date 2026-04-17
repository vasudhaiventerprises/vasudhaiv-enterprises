import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get the currently authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ role: null, error: 'Not authenticated' }, { status: 401 })
    }

    // Call the SECURITY DEFINER function that bypasses RLS
    const { data, error } = await supabase.rpc('get_my_role')

    if (error) {
      console.error('get_my_role RPC error:', error)
      
      // Fallback: try direct query (may fail due to RLS but worth trying)
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .maybeSingle()

      return NextResponse.json({ 
        role: profile?.role || 'user', 
        full_name: profile?.full_name || user.email?.split('@')[0] || 'User' 
      })
    }

    return NextResponse.json({ 
      role: data?.role || 'user', 
      full_name: data?.full_name || user.email?.split('@')[0] || 'User'
    })

  } catch (err) {
    console.error('Check-role API error:', err)
    return NextResponse.json({ role: null, error: 'Server error' }, { status: 500 })
  }
}
