import "./globals.css";
import NavBar from "../components/NavBar";

export const metadata = {
  title: "Seguros - TIC ISFT 199",
  description: "Sistema Web de Seguros de Accidentes Personales",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <NavBar />
        <main className="container">{children}</main>
        <footer className="footer">
          TIC - Ciencia de Datos e Inteligencia Artificial - ISFT N.º 199
        </footer>
      </body>
    </html>
  );
}
