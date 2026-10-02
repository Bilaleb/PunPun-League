import "./globals.css";

export const metadata = {
  title: "PunPun League | 2026/27",
  description: "Standings, form and match results from the eight-club PunPun League.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
