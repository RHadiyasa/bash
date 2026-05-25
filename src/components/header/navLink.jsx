import Link from "next/link";

const NavLink = ({ href, active, children, onClick }) => {
  const className = active
    ? "rounded-md bg-primary/15 px-3 py-2 text-primary transition-colors"
    : "rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground";

  return (
    <Link onClick={onClick} href={href} className={className}>
      {children}
    </Link>
  );
};

export default NavLink;
