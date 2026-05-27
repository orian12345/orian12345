import { NextResponse } from 'next/server';
import { signToken, checkCredentials } from '@/lib/auth';

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!checkCredentials(username, password)) {
      return NextResponse.json({ error: 'שם משתמש או סיסמה שגויים' }, { status: 401 });
    }

    const token = await signToken({ username, role: 'admin' });

    const res = NextResponse.json({ ok: true });
    res.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return res;
  } catch (err) {
    console.error('POST /api/auth/login error:', err);
    return NextResponse.json({ error: 'שגיאת שרת' }, { status: 500 });
  }
}
