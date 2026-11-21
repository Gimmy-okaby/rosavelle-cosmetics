import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export async function signInAdmin(email, password) {
  if (!isSupabaseConfigured()) {
    // In local dev mode without Supabase credentials configured yet
    if (password === 'admin123' || password === 'admin') {
      localStorage.setItem('lueur_admin_session', JSON.stringify({ email: email || 'admin@rosavelle.com', role: 'admin' }));
      return { success: true, user: { email: email || 'admin@rosavelle.com', role: 'admin' } };
    }
    throw new Error('كلمة المرور غير صحيحة (في الوضع التجريبي كلمة المرور الافتراضية هي: admin123)');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw new Error(error.message);
  }

  // Verify role in public.profiles
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', data.user.id)
    .single();

  if (profileError || !profile || !['admin', 'super_admin'].includes(profile.role)) {
    await supabase.auth.signOut();
    throw new Error('غير مصرح لك بالدخول: هذا الحساب لا يمتلك صلاحيات إدارة المتجر.');
  }

  return { success: true, user: data.user, profile };
}

export async function signOutAdmin() {
  if (!isSupabaseConfigured()) {
    localStorage.removeItem('lueur_admin_session');
    return { success: true };
  }

  await supabase.auth.signOut();
  return { success: true };
}

export async function getAdminSession() {
  if (!isSupabaseConfigured()) {
    const saved = localStorage.getItem('lueur_admin_session');
    return saved ? JSON.parse(saved) : null;
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', session.user.id)
    .single();

  if (profile && ['admin', 'super_admin'].includes(profile.role)) {
    return { user: session.user, profile };
  }

  return null;
}
