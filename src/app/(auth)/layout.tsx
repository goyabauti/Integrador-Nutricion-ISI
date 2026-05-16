export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      background: "var(--bg)",
    }}>
      {children}
    </main>
  );
}