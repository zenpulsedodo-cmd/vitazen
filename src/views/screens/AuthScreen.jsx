import { useState } from "react";
import { C } from "../../constants/colors.js";
import { signIn, signUp } from "../../models/authModel.js";
import { getLabel } from "../../constants/labels.js";

export default function AuthScreen({ onLogin }) {
  const [mode,     setMode]     = useState("login");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [name,     setName]     = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [success,  setSuccess]  = useState(null);
  const [lang,     setLang]     = useState("fr");

  const L = getLabel(lang);

  const reset = () => { setError(null); setSuccess(null); };

  const handleSubmit = async () => {
    reset();
    if (!email || !password) { setError("Remplis tous les champs."); return; }
    if (password.length < 6) { setError("Mot de passe : 6 caractères minimum."); return; }
    setLoading(true);

    if (mode === "signup") {
      const { error: e } = await signUp(email, password, name);
      if (e === "EMAIL_EXISTS") { setError("Cet email est déjà utilisé."); }
      else if (e)               { setError(e); }
      else                      { setSuccess("✅ Compte créé ! Tu peux te connecter."); setMode("login"); }
    } else {
      const { session, error: e } = await signIn(email, password);
      if (e) { setError("Email ou mot de passe incorrect."); }
      else   { onLogin(session); }
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%", background: C.card, border: `1px solid ${C.border}`,
    borderRadius: 14, padding: "14px 16px", color: C.text, fontSize: 15,
    outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans',sans-serif", marginBottom: 12,
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ fontFamily: "'DM Sans',sans-serif", background: C.bg, minHeight: "100vh", color: C.text, maxWidth: 420, margin: "0 auto", position: "relative", overflow: "hidden" }}>

        {/* Background glows */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
          <div style={{ position: "absolute", top: -80, left: -60, width: 280, height: 280, borderRadius: "50%", background: `radial-gradient(circle,${C.lavender}22 0%,transparent 70%)` }} />
          <div style={{ position: "absolute", bottom: 100, right: -60, width: 220, height: 220, borderRadius: "50%", background: `radial-gradient(circle,${C.accent}18 0%,transparent 70%)` }} />
        </div>

        <div style={{ position: "relative", zIndex: 1, padding: "60px 28px 40px", display: "flex", flexDirection: "column", minHeight: "100vh" }}>

          {/* Language picker */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 32 }}>
            {[{ id: "fr", flag: "🇫🇷" }, { id: "en", flag: "🇬🇧" }, { id: "es", flag: "🇪🇸" }].map((l) => (
              <div key={l.id} onClick={() => setLang(l.id)}
                style={{ padding: "6px 10px", borderRadius: 10, border: `1px solid ${lang === l.id ? C.accent : C.border}`, background: lang === l.id ? `${C.accent}18` : "transparent", cursor: "pointer", fontSize: 16 }}>
                {l.flag}
              </div>
            ))}
          </div>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>🌿</div>
            <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-1px" }}>
              Vita<span style={{ color: C.accent }}>Zen</span>
            </div>
            <div style={{ fontSize: 14, color: C.muted, marginTop: 6 }}>
              {mode === "login" ? L.loginTitle : L.signupTitle}
            </div>
          </div>

          {/* Form */}
          <div style={{ flex: 1 }}>
            {mode === "signup" && (
              <input type="text" placeholder={L.namePlaceholder} value={name}
                onChange={(e) => setName(e.target.value)} style={inputStyle} />
            )}
            <input type="email" placeholder={L.emailPlaceholder} value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              style={inputStyle} />
            <input type="password" placeholder={L.passwordPlaceholder} value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              style={inputStyle} />

            {error && (
              <div style={{ background: `${C.coral}18`, border: `1px solid ${C.coral}44`, borderRadius: 12, padding: "12px 16px", marginBottom: 12, fontSize: 13, color: C.coral }}>
                ⚠️ {error}
              </div>
            )}
            {success && (
              <div style={{ background: `${C.accent}18`, border: `1px solid ${C.accent}44`, borderRadius: 12, padding: "12px 16px", marginBottom: 12, fontSize: 13, color: C.accent }}>
                {success}
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading}
              style={{ width: "100%", padding: "16px", borderRadius: 16, background: loading ? C.border : C.accent, color: "#000", fontWeight: 800, fontSize: 16, border: "none", cursor: loading ? "default" : "pointer", marginBottom: 16 }}>
              {loading ? "..." : mode === "login" ? L.loginBtn : L.signupBtn}
            </button>

            <div style={{ textAlign: "center", fontSize: 14, color: C.muted }}>
              {mode === "login" ? L.noAccount : L.hasAccount}{" "}
              <span onClick={() => { setMode(mode === "login" ? "signup" : "login"); reset(); }}
                style={{ color: C.accent, fontWeight: 700, cursor: "pointer" }}>
                {mode === "login" ? L.switchToSignup : L.switchToLogin}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div style={{ textAlign: "center", marginTop: 32, fontSize: 11, color: C.muted, lineHeight: 1.7 }}>
            {L.footerNote}
          </div>
        </div>
      </div>
    </>
  );
}
