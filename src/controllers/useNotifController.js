import { useState, useRef, useCallback, useEffect } from "react";

export function useNotifController() {
  const [toast, setToast]   = useState(null);
  const [perm,  setPerm]    = useState("default");
  const timer               = useRef(null);

  useEffect(() => {
    if ("Notification" in window) setPerm(Notification.permission);
  }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 4800);
  }, []);

  const requestPerm = async () => {
    if (!("Notification" in window)) return false;
    const p = await Notification.requestPermission();
    setPerm(p);
    return p === "granted";
  };

  const send = useCallback((msg) => {
    showToast(msg);
    if (perm === "granted" && "Notification" in window) {
      try { new Notification(msg.title, { body: msg.body }); } catch {}
    }
  }, [perm, showToast]);

  return { toast, showToast, send, requestPerm, perm };
}
