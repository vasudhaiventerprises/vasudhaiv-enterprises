'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { sendWhatsAppMessage } from './whatsapp'

export async function takeJob(jobId: string, staffId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('service_requests')
    .update({ 
      assigned_staff: staffId,
      status: 'assigned' 
    })
    .eq('id', jobId)

  if (error) {
    console.error('Error taking job:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/staff')
  return { success: true }
}

export async function completeJob(jobId: string, note: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('service_requests')
    .update({ 
      status: 'completed',
      completion_note: note,
      completed_at: new Date().toISOString()
    })
    .eq('id', jobId)

  if (error) {
    console.error('Error completing job:', error)
    return { success: false, error: error.message }
  }

  // Trigger WhatsApp Notification
  try {
     const { data: job } = await supabase
       .from('service_requests')
       .select('*, client:profiles!client_id(full_name, phone)')
       .eq('id', jobId)
       .single()

     if (job?.client?.phone) {
        await sendWhatsAppMessage(
           job.client.phone, 
           'job_completion', 
           [
              { name: 'customer_name', value: job.client.full_name },
              { name: 'job_type', value: job.issue_type }
           ]
        )
     }
  } catch (notifyErr) {
     console.error("WhatsApp notification failed:", notifyErr)
  }

  revalidatePath('/staff')
  return { success: true }
}
