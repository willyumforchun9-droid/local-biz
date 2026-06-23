import { createClient } from '@supabase/supabase-js'

export async function POST(request) {
  const { name, type, city, phone } = await request.json()

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      messages: [{
        role: 'user',
        content: `Create a complete HTML website for ${name} a ${type} in ${city} phone ${phone}. Keep it under 600 lines. Include hero, services, about, contact. Return ONLY HTML starting with <!DOCTYPE html>`
      }]
    })
  })

  const data = await response.json()
  let html = data.content[0].text
  html = html.replace(/```html/g, '').replace(/```/g, '').trim()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { data: saved, error } = await supabase
    .from('websites')
    .insert({ business_name: name, city, phone, html })
    .select()
    .single()

  console.log('SAVED:', JSON.stringify(saved))
  console.log('ERROR:', JSON.stringify(error))

  if (saved) {
    const previewUrl = `${process.env.NEXT_PUBLIC_APP_URL}/preview/${saved.id}`
    return Response.json({ html, id: saved.id, previewUrl })
  }

  return Response.json({ html })
}