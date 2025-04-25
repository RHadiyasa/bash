'use client';

import { Listbox, ListboxItem } from '@heroui/listbox';
import { ArchiveIcon, TrashIcon } from './icons';

export const ListboxWrapper = ({ children }: any) => (
  <div className="w-full max-w-[320px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);

type MenuItem = {
  key: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  color?: any;
};

const CustomPanel = ({ menus }: { menus: MenuItem[] }) => {
  return (
    <ListboxWrapper>
      <Listbox aria-label="Listbox menu with descriptions" variant="flat">
        {menus.map((menu) => (
          <ListboxItem
            key={menu.key}
            description={menu.description}
            startContent={menu.icon}
            color={menu?.color}
          >
            {menu.label}
          </ListboxItem>
        ))}
      </Listbox>
    </ListboxWrapper>
  );
};

export default CustomPanel;
