export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <Navbar /> */}
      <section className="flex items-center justify-center min-h-screen px-5">
        {children}
      </section>
    </>
  );
}
