'use client'

import { useState } from 'react'
import SectionWrapper from '@/components/marketing/SectionWrapper'
import { MessageSquare, Mail, MapPin, Phone, Loader2, CheckCircle2 } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await res.json()
      if (res.ok) {
        setIsSuccess(true)
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      setError('Network error. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <section className="bg-white pt-32 pb-20 relative overflow-hidden border-b border-neutral-100">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-10 blur-[100px]"></div>
        <div className="max-w-[1200px] mx-auto px-5 relative z-10">
          <div className="text-center max-w-[800px] mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 font-semibold text-sm mb-6 border border-blue-100">
              <MessageSquare className="w-4 h-4" />
              <span>Get in Touch</span>
            </div>
            <h1 className="font-display text-[48px] md:text-[56px] font-extrabold text-neutral-900 tracking-tight leading-[1.1] mb-6">
              Let's talk about your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">hiring goals</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-600">
              Our team of experts is ready to help you transform your recruitment process. Fill out the form and we'll be in touch shortly.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-5 gap-12 max-w-[1000px] mx-auto">
            <div className="lg:col-span-2 flex flex-col gap-8">
              <div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Chat with sales</h3>
                <p className="text-neutral-600 mb-4">Interested in TalentIQ? Just pick up the phone to chat with a member of our sales team.</p>
                <div className="flex items-center gap-3 text-neutral-900 font-medium">
                  <Phone className="w-5 h-5 text-blue-600" />
                  +1 (800) 555-0199
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Email support</h3>
                <p className="text-neutral-600 mb-4">Need help with your account? We're here to help.</p>
                <div className="flex items-center gap-3 text-neutral-900 font-medium">
                  <Mail className="w-5 h-5 text-blue-600" />
                  support@talentiq.com
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Visit us</h3>
                <p className="text-neutral-600 mb-4">Come say hello at our headquarters.</p>
                <div className="flex items-start gap-3 text-neutral-900 font-medium">
                  <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span>100 Innovation Way<br/>San Francisco, CA 94105</span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-3">
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-neutral-100 min-h-[480px] flex flex-col justify-center">
                {isSuccess ? (
                  <div className="text-center flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-neutral-900 mb-2">Message Sent!</h3>
                    <p className="text-neutral-600 mb-8 max-w-[300px]">
                      Thanks for reaching out, {formData.firstName}. Our team will get back to you shortly!
                    </p>
                    <button 
                      onClick={() => { setIsSuccess(false); setFormData({ firstName: '', lastName: '', email: '', message: '' }) }}
                      className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
                        {error}
                      </div>
                    )}
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="text-sm font-medium text-neutral-900">First Name</label>
                        <input 
                          type="text" 
                          id="firstName" 
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          className="w-full h-11 px-4 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                          placeholder="Jane" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="text-sm font-medium text-neutral-900">Last Name</label>
                        <input 
                          type="text" 
                          id="lastName" 
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          className="w-full h-11 px-4 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                          placeholder="Doe" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-neutral-900">Work Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full h-11 px-4 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                        placeholder="jane@company.com" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-neutral-900">How can we help?</label>
                      <textarea 
                        id="message" 
                        required
                        rows={4} 
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full p-4 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none" 
                        placeholder="Tell us about your hiring needs..."
                      ></textarea>
                    </div>
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full h-12 inline-flex items-center justify-center font-body text-[15px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Sending...
                        </>
                      ) : (
                        'Send message'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
