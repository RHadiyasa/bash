// import { Navbar } from '@/shared/components/navbar';
import CustomPanel from '@/shared/components/customPanel';
import { StatusIcon, TransactionIcon } from '@/shared/components/icons';
import { NavbarDashboard } from '@/shared/components/navbarDashboard';
import ProtectedLayout from '@/shared/components/protectedLayout';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const menuItems = [
    {
      key: 'trash',
      label: 'Transactions',
      description: 'Daftar Transaksi',
      icon: <TransactionIcon />,
    },
    {
      key: 'category',
      label: 'Status',
      description: 'Status Transaksi',
      icon: <StatusIcon />,
    },
  ];

  return (
    <ProtectedLayout>
      <NavbarDashboard />
      <main className="container mx-auto grid lg:p-5">
        {children}
        <CustomPanel menus={menuItems} />
      </main>
    </ProtectedLayout>
  );
}
