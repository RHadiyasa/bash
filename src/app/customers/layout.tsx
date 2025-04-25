// import { Navbar } from '@/shared/components/navbar';
import CustomPanel from '@/shared/components/customPanel';
import { AddNoteIcon, DeleteDocumentIcon, EditDocumentIcon } from '@/shared/components/dropdownProfile';
import { CheckListIcon, StatusIcon, UncheckIcon } from '@/shared/components/icons';
import { NavbarDashboard } from '@/shared/components/navbarDashboard';
import ProtectedLayout from '@/shared/components/protectedLayout';
import { color } from 'framer-motion';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const menuItems = [
    {
      key: 'new-customer',
      label: 'Buat Nasabah',
      description: 'Create new customer',
      color:'default',
      icon: <AddNoteIcon />,
    },
    {
      key: 'active-customer',
      label: 'Nasabah Aktif',
      description: 'Active Customer',
      color:'default',
      icon: <StatusIcon />,
    },
    {
      key: 'nonActive-customer',
      label: 'Nasabah Non Aktif',
      description: 'Non-Active Customer',
      color:'default',
      icon: <UncheckIcon />,
    },
    {
      key: 'delete-customer',
      label: 'Hapus Nasabah',
      color: 'danger',
      description: 'Delete Nasabah',
      icon: <DeleteDocumentIcon />,
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
