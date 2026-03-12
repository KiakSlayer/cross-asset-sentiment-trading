export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Strategy Lab", href: "/strategy-lab" },
  { label: "Backtest Results", href: "/backtest-results" },
  { label: "Forward Test", href: "/forward-test" },
  { label: "Opportunities", href: "/opportunities" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Trade History", href: "/trade-history" },
  { label: "Bot Control", href: "/bot-control" },
  { label: "Analytics", href: "/analytics" },
];
