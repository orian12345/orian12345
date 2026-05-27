import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AdminLayoutClient from './AdminLayoutClient';

export default async function AdminLayout({ children }) {
  const session = await getSession();
  if (!session) {
    redirect('/admin/login');
  }
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
