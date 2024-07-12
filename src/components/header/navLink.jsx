import Link from "next/link";

const NavLink = ({ href, active, children }) => {
  const activeClass = !active ? "transition-colors hover:text-foreground/60 hover:mb-1 md:bg-transparent" : "transition-colors hover:text-foreground/60 p-1 md:bg-transparent";
  const inactiveClass = "text-gray-600 bg-transparent" + activeClass;

  return (
    <Link href={href} className={active ? activeClass : inactiveClass}>
      {children}
    </Link>
  );
};

export default NavLink;
