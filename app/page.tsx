'use client'
import { useState } from 'react'

export default function Home() {
  const [form, setForm] = useState({ name: '', type: '', city: '', phone: '' })
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    const res = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    const blob = new Blob([data.html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
    setLoading(false)
  }

  return (
    <main className='min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8'>
      <h1 className='text-4xl font-bold mb-4'>Local Biz Website Builder</h1>
      <p className='text-gray-400 text-lg mb-8'>Generate a professional website for any local business in seconds.</p>
      <div className='bg-gray-900 rounded-2xl p-8 w-full max-w-lg flex flex-col gap-4'>
        <input className='bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none' placeholder='Business Name' onChange={e => setForm({...form, name: e.target.value})} />
        <input className='bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none' placeholder='Business Type' onChange={e => setForm({...form, type: e.target.value})} />
        <input className='bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none' placeholder='City' onChange={e => setForm({...form, city: e.target.value})} />
        <input className='bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none' placeholder='Phone Number' onChange={e => setForm({...form, phone: e.target.value})} />
        <button onClick={handleGenerate} disabled={loading} className='bg-blue-600 hover:bg-blue-500 transition rounded-lg px-4 py-3 font-semibold text-white'>{loading ? 'Generating...' : 'Generate Website'}</button>
      </div>
    </main>
  )
}
