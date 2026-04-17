import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Direct client — referral API can be called without user session
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function POST(request: Request) {
  try {
    const { referral_code, lead_id } = await request.json()
    
    if (!referral_code || !lead_id) {
      return NextResponse.json({ success: false, message: 'Missing data' }, { status: 400 })
    }

    // 1. Find the user with this referral code
    const { data: profile, error: profileErr } = await getSupabase()
      .from('profiles')
      .select('id, full_name')
      .ilike('referral_code', referral_code.trim())
      .maybeSingle()

    if (profileErr || !profile) {
      return NextResponse.json({ success: false, message: 'Invalid or missing referral code' }, { status: 404 })
    }

    // 2. Track the referral in the referrals table
    const { error: insertErr } = await getSupabase()
      .from('referrals')
      .insert({
        referrer_id: profile.id,
        lead_id: lead_id,
        status: 'pending',
        reward_amount: 500
      })

    if (insertErr) {
      console.error("Referral insert failed:", insertErr)
      return NextResponse.json({ success: false, message: 'Failed to record referral' }, { status: 500 })
    }

    // 3. Update the lead with the referrer_id for cross-referencing
    await getSupabase()
      .from('leads')
      .update({ referred_by: profile.id })
      .eq('id', lead_id)

    return NextResponse.json({ success: true, referrer_name: profile.full_name })

  } catch (error) {
    console.error("Referral API Error:", error)
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
  }
}
