"use client";

import type { ReactNode } from "react";
import {
  BarChart3,
  Bell,
  ChevronDown,
  HelpCircle,
  List,
  Mail,
  Package,
  PieChart as PieIcon,
  Settings,
  ShoppingCart,
  Tag,
  User as UserIcon,
  Users,
  Wallet,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  DATA                                                                       */
/* -------------------------------------------------------------------------- */

const NAV_ITEMS = [
  { label: "Dashboard", Icon: PieIcon, active: true, collapsible: false },
  { label: "Affiliate", Icon: List, active: false, collapsible: true },
  { label: "Product", Icon: Tag, active: false, collapsible: true },
  { label: "Orders", Icon: ShoppingCart, active: false, collapsible: true },
  { label: "Customers", Icon: UserIcon, active: false, collapsible: true },
  { label: "Emails", Icon: Mail, active: false, collapsible: false },
  { label: "Reports", Icon: BarChart3, active: false, collapsible: true },
  { label: "Support", Icon: HelpCircle, active: false, collapsible: false },
  { label: "Setting", Icon: Settings, active: false, collapsible: true },
];

/* -------------------------------------------------------------------------- */
/*  SIDEBAR                                                                    */
/* -------------------------------------------------------------------------- */

function Sidebar() {
  return (
    <aside className="flex w-14 pt-6 md:pt-0 md:w-[218px] shrink-0 flex-col bg-[#222125] text-[#f3f3f3]">
      {/* Logo */}
      <div className="hidden md:flex items-center justify-center px-8 pb-6 pt-[37px]">
        <img src="/images/logo.svg" />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 flex flex-col gap-4 px-3">
        {NAV_ITEMS.map(({ label, Icon, active, collapsible }) => (
          <a
            key={label}
            href="#"
            aria-current={active ? "page" : undefined}
            className={[
              "flex h-8 md:h-10 items-center justify-between rounded-lg px-2 md:px-3 py-2 transition-colors",
              active
                ? "bg-[#5a5a5a] text-[#f8d237]"
                : "text-[#f3f3f3] hover:bg-white/5",
            ].join(" ")}
          >
            <span className="flex flex-1 items-center gap-3">
              <Icon className="size-4 shrink-0" aria-hidden />
              <span className="hidden md:block text-base leading-[1.5] tracking-[0.025em]">
                {label}
              </span>
            </span>
            {collapsible ? (
              <ChevronDown
                className="hidden md:block size-4 shrink-0 opacity-80"
                aria-hidden
              />
            ) : null}
          </a>
        ))}
      </nav>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/*  HEADER                                                                     */
/* -------------------------------------------------------------------------- */

function Header() {
  return (
    <header className="flex h-[68px] items-center justify-between border-b border-[#cbcfd5] bg-white px-3 md:px-6 py-2">
      {/* Country selector */}
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-lg bg-[#f5f5f8] px-3 py-2 text-sm text-[#1e1e1e] hover:bg-[#ececf0]"
      >
        <span>All Country</span>
        <ChevronDown className="size-4" />
      </button>

      {/* Right cluster */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex size-5 items-center justify-center text-[#1e1e1e] hover:text-black"
        >
          <Bell className="size-5" />
        </button>
        <div aria-hidden className="h-6 w-px bg-[#cbcfd5]" />
        {/* Profile */}
        <button
          type="button"
          className="flex items-center gap-3 rounded-lg pr-1 hover:bg-[#f5f5f5]"
        >
          <div className="flex size-[34px] items-center justify-center overflow-hidden rounded-full bg-[#cbcfd5] text-[#5a5a5a]">
            <UserIcon className="size-5" aria-hidden />
          </div>
          <div className="hidden md:flex flex-col items-start gap-1 pr-1">
            <span className="text-sm leading-[1.4] text-[#1e1e1e]">
              Alex Johnson
            </span>
            <span className="text-xs leading-none text-[#757575]">
              Distributor
            </span>
          </div>
          <ChevronDown className="size-4 text-[#1e1e1e]" />
        </button>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*  LAYOUT                                                                     */
/* -------------------------------------------------------------------------- */

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-[#F6F7F9] text-[#1e1e1e]">
      <Sidebar />

      {/* Right side */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        {children}
      </div>
    </div>
  );
}
