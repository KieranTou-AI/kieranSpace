import NavBar from "@/components/nav-bar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <NavBar />
      {children}
    </div>
  );
}
