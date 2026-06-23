import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function PreviewPage({ params }) {
  const { id } = await params

  const { data, error } = await supabase
    .from('websites')
    .select('*')
    .eq('id', id)
    .single()

  if (!data) return (
    <div style={{ padding: 40, fontFamily: 'Arial' }}>
      <h1>Website not found</h1>
      <p>Error: {JSON.stringify(error)}</p>
    </div>
  )

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <iframe
        srcDoc={data.html}
        style={{ width: '100%', height: '100%', border: 'none' }}
        sandbox="allow-scripts"
      />
    </div>
  )
}