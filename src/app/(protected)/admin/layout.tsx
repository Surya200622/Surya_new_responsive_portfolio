export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Admin access is now handled in the parent protected layout
  // which checks the profile role and redirects accordingly
  return <>{children}</>;
}
