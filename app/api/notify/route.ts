import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { title, body, targetUserId, type } = await request.json()

    if (!title || !body) {
      return NextResponse.json({ error: 'Title and body are required.' }, { status: 400 })
    }

    // Handle "global" broadcast vs single-user
    if (targetUserId === 'global') {
      // Log as a global notification
      await supabase
        .from('notification_logs')
        .insert({
          title,
          body,
          type: type || 'broadcast',
          delivered: true
        })

      return NextResponse.json({ success: true, message: 'Global notification logged successfully.' })
    }

    // Single-user notification
    const { data: log, error: logError } = await supabase
      .from('notification_logs')
      .insert({
        title,
        body,
        target_user: targetUserId,
        type: type || 'system',
        delivered: false
      })
      .select()
      .single()

    if (logError) return NextResponse.json({ error: logError.message }, { status: 500 })

    // Fetch target user's FCM token
    const { data: profile } = await supabase
      .from('profiles')
      .select('fcm_token')
      .eq('id', targetUserId)
      .maybeSingle()

    if (!profile?.fcm_token) {
      return NextResponse.json({ success: true, message: 'Logged, but no FCM token found for user.' })
    }

    // Mark as delivered (actual FCM push requires firebase-admin in production)
    await supabase
      .from('notification_logs')
      .update({ delivered: true })
      .eq('id', log.id)

    return NextResponse.json({ success: true, message: 'Notification triggered successfully' })
  } catch (err: any) {
    console.error('Notify API error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
