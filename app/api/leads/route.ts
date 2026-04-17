import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sanitizeInput, sanitizePhone } from '@/lib/utils'

// Use a direct Supabase client (NOT the cookie-based SSR one)
// Lead capture is anonymous — no user session exists
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

const rateLimitMap = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 60 * 1000 // 1 hour
  const maxRequests = 10 // 10 lead submissions per IP per hour

  const timestamps = rateLimitMap.get(ip) || []
  const recent = timestamps.filter(t => now - t < windowMs)

  if (recent.length >= maxRequests) return true

  recent.push(now)
  rateLimitMap.set(ip, recent)
  return false
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many submissions. Please try again later.' },
      { status: 429 }
    )
  }

  try {
    const body = await req.json()

    // Validation
    if (!body.full_name || !body.phone) {
      return NextResponse.json(
        { error: 'Name and phone number are required.' },
        { status: 400 }
      )
    }

    // Sanitization
    const payload = {
      full_name: sanitizeInput(body.full_name),
      phone: sanitizePhone(body.phone),
      city: sanitizeInput(body.city || ''),
      roof_type: sanitizeInput(body.roof_type || ''),
      bill_range: sanitizeInput(body.bill_range || ''),
      referral_code_used: sanitizeInput(body.referral_code_used || ''),
      message: sanitizeInput(body.message || ''),
      status: "new"
    }

    // Referral logic
    let referred_by = null
    if (payload.referral_code_used) {
      const { data: profile } = await getSupabase()
        .from("profiles")
        .select("id")
        .ilike("referral_code", payload.referral_code_used.trim())
        .maybeSingle()
      if (profile) referred_by = profile.id
    }

    const { data: newLead, error: insertError } = await getSupabase()
      .from("leads")
      .insert({ ...payload, referred_by })
      .select('id')
      .single()

    if (insertError) {
      console.error("Lead insert error:", insertError)
      return NextResponse.json(
        { error: 'Failed to save your request. Please try calling us directly.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, leadId: newLead.id })
  } catch (error: any) {
    console.error("Lead API Error:", error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again or call us directly.' },
      { status: 500 }
    )
  }
}
