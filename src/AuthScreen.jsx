import { useState } from 'react'
import { supabase } from './supabase.js'

const C = {
  bg:"#0D0F14", surface:"#13161E", card:"#191D28", border:"#252A38",
  accent:"#7EE8A2", gold:"#F5C842", coral:"#FF6B6B",
  sky:"#5BC4FF", lavender:"#B69EFF", text:"#EEF0F6", muted:"#6B728E",
}

export default function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleSubmit = async () => {
    setError(null)
    setSuccess(null)
    if (!email || !password) { setError('Remplis tous les champs.'); return }
    if (password.length < 6) { setError('Mot de passe trop court (6 caractères min).'); return }
    setLoading(true)

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name } }
      })
      if (error) { setError(error.message); setLoading(false); return }
      if (data?.user?.identities?.length === 0) {
        setError('Cet email est déjà utilisé.')
        setLoading(false); return
      }
      setSuccess('✅ Compte créé ! Vérifie ton email pour confirmer.')
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message === 'Invalid login credentials'
          ? 'Email ou mot de passe incorrect.'
          : error.message)
        setLoading(false); return
      }
      onLogin(data.session)
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', background: C.card, border: `1px solid ${C.border}`,
    borderRadius: 14, padding: '14px 16px', color: C.text, fontSize: 15,
    outline: 'none', boxSizing: 'border-box', fontFamily: "'DM Sans',sans-serif",
    marginBottom: 12,
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      <div style={{ fontFamily:"'DM Sans',sans-serif", background: C.bg, minHeight: '100vh', color: C.text, maxWidth: 420, margin: '0 auto', position: 'relative', overflow: 'hidden' }}>

        {/* Fond décoratif */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:0 }}>
          <div style={{ position:'absolute', top:-80, left:-60, width:280, height:280, borderRadius:'50%', background:`radial-gradient(circle,${C.lavender}22 0%,transparent 70%)` }}/>
          <div style={{ position:'absolute', bottom:100, right:-60, width:220, height:220, borderRadius:'50%', background:`radial-gradient(circle,${C.accent}18 0%,transparent 70%)` }}/>
        </div>

        <div style={{ position:'relative', zIndex:1, padding:'60px 28px 40px', display:'flex', flexDirection:'column', minHeight:'100vh' }}>

          {/* Logo */}
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <div style={{ fontSize:56, marginBottom:12 }}>🌿</div>
            <div style={{ fontSize:32, fontWeight:800, letterSpacing:'-1px' }}>
              Vita<span style={{ color:C.accent }}>Zen</span>
            </div>
            <div style={{ fontSize:14, color:C.muted, marginTop:6 }}>
              {mode === 'login' ? 'Bon retour parmi nous 👋' : 'Crée ton compte gratuitement'}
            </div>
          </div>

          {/* Formulaire */}
          <div style={{ flex:1 }}>
            {mode === 'signup' && (
              <input
                type="text" placeholder="Ton prénom"
                value={name} onChange={e => setName(e.target.value)}
                style={inputStyle}
              />
            )}
            <input
              type="email" placeholder="Ton adresse email"
              value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={inputStyle}
            />
            <input
              type="password" placeholder="Mot de passe (6 caractères min)"
              value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={inputStyle}
            />

            {error && (
              <div style={{ background:`${C.coral}18`, border:`1px solid ${C.coral}44`, borderRadius:12, padding:'12px 16px', marginBottom:12, fontSize:13, color:C.coral }}>
                ⚠️ {error}
              </div>
            )}
            {success && (
              <div style={{ background:`${C.accent}18`, border:`1px solid ${C.accent}44`, borderRadius:12, padding:'12px 16px', marginBottom:12, fontSize:13, color:C.accent }}>
                {success}
              </div>
            )}

            <button
              onClick={handleSubmit} disabled={loading}
              style={{ width:'100%', padding:'16px', borderRadius:16, background:loading?C.border:C.accent, color:'#000', fontWeight:800, fontSize:16, border:'none', cursor:loading?'default':'pointer', marginBottom:16, transition:'all 0.2s' }}>
              {loading ? '...' : mode === 'login' ? 'Se connecter →' : "Créer mon compte →"}
            </button>

            <div style={{ textAlign:'center', fontSize:14, color:C.muted }}>
              {mode === 'login' ? "Pas encore de compte ? " : "Déjà un compte ? "}
              <span
                onClick={() => { setMode(mode==='login'?'signup':'login'); setError(null); setSuccess(null) }}
                style={{ color:C.accent, fontWeight:700, cursor:'pointer' }}>
                {mode === 'login' ? "S'inscrire" : "Se connecter"}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div style={{ textAlign:'center', marginTop:32, fontSize:11, color:C.muted, lineHeight:1.7 }}>
            En continuant, tu acceptes nos conditions d'utilisation.<br/>
            Tes données sont sécurisées et ne sont jamais revendues. 🔒
          </div>
        </div>
      </div>
    </>
  )
}
