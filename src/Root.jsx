import { useState, useEffect } from 'react'
import { supabase } from './supabase.js'
import AuthScreen from './AuthScreen.jsx'
import App from './App.jsx'

export default function Root() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Vérifie si l'utilisateur est déjà connecté
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Écoute les changements de connexion
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div style={{
        background: '#0D0F14', minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16
      }}>
        <div style={{ fontSize: 48 }}>🌿</div>
        <div style={{ color: '#7EE8A2', fontSize: 22, fontWeight: 700, fontFamily: 'sans-serif' }}>
          Vita<span style={{ color: '#EEF0F6' }}>Zen</span>
        </div>
        <div style={{ color: '#6B728E', fontSize: 14, fontFamily: 'sans-serif' }}>Chargement...</div>
      </div>
    )
  }

  if (!session) {
    return <AuthScreen onLogin={setSession} />
  }

  return <App session={session} />
}
