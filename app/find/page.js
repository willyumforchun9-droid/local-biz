'use client'
import { useState } from 'react'

export default function FindBusinesses() {
  const [city, setCity] = useState('')
  const [type, setType] = useState('')
  const [loading, setLoading] = useState(false)
  const [businesses, setBusinesses] = useState([])
  const [generating, setGenerating] = useState({})
  const [generated, setGenerated] = useState({})

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
    setGenerating(prev => ({ ...prev, [business.name]: true }))
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: business.name, type: type, city: city, phone: business.phone })
    })
    const data = await res.json()
    setGenerated(prev => ({ ...prev, [business.name]: data.html }))
    setGenerating(prev => ({ ...prev, [business.name]: false }))
    const blob = new Blob([data.html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-2">Find Businesses Without Websites</h1>
      <p className="text-gray-400 mb-8">Find leads, generate their website, and close them.</p>
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-lg flex flex-col gap-4 mb-10">
        <input className="bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none" placeholder="City (e.g. Baltimore)" onChange={e => setCity(e.target.value)} />
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
              <div key={i} className={`bg-gray-900 rounded-xl p-6 flex justify-between items-center ${!b.hasWebsite ? 'border border-green-500' : ''}`}>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold">{b.name}</h3>
                    {!b.hasWebsite && <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">No Website</span>}
                    {b.hasWebsite && <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full">Has Website</span>}
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{b.address}</p>
                  <p className="text-gray-400 text-sm">{b.phone}</p>
                  {b.rating && <p className="text-yellow-400 text-sm mt-1">stars {b.rating}</p>}
                </div>
                <button onClick={() => handleGenerate(b)} disabled={generating[b.name]} className="bg-green-600 hover:bg-green-500 transition rounded-lg px-4 py-2 font-semibold text-white text-sm ml-4 whitespace-nowrap">
                  {generating[b.name] ? 'Generating...' : generated[b.name] ? 'Generated!' : 'Generate Site'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {businesses.length === 0 && !loading && <p className="text-gray-500">No results yet. Enter a city and business type above.</p>}
    </main>
  )
}