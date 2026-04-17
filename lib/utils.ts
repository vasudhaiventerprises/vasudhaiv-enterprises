export function sanitizeInput(input: string): string {
  if (!input) return "";
  return input
    .trim()
    .slice(0, 1000) // max length guard (slightly larger than guide for flexibility)
    .replace(/[<>\"'`]/g, '') // strip HTML/script chars
}

export function sanitizePhone(phone: string): string {
  if (!phone) return "";
  // Only allow digits, +, spaces, hyphens
  return phone.replace(/[^0-9+\-\s]/g, '').slice(0, 20)
}
