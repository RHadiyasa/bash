import Link from "next/link";

const NavLink = ({ href, active, children }) => {
  const activeClass = "transition-colors hover:text-foreground/60 p-1 hover:border-b-2";
  const inactiveClass = "text-gray-600 " + activeClass;

  return (
    <Link href={href} className={active ? activeClass : inactiveClass}>
      {children}
    </Link>
  );
};

export default NavLink;
