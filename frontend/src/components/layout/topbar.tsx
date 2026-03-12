"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_ITEMS } from "@/components/layout/navigation";

function navClasses(active: boolean): string {
  return active
    ? "rounded-xl bg-sky-600 px-3 py-2 text-sm font-semibold text-white"
    : "rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900";
}

function getPageLabel(pathname: string): string {
  return NAV_ITEMS.find((item) => item.href === pathname)?.label ?? "Dashboard";
}

export function Topbar() {
  const pathname = usePathname();
  const pageLabel = getPageLabel(pathname);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:px-8">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
              Bot status
            </p>
            <p className="text-sm text-slate-600">
              You are viewing: <span className="font-semibold text-slate-900">{pageLabel}</span>
            </p>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            Mock Data
          </span>
        </div>

        <nav className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className={navClasses(pathname === item.href)}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
