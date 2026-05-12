import { C } from "./constants/colors.js";
import { getLabel } from "./constants/labels.js";
import { useAppController } from "./controllers/useAppController.js";
import { useNotifController } from "./controllers/useNotifController.js";
import Toast from "./views/components/Toast.jsx";
import HomeScreen from "./views/screens/HomeScreen.jsx";
import StatsScreen from "./views/screens/StatsScreen.jsx";
import ProfileScreen from "./views/screens/ProfileScreen.jsx";
import PremiumModal from "./views/modals/PremiumModal.jsx";
import EarnedModal from "./views/modals/EarnedModal.jsx";

export default function App({ session }) {
  const notif = useNotifController();
  const ctrl  = useAppController(session);
  const L     = getLabel(ctrl.lang);

  // Loading splash
  if (ctrl.loading) {
    return (
      <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, fontFamily: "'DM Sans',sans-serif" }}>
        <div style={{ fontSize: 48 }}>🌿</div>
        <div style={{ color: C.accent, fontSize: 22, fontWeight: 700 }}>Vita<span style={{ color: C.text }}>Zen</span></div>
        <div style={{ color: C.muted, fontSize: 14 }}>Chargement...</div>
      </div>
    );
  }

  const navItems = [
    { id: "home",    icon: "🏠", label: L.home    },
    { id: "stats",   icon: "📊", label: L.stats   },
    { id: "profile", icon: "👤", label: L.profile },
  ];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ fontFamily: "'DM Sans',sans-serif", background: C.bg, minHeight: "100vh", color: C.text, maxWidth: 420, margin: "0 auto", position: "relative", overflow: "hidden" }}>

        {/* Background glows */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
          <div style={{ position: "absolute", top: -80, left: -60, width: 280, height: 280, borderRadius: "50%", background: `radial-gradient(circle,${C.lavender}18 0%,transparent 70%)` }} />
          <div style={{ position: "absolute", top: 300, right: -80, width: 220, height: 220, borderRadius: "50%", background: `radial-gradient(circle,${C.accent}14 0%,transparent 70%)` }} />
        </div>

        <Toast msg={notif.toast} />

        {/* Screens */}
        <div style={{ overflowY: "auto", height: "100vh" }}>
          {ctrl.tab === "home" && (
            <HomeScreen
              mood={ctrl.mood}           onMood={ctrl.handleMood}
              pillars={ctrl.pillars}     habits={ctrl.habits}        onHabits={ctrl.handleHabits}
              xp={ctrl.xp}              isPremium={ctrl.isPremium}  streak={ctrl.streak}
              perfectDays={ctrl.perfectDays} daysLeft={ctrl.daysLeft} earnProgress={ctrl.earnProgress}
              onPremium={() => ctrl.setShowPremium(true)}
              profile={ctrl.profile}    lang={ctrl.lang}
              onGoToProfile={() => ctrl.setTab("profile")}
              steps={ctrl.steps}        onSteps={ctrl.handleSteps}
            />
          )}
          {ctrl.tab === "stats" && (
            <StatsScreen
              habits={ctrl.habits}       steps={ctrl.steps}
              isPremium={ctrl.isPremium} onPremium={() => ctrl.setShowPremium(true)}
              perfectDays={ctrl.perfectDays} earnProgress={ctrl.earnProgress}
              profile={ctrl.profile}     lang={ctrl.lang}
              streak={ctrl.streak}       weekData={ctrl.weekData}
            />
          )}
          {ctrl.tab === "profile" && (
            <ProfileScreen
              xp={ctrl.xp}              habits={ctrl.habits}
              isPremium={ctrl.isPremium} streak={ctrl.streak}
              onPremium={() => ctrl.setShowPremium(true)}
              notif={notif}
              perfectDays={ctrl.perfectDays} earnProgress={ctrl.earnProgress} daysLeft={ctrl.daysLeft}
              profile={ctrl.profile}     onSaveProfile={(p) => { ctrl.handleSaveProfile(p); notif.showToast({ emoji: "✅", title: L.profileSaved, body: "" }); }}
              lang={ctrl.lang}           onSetLang={ctrl.setLang}
              onLogout={ctrl.handleLogout}
              userEmail={ctrl.userEmail}
            />
          )}
        </div>

        {/* Bottom nav */}
        <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 420, background: `${C.surface}EE`, backdropFilter: "blur(20px)", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-around", padding: "12px 0 20px", zIndex: 100 }}>
          {navItems.map((n) => (
            <div key={n.id} onClick={() => ctrl.setTab(n.id)}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", opacity: ctrl.tab === n.id ? 1 : 0.4, transition: "opacity 0.2s" }}>
              <div style={{ fontSize: 22 }}>{n.icon}</div>
              <div style={{ fontSize: 10, fontWeight: ctrl.tab === n.id ? 700 : 500, color: ctrl.tab === n.id ? C.accent : C.muted }}>{n.label}</div>
            </div>
          ))}
        </div>

        {/* Modals */}
        {ctrl.showPremium && <PremiumModal onClose={() => ctrl.setShowPremium(false)} lang={ctrl.lang} />}
        {ctrl.showEarned  && (
          <EarnedModal
            onClose={() => ctrl.setShowEarned(false)}
            lang={ctrl.lang}
            onActivate={() => {
              ctrl.handleActivatePremium();
              notif.showToast({ emoji: "✨", title: "Premium activé !", body: "1 mois Pro offert. Profite-en !" });
            }}
          />
        )}
      </div>
    </>
  );
}
