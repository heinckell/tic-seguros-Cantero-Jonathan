"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "INICIO / DASHBOARD" },
  { href: "/clientes", label: "CLIENTES" },
  { href: "/polizas", label: "PÓLIZAS" },
  { href: "/siniestros", label: "SINIESTROS" },
];

export default function NavBar() {
  const pathname = usePathname();
  return (
    <nav className="navbar">
      <span className="brand">🛡️ Seguros TIC</span>
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          style={{
            fontWeight: pathname === l.href ? "bold" : "normal",
            textDecoration: pathname === l.href ? "underline" : "none",
          }}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
