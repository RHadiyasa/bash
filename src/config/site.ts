export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'Bash App',
  description: 'Make your garbage collection easier with Bash App.',
  icon: '/favicon.ico',
  navItems: [
    {
      label: 'Home',
      href: '/',
      isProtected: false,
    },
    {
      label: 'Gallery',
      href: '/example',
      isProtected: false,
    },
    {
      label: 'Story',
      href: '/docs',
      isProtected: false,
    },
    {
      label: 'About',
      href: '/about',
      isProtected: false,
    },
  ],
};
