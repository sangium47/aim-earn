"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  ChevronDown,
  HelpCircle,
  List,
  Mail,
  Menu,
  Package,
  PieChart as PieIcon,
  Settings,
  ShoppingCart,
  Tag,
  User as UserIcon,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  DATA                                                                       */
/* -------------------------------------------------------------------------- */

type NavChild = { label: string; href: string };

type NavItem = {
  label: string;
  Icon: LucideIcon;
  href?: string;
  collapsible?: boolean;
  children?: NavChild[];
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", Icon: PieIcon, href: "/distributor/dashboard" },
  {
    label: "Affiliate",
    Icon: List,
    collapsible: true,
    children: [
      { label: "Own Affiliates", href: "/distributor/affiliate-list" },
      {
        label: "Inactive Affiliates",
        href: "/distributor/inactive-affiliate-list",
      },
    ],
  },
  {
    label: "Product",
    Icon: Tag,
    collapsible: true,
    children: [
      { label: "Products", href: "/distributor/products" },
      { label: "Promotions", href: "/distributor/products/promotions" },
    ],
  },
  {
    label: "Orders",
    Icon: ShoppingCart,
    collapsible: true,
    children: [
      { label: "Direct Orders", href: "/distributor/orders/direct" },
      { label: "Affiliate Orders", href: "/distributor/orders/affiliate" },
    ],
  },
  {
    label: "Customers",
    Icon: UserIcon,
    collapsible: true,
    children: [
      { label: "Direct Customers", href: "/distributor/customers/direct" },
      {
        label: "Affiliate Customers",
        href: "/distributor/customers/affiliate",
      },
    ],
  },
  { label: "Emails", Icon: Mail, href: "/distributor/emails" },
  {
    label: "Reports",
    Icon: BarChart3,
    collapsible: true,
    children: [
      { label: "Sales", href: "/distributor/reports/sales" },
      { label: "Payout", href: "/distributor/reports/payout" },
    ],
  },
  { label: "Support", Icon: HelpCircle, href: "/distributor/support" },
  {
    label: "Setting",
    Icon: Settings,
    collapsible: true,
    children: [
      { label: "Bank Account", href: "/distributor/setting/bank" },
      { label: "Reminder", href: "/distributor/setting/reminder" },
      { label: "Country", href: "/distributor/setting/country" },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  SIDEBAR                                                                    */
/* -------------------------------------------------------------------------- */

function Sidebar({
  mobileOpen,
  onToggleSidebar,
}: {
  mobileOpen: boolean;
  onToggleSidebar: () => void;
}) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(() => {
    const match = NAV_ITEMS.find(
      (item) =>
        item.collapsible && item.children?.some((c) => c.href === pathname),
    );
    return match?.label ?? null;
  });

  const toggleMenu = (label: string) =>
    setOpenMenu((prev) => (prev === label ? null : label));

  const isActive = (href?: string) => !!href && pathname === href;

  const itemClass = (active: boolean) =>
    [
      "flex h-8 md:h-10 w-full items-center justify-between rounded-lg px-2 md:px-3 py-2 transition-colors",
      active ? "bg-[#5a5a5a] text-brand" : "text-[#f3f3f3] hover:bg-white/5",
    ].join(" ");

  // Mobile-expanded visibility helpers so we can reuse the md+ styles.
  const mdLabelClass = mobileOpen ? "block" : "hidden md:block";

  const closeOnMobile = () => {
    if (mobileOpen) onToggleSidebar();
  };

  return (
    <aside
      className={`flex shrink-0 flex-col bg-[#222125] text-[#f3f3f3] transition-[width] duration-200 md:pt-0 md:w-[218px] ${mobileOpen ? "w-full pt-0" : "w-0 pt-6"}`}
    >
      {/* Logo */}
      <div
        className={`${mobileOpen ? "flex" : "hidden"} md:flex items-start md:items-center justify-between md:justify-center px-4 md:px-8 pt-3 md:pt-6`}
      >
        <img src="/images/logo.svg" className="w-auto h-[36px] md:h-[60px]" />
        {/* Mobile close */}
        {mobileOpen ? (
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Close sidebar"
            className="md:hidden flex size-10 items-start justify-end self-start rounded-lg text-[#f3f3f3] hover:bg-white/10"
          >
            <X className="size-5" />
          </button>
        ) : null}
      </div>

      {/* Nav */}
      <nav
        className={`${mobileOpen ? "flex" : "hidden md:flex"} sticky top-0 pt-3 flex-col gap-1 px-3`}
      >
        {NAV_ITEMS.map((item) => {
          const { label, Icon, href, collapsible, children } = item;
          const active = isActive(href);
          const hasActiveChild =
            children?.some((c) => isActive(c.href)) ?? false;
          const isOpen = openMenu === label || hasActiveChild;

          const content = (
            <>
              <span className="flex flex-1 items-center gap-3">
                <Icon className="size-4 shrink-0" aria-hidden />
                <span
                  className={`${mdLabelClass} text-base leading-[1.5] tracking-[0.025em]`}
                >
                  {label}
                </span>
              </span>
              {collapsible ? (
                <ChevronDown
                  className={`${mdLabelClass} size-4 shrink-0 opacity-80 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden
                />
              ) : null}
            </>
          );

          return (
            <div key={label} className="flex flex-col gap-1">
              {collapsible && children && children.length > 0 ? (
                <button
                  type="button"
                  onClick={() => toggleMenu(label)}
                  aria-expanded={isOpen}
                  aria-current={active ? "page" : undefined}
                  className={itemClass(active)}
                >
                  {content}
                </button>
              ) : (
                <Link
                  href={href ?? "#"}
                  onClick={closeOnMobile}
                  aria-current={active ? "page" : undefined}
                  className={itemClass(active)}
                >
                  {content}
                </Link>
              )}

              {collapsible && children && isOpen ? (
                <ul className={`flex flex-col gap-1`}>
                  {children.map((child) => {
                    const childIsActive = isActive(child.href);
                    return (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={closeOnMobile}
                          aria-current={childIsActive ? "page" : undefined}
                          className={[
                            "flex h-[40px] items-center justify-start rounded-md pl-9 pr-3 text-sm leading-[1.4] tracking-[0.025em] transition-colors",
                            childIsActive
                              ? "bg-ink-secondary/30 text-brand"
                              : "text-surface-input hover:bg-white/5 hover:text-[#f3f3f3]",
                          ].join(" ")}
                        >
                          {child.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/*  HEADER                                                                     */
/* -------------------------------------------------------------------------- */

function Header({
  mobileOpen,
  onToggleSidebar,
}: {
  mobileOpen: boolean;
  onToggleSidebar: () => void;
}) {
  return (
    <header className="flex h-[68px] items-center justify-between border-b border-[#cbcfd5] bg-white px-3 md:px-6 py-2">
      <div className="flex items-center gap-2 md:gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={mobileOpen ? "Collapse sidebar" : "Expand sidebar"}
          aria-expanded={mobileOpen}
          className="md:hidden inline-flex size-10 items-center justify-center rounded-lg text-[#1e1e1e] hover:bg-[#f5f5f8]"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        {/* Country selector */}
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-[#f5f5f8] px-3 py-2 text-sm text-[#1e1e1e] hover:bg-[#ececf0]"
        >
          <span>All Country</span>
          <ChevronDown className="size-4" />
        </button>
      </div>

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
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-[#F6F7F9] text-[#1e1e1e]">
      <Sidebar
        mobileOpen={mobileOpen}
        onToggleSidebar={() => setMobileOpen((v) => !v)}
      />

      {/* Right side */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          mobileOpen={mobileOpen}
          onToggleSidebar={() => setMobileOpen((v) => !v)}
        />
        <div className={`${!mobileOpen ? "block" : "hidden"} md:block`}>
          {children}
        </div>
      </div>
    </div>
  );
}
