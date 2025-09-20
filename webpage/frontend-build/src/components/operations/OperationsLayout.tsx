"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const links = [
  { href: "/ops/review", label: "审核面板" },
  { href: "/ops/reports", label: "举报处理" }
];

type OperationsLayoutProps = {
  children: ReactNode;
  title: string;
  description: string;
};

export function OperationsLayout({ children, title, description }: OperationsLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="operations-shell">
      <header className="operations-shell__header">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <nav aria-label="合规后台导航">
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={pathname === link.href ? "ops-nav__link ops-nav__link--active" : "ops-nav__link"}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="operations-shell__content">{children}</main>
    </div>
  );
}
