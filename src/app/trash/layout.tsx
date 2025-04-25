// import { Navbar } from '@/shared/components/navbar';
import CustomPanel from '@/shared/components/customPanel';
import { ArchiveIcon, TrashIcon } from '@/shared/components/icons';
import { NavbarDashboard } from '@/shared/components/navbarDashboard';
import ProtectedLayout from '@/shared/components/protectedLayout';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const menuItems = [
    {
      key: 'trash',
      label: 'Trash / Sampah',
      description: 'Daftar Nama Sampah',
      icon: <TrashIcon />,
    },
    {
      key: 'category',
      label: 'Kategori / Category',
      description: 'Daftar Kategori Sampah',
      icon: <ArchiveIcon />,
    },
  ];

  return (
    <ProtectedLayout>
      <NavbarDashboard />
      <main className="container mx-auto grid lg:p-5">
        {children}
        <CustomPanel menus={menuItems}/>
      </main>
    </ProtectedLayout>
  );
}
