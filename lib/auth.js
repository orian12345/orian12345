import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const getSecret = () =>
  new TextEncoder().encode(process.env.ADMIN_JWT_SECRET || 'fallback-dev-secret-change-in-prod');

export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(getSecret());
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload;
  } catch {
    return null;
  }
}

export function checkCredentials(username, password) {
  const user = process.env.ADMIN_USERNAME || 'admin';
  const pass = process.env.ADMIN_PASSWORD || 'admin123';
  return username === user && password === pass;
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}
