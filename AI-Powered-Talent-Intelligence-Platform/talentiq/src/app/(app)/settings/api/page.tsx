'use client'

import { useState, useEffect } from 'react'
import { KeyRound, Mail, BrainCircuit, ExternalLink } from 'lucide-react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import api from '@/lib/api'

export default function ApiSettingsPage() {
  const { user } = useCurrentUser()

  const [savingGemini, setSavingGemini] = useState(false)
  const [geminiError, setGeminiError] = useState<string | null>(null)
  const [geminiSuccess, setGeminiSuccess] = useState(false)

  const [savingEmail, setSavingEmail] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [emailSuccess, setEmailSuccess] = useState(false)

  const [geminiKey, setGeminiKey] = useState('')
  const [emailKeys, setEmailKeys] = useState({
    emailUser: '',
    clientId: '',
    clientSecret: '',
    refreshToken: ''
  })

  useEffect(() => {
    if (user?.company?.apiKeys) {
      setGeminiKey(user.company.apiKeys.geminiApiKey || '')
      setEmailKeys({
        emailUser: user.company.apiKeys.emailUser || '',
        clientId: user.company.apiKeys.clientId || '',
        clientSecret: user.company.apiKeys.clientSecret || '',
        refreshToken: user.company.apiKeys.refreshToken || ''
      })
    }
  }, [user])

  const handleSaveGemini = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.company?.id) return

    setSavingGemini(true)
    setGeminiError(null)
    setGeminiSuccess(false)

    try {
      const updatedKeys = { 
        ...user.company.apiKeys, 
        geminiApiKey: geminiKey 
      }
      await api.patch(`/companies/\${user.company.id}`, { apiKeys: updatedKeys })
      setGeminiSuccess(true)
      setTimeout(() => setGeminiSuccess(false), 3000)
    } catch (err: any) {
      setGeminiError(err.response?.data?.error || 'Failed to save Gemini API key')
    } finally {
      setSavingGemini(false)
    }
  }

  const handleSaveEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.company?.id) return

    setSavingEmail(true)
    setEmailError(null)
    setEmailSuccess(false)

    try {
      const updatedKeys = { 
        ...user.company.apiKeys, 
        ...emailKeys 
      }
      await api.patch(`/companies/\${user.company.id}`, { apiKeys: updatedKeys })
      setEmailSuccess(true)
      setTimeout(() => setEmailSuccess(false), 3000)
    } catch (err: any) {
      setEmailError(err.response?.data?.error || 'Failed to save Email credentials')
    } finally {
      setSavingEmail(false)
    }
  }

  return (
    <div className="flex flex-col gap-[32px] max-w-[800px]">
      <div>
        <h1 className="font-display text-[26px] font-bold text-neutral-900 tracking-tight">API & Integrations</h1>
        <p className="font-body text-[14px] text-neutral-500 mt-[4px]">Configure external services by providing your own API credentials.</p>
      </div>

      <div className="flex flex-col gap-[32px]">
        
        {/* AI Credentials */}
        <form onSubmit={handleSaveGemini} className="bg-white rounded-[16px] border border-neutral-100 shadow-sm overflow-hidden">
          <div className="p-[24px] border-b border-neutral-100 bg-neutral-50/50 flex items-start justify-between gap-[16px]">
            <div className="flex gap-[16px]">
              <div className="w-[40px] h-[40px] bg-purple-50 rounded-[12px] flex items-center justify-center shrink-0">
                <BrainCircuit size={20} className="text-purple-600" />
              </div>
              <div>
                <h2 className="font-display text-[18px] font-bold text-neutral-900">Google Gemini AI</h2>
                <p className="font-body text-[13px] text-neutral-500 mt-[4px] leading-relaxed max-w-[500px]">
                  Power the AI Brain, candidate scorecards, and cross-job matching with your own Gemini API key. If left blank, TalentIQ will use its default rate-limited key.
                </p>
              </div>
            </div>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="h-[32px] px-[12px] bg-white border border-neutral-200 text-neutral-600 rounded-[6px] text-[12px] font-semibold hover:bg-neutral-50 transition-colors flex items-center gap-[6px] shrink-0 shadow-sm"
            >
              Get API Key <ExternalLink size={12} />
            </a>
          </div>
          
          <div className="p-[24px]">
            {geminiError && (
              <div className="mb-[16px] p-[12px] bg-red-50 text-red-600 border border-red-100 rounded-[8px] text-[13px] font-body">
                {geminiError}
              </div>
            )}
            {geminiSuccess && (
              <div className="mb-[16px] p-[12px] bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-[8px] text-[13px] font-body">
                Gemini API key saved successfully!
              </div>
            )}

            <div className="flex flex-col gap-[6px] mb-[24px]">
              <label className="font-body text-[13px] font-semibold text-neutral-700">GEMINI_API_KEY</label>
              <input 
                type="password" 
                value={geminiKey}
                onChange={e => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="h-[40px] px-[12px] bg-white border border-neutral-200 rounded-[8px] text-[13px] focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 font-mono" 
              />
            </div>
            
            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={savingGemini} 
                className="h-[36px] px-[16px] bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-body text-[13px] font-semibold rounded-[8px] transition-colors flex items-center gap-[6px]"
              >
                {savingGemini ? <LoadingSpinner size="sm" /> : <KeyRound size={14} />} Save AI Key
              </button>
            </div>
          </div>
        </form>

        {/* Email Credentials */}
        <form onSubmit={handleSaveEmail} className="bg-white rounded-[16px] border border-neutral-100 shadow-sm overflow-hidden mb-[64px]">
          <div className="p-[24px] border-b border-neutral-100 bg-neutral-50/50 flex items-start justify-between gap-[16px]">
            <div className="flex gap-[16px]">
              <div className="w-[40px] h-[40px] bg-blue-50 rounded-[12px] flex items-center justify-center shrink-0">
                <Mail size={20} className="text-blue-600" />
              </div>
              <div>
                <h2 className="font-display text-[18px] font-bold text-neutral-900">Gmail OAuth Credentials</h2>
                <p className="font-body text-[13px] text-neutral-500 mt-[4px] leading-relaxed max-w-[500px]">
                  Configure your own Google Cloud OAuth app to send emails directly from your company's domain using TalentIQ. 
                </p>
              </div>
            </div>
            <a 
              href="https://console.cloud.google.com/apis/credentials" 
              target="_blank" 
              rel="noopener noreferrer"
              className="h-[32px] px-[12px] bg-white border border-neutral-200 text-neutral-600 rounded-[6px] text-[12px] font-semibold hover:bg-neutral-50 transition-colors flex items-center gap-[6px] shrink-0 shadow-sm"
            >
              Cloud Console <ExternalLink size={12} />
            </a>
          </div>
          
          <div className="p-[24px] flex flex-col gap-[20px]">
            {emailError && (
              <div className="p-[12px] bg-red-50 text-red-600 border border-red-100 rounded-[8px] text-[13px] font-body">
                {emailError}
              </div>
            )}
            {emailSuccess && (
              <div className="p-[12px] bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-[8px] text-[13px] font-body">
                Email OAuth credentials saved successfully!
              </div>
            )}

            <div className="p-[16px] bg-blue-50 border border-blue-100 rounded-[12px]">
              <h4 className="font-body text-[13px] font-bold text-blue-900 mb-[8px]">How to configure Gmail OAuth:</h4>
              <ol className="list-decimal list-inside font-body text-[13px] text-blue-800 space-y-[4px]">
                <li>Go to Google Cloud Console and create a project.</li>
                <li>Enable the <strong>Gmail API</strong>.</li>
                <li>Configure OAuth Consent Screen and add the <strong>https://mail.google.com/</strong> scope.</li>
                <li>Create OAuth Client ID credentials (Web application).</li>
                <li>Generate a Refresh Token using OAuth2 Playground.</li>
              </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              <div className="flex flex-col gap-[6px]">
                <label className="font-body text-[13px] font-semibold text-neutral-700">Sender Email (EMAIL_USER)</label>
                <input 
                  type="email" 
                  value={emailKeys.emailUser}
                  onChange={e => setEmailKeys({...emailKeys, emailUser: e.target.value})}
                  placeholder="careers@yourcompany.com"
                  className="h-[40px] px-[12px] bg-white border border-neutral-200 rounded-[8px] text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500" 
                />
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className="font-body text-[13px] font-semibold text-neutral-700">Client ID (CLIENT_ID)</label>
                <input 
                  type="text" 
                  value={emailKeys.clientId}
                  onChange={e => setEmailKeys({...emailKeys, clientId: e.target.value})}
                  placeholder="123456789-abc.apps.googleusercontent.com"
                  className="h-[40px] px-[12px] bg-white border border-neutral-200 rounded-[8px] text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-mono" 
                />
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className="font-body text-[13px] font-semibold text-neutral-700">Client Secret (CLIENT_SECRET)</label>
                <input 
                  type="password" 
                  value={emailKeys.clientSecret}
                  onChange={e => setEmailKeys({...emailKeys, clientSecret: e.target.value})}
                  placeholder="GOCSPX-..."
                  className="h-[40px] px-[12px] bg-white border border-neutral-200 rounded-[8px] text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-mono" 
                />
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className="font-body text-[13px] font-semibold text-neutral-700">Refresh Token (REFRESH_TOKEN)</label>
                <input 
                  type="password" 
                  value={emailKeys.refreshToken}
                  onChange={e => setEmailKeys({...emailKeys, refreshToken: e.target.value})}
                  placeholder="1//0e..."
                  className="h-[40px] px-[12px] bg-white border border-neutral-200 rounded-[8px] text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-mono" 
                />
              </div>
            </div>

            <div className="flex justify-end mt-[8px]">
              <button 
                type="submit" 
                disabled={savingEmail} 
                className="h-[36px] px-[16px] bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-body text-[13px] font-semibold rounded-[8px] transition-colors flex items-center gap-[6px]"
              >
                {savingEmail ? <LoadingSpinner size="sm" /> : <KeyRound size={14} />} Save Credentials
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  )
}
