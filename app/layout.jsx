import "./globals.css";

export const metadata = {
  title: "Kick Stats Dashboard",
  description: "Dashboard statystyk predykcji Kick.com",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
