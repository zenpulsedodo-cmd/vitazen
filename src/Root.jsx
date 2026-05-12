import { useState, useEffect } from "react";
import { getSession } from "./models/authModel.js";
import AuthScreen from "./views/screens/AuthScreen.jsx";
import App from "./App.jsx";

export default function Root() {
  const [session, setSession] = useState(undefined); // undefined = loading

  useEffect(() => {
    const unsubscribe = getSession((s) => setSession(s));
    return unsubscribe;
  }, []);

  // Loading splash
  if (session === undefined) {
    return (
      <div style={{ background: "#0D0F14", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 48 }}>🌿</div>
        <div style={{ color: "#7EE8A2", fontSize: 22, fontWeight: 700, fontFamily: "sans-serif" }}>
          Vita<span style={{ color: "#EEF0F6" }}>Zen</span>
        </div>
      </div>
    );
  }

  if (!session) return <AuthScreen onLogin={setSession} />;
  return <App session={session} />;
}
