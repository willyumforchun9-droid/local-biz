'use client'
import { useState } from 'react'

export default function FindBusinesses() {
  const [city, setCity] = useState('')
  const [type, setType] = useState('')
  const [loading, setLoading] = useState(false)
  const [businesses, setBusinesses] = useState([])
  const [generating, setGenerating] = useState({})
  const [generated, setGenerated] = useState({})
  const [emails, setEmails] = useState({})

  const handleFind = async () => {
    setLoading(true)
    setBusinesses([])
    const res = await fetch('/api/find-businesses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city, type })
    })
    const data = await res.json()
    setBusinesses(data.businesses)
    setLoading(false)
  }

  const handleGenerate = async (business) => {
    setGenerating(prev => ({ ...prev, [business.name]: 'generating' }))
    
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: business.name, type, city, phone: business.phone })
    })
    const data = await res.json()
    setGenerated(prev => ({ ...prev, [business.name]: data }))
    setGenerating(prev => ({ ...prev, [business.name]: 'emailing' }))

    if (emails[business.name] && data.previewUrl) {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: business.name,
          businessEmail: emails[business.name],
          previewUrl: data.previewUrl
        })
      })
    }

    setGenerating(prev => ({ ...prev, [business.name]: 'done' }))

    if (data.html) {
      const blob = new Blob([data.html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-2">Find Businesses Without Websites</h1>
      <p className="text-gray-400 mb-8">Find leads, generate their website, and email them automatically.</p>
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-lg flex flex-col gap-4 mb-10">
        <input className="bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none" placeholder="City (e.g. Laurel)" onChange={e => setCity(e.target.value)} />
        <input className="bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none" placeholder="Business Type (e.g. barbershop)" onChange={e => setType(e.target.value)} />
        <button onClick={handleFind} disabled={loading} className="bg-blue-600 hover:bg-blue-500 transition rounded-lg px-4 py-3 font-semibold text-white">
          {loading ? 'Searching...' : 'Find Businesses'}
        </button>
      </div>
      {businesses.length > 0 && (
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold mb-6">Found {businesses.length} businesses — {businesses.filter(b => !b.hasWebsite).length} without websites</h2>
          <div className="flex flex-col gap-4">
            {businesses.map((b, i) => (
              <div key={i} className={`bg-gray-900 rounded-xl p-6 ${!b.hasWebsite ? 'border border-green-500' : ''}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold">{b.name}</h3>
                      {!b.hasWebsite && <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">No Website</span>}
                      {b.hasWebsite && <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full">Has Website</span>}
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{b.address}</p>
                    <p className="text-gray-400 text-sm">{b.phone}</p>
                    {b.rating && <p className="text-yellow-400 text-sm mt-1">⭐ {b.rating}</p>}
                  </div>
                </div>
                <div className="flex gap-3 mt-3">
                  <input
                    className="bg-gray-800 rounded-lg px-3 py-2 text-white placeholder-gray-500 outline-none flex-1 text-sm"
                    placeholder="Business email (optional)"
                    onChange={e => setEmails(prev => ({ ...prev, [b.name]: e.target.value }))}
                  />
                  <button
                    onClick={() => handleGenerate(b)}
                    disabled={!!generating[b.name] && generating[b.name] !== 'done'}
                    className="bg-green-600 hover:bg-green-500 transition rounded-lg px-4 py-2 font-semibold text-white text-sm whitespace-nowrap"
                  >
                    {generating[b.name] === 'generating' ? 'Generating...' :
                     generating[b.name] === 'emailing' ? 'Sending Email...' :
                     generating[b.name] === 'done' ? '✓ Sent!' :
                     'Generate & Email'}
                  </button>
                </div>
                {generated[b.name]?.previewUrl && (
                  <p className="text-green-400 text-sm mt-2">Preview: <a href={generated[b.name].previewUrl} target="_blank" className="underline">{generated[b.name].previewUrl}</a></p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {businesses.length === 0 && !loading && <p className="text-gray-500">No results yet. Enter a city and business type above.</p>}
    </main>
  )
}