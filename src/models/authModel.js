import { supabase } from "../supabase.js";

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { session: data?.session || null, error: error?.message || null };
}

export async function signUp(email, password, name) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });
  if (error) return { error: error.message };
  if (data?.user?.identities?.length === 0) return { error: "EMAIL_EXISTS" };
  return { error: null };
}

export async function signOut() {
  await supabase.auth.signOut();
}

export function getSession(callback) {
  supabase.auth.getSession().then(({ data: { session } }) => callback(session));
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => callback(session));
  return () => subscription.unsubscribe();
}
