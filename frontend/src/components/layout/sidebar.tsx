"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_ITEMS } from "@/components/layout/navigation";

function navClasses(active: boolean): string {
  return active
    ? "rounded-xl bg-sky-600 px-3 py-2 text-sm font-semibold text-white"
    : "rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900";
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-72 border-r border-slate-200 bg-white p-6 lg:block">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
        Cross-Asset Platform
      </p>
      <h1 className="mt-2 text-xl font-bold text-slate-900">Smart Investing Assistant</h1>
      <p className="mt-2 text-sm text-slate-600">
        Guided workflow from strategy test to paper bot control.
      </p>

      <nav className="mt-6 space-y-2">
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className={navClasses(pathname === item.href)}>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
