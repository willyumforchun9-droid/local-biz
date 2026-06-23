import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  const { businessName, businessEmail, previewUrl } = await request.json()

  const { data, error } = await resend.emails.send({
    from: 'Your Name <onboarding@resend.dev>',
    to: businessEmail,
    subject: `I built a free website for ${businessName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a1a1a;">Hi ${businessName} team,</h2>
        <p style="font-size: 16px; color: #444; line-height: 1.6;">
          I noticed your business doesn't have a website yet, so I went ahead and built one for you — completely free.
        </p>
        <p style="font-size: 16px; color: #444; line-height: 1.6;">
          You can preview it here:
        </p>
        <a href="${previewUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 14px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; margin: 10px 0;">
          View Your Free Website
        </a>
        <p style="font-size: 16px; color: #444; line-height: 1.6; margin-top: 20px;">
          If you'd like to use it, I can get it live online for just $75/month — that includes hosting, updates, and support.
        </p>
        <p style="font-size: 16px; color: #444; line-height: 1.6;">
          Just reply to this email or give me a call and we can get it set up today.
        </p>
        <p style="font-size: 16px; color: #444;">
          Best,<br/>
          <strong>Your Name</strong><br/>
          Your Phone Number
        </p>
      </div>
    `
  })

  if (error) return Response.json({ error })
  return Response.json({ success: true, data })
}