// import { Navbar } from '@/shared/components/navbar';
import { NavbarDashboard } from '@/shared/components/navbarDashboard';
import ProtectedLayout from '@/shared/components/protectedLayout';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout>
      <NavbarDashboard />
      <main className="min-h-screen mx-10">{children}</main>
    </ProtectedLayout>
  );
}
