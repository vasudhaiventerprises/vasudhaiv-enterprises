const WATI_TOKEN = process.env.WATI_API_KEY
const WATI_ENDPOINT = process.env.WATI_ENDPOINT

export async function sendWhatsAppMessage(phone: string, templateName: string, parameters: { name: string, value: string }[]) {
  if (!WATI_TOKEN || !WATI_ENDPOINT) {
    console.warn("WATI credentials missing - skipping WhatsApp message.")
    return
  }

  // Formatting phone number for international standard (91XXXXXXXXXX)
  const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-12)

  try {
    const response = await fetch(`${WATI_ENDPOINT}/api/v1/sendTemplateMessage`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${WATI_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        template_name: templateName,
        broadcast_name: `Vasudhaiv_${templateName}`,
        receivers: [
          {
            whatsappNumber: cleanPhone,
            customParams: parameters
          }
        ]
      })
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error("WhatsApp trigger error:", error)
  }
}
