"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_ITEMS } from "@/components/layout/navigation";

function navClasses(active: boolean): string {
  return active
    ? "rounded-xl bg-sky-600 px-3 py-2 text-sm font-semibold text-white"
    : "rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900";
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-[1400px] flex-col lg:flex-row">
        <aside className="hidden min-h-screen w-72 border-r border-slate-200 bg-white p-6 lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
            Cross-Asset Platform
          </p>
          <h1 className="mt-2 text-xl font-bold text-slate-900">Retail Trading Console</h1>
          <p className="mt-2 text-sm text-slate-600">
            Plain-language workflow from historical checks to live-ready automation.
          </p>
          <nav className="mt-6 space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={navClasses(pathname === item.href)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:px-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                    Platform Status
                  </p>
                  <p className="text-sm text-slate-600">
                    Signals shown here use mock data and enforced quality gates.
                  </p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                  Demo Mode
                </span>
              </div>
              <nav className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={navClasses(pathname === item.href)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
