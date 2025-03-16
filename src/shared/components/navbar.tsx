'use client';

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from '@heroui/navbar';
import { Button } from '@heroui/button';
import { Kbd } from '@heroui/kbd';
import { Link } from '@heroui/link';
import { Input } from '@heroui/input';
import { link as linkStyles } from '@heroui/theme';
import NextLink from 'next/link';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

import { useAuthenticationStore } from '../store/authentication';

import { siteConfig } from '@/config/site';
import { ThemeSwitch } from '@/shared/components/theme-switch';
import { SearchIcon, Logo } from '@/shared/components/icons';
import { DeleteDocumentIcon } from './dropdownProfile';
import { Divider } from '@heroui/divider';

export const Navbar = () => {
  const router = useRouter();
  const { isLogin, logout } = useAuthenticationStore();
  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: 'bg-default-100',
        input: 'text-sm',
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={['command']}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={<SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />}
      type="search"
    />
  );

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">BASH</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => {
            // if (item.isProtected && !isLogin) return null;

            return (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: 'foreground' }),
                    'data-[active=true]:text-primary data-[active=true]:font-medium',
                  )}
                  color="foreground"
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            );
          })}
        </ul>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
        <ThemeSwitch />
        {/* <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem> */}
        <NavbarItem className="hidden md:flex">
          {isLogin ? (
            <div className="flex gap-2">
              <Button
                className="text-sm font-normal text-foreground"
                variant="flat"
                onPress={() => router.push('/dashboard')}
              >
                Dashboard
              </Button>
              <div>
                <Button startContent={<DeleteDocumentIcon />} variant="bordered" onPress={logout}>
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button as={Link} className="text-sm font-normal text-default-600" href={'/login'} variant="faded">
                Login
              </Button>
              <Button as={Link} className="text-sm font-normal text-default-600" href={'/register'} variant="ghost">
                Register
              </Button>
            </div>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="flex flex-row gap-4">
          <ThemeSwitch />
        </div>

        <div className="mt-2 flex flex-col gap-2">
          {siteConfig.navItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link className="text-sm" color="foreground" href={item.href} size="lg">
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
        <Divider className="my-2" />
        {isLogin ? (
          <div className='flex flex-col gap-2'>
            <Button
              className="text-sm font-normal text-foreground"
              variant="flat"
              onPress={() => router.push('/dashboard')}
            >
              Dashboard
            </Button>
            <div>
              <Button startContent={<DeleteDocumentIcon />} variant="bordered" onPress={logout}>
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <div className='flex flex-col gap-2'>
            <Button as={Link} className="text-sm font-normal text-default-600" href={'/login'} variant="faded">
              Login
            </Button>
            <Button as={Link} className="text-sm font-normal text-default-600" href={'/register'} variant="ghost">
              Register
            </Button>
          </div>
        )}
      </NavbarMenu>
    </HeroUINavbar>
  );
};
