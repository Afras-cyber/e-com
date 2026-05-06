// Minimal layout for admin authentication pages (login).
// Intentionally has NO sidebar or navigation so the login screen
// is fully isolated — just a clean full-screen page.
export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
