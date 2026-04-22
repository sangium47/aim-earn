"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Bell,
  Check,
  ChevronDown,
  HelpCircle,
  Mail,
  Menu,
  PieChart as PieIcon,
  Settings,
  ShoppingCart,
  Tag,
  User as UserIcon,
  UsersRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { Dialog } from "@/components/shared";
import { COUNTRY_NAMES } from "@/components/mock";
import { clearSession, getSession } from "@/lib/session";
import { useRoleGuard } from "@/lib/use-session-guard";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "th", label: "ไทย" },
] as const;

type Notification = {
  id: string;
  title: string;
  description: string;
  /** Epoch ms when the notification was created. */
  at: number;
  unread: boolean;
};

const NOTIFICATIONS: Notification[] = [
  {
    id: "n-1",
    title: "New affiliate joined",
    description: "Sarah Chen just signed up with your invite link.",
    at: Date.now() - 1000 * 60 * 5, // 5 min ago
    unread: true,
  },
  {
    id: "n-2",
    title: "Payout approved",
    description: "Your March payout of $1,820 is scheduled for 5 Apr.",
    at: Date.now() - 1000 * 60 * 55, // 55 min ago
    unread: true,
  },
  {
    id: "n-3",
    title: "Promotion under review",
    description: "Spring Sale 20% Off is now awaiting admin approval.",
    at: Date.now() - 1000 * 60 * 60 * 4, // 4 hours ago
    unread: false,
  },
  {
    id: "n-4",
    title: "New order on your affiliate link",
    description: "Theresa Webb placed a $15,200 order.",
    at: Date.now() - 1000 * 60 * 60 * 26, // ~1 day ago
    unread: false,
  },
];

function renderNotifBody({
  notifications,
  setNotifications,
  onClose,
}: {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  onClose: () => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 border-b border-line">
        <span className="text-[20px] md:text-[24px] font-semibold text-ink">
          Notifications
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notifications"
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-[#5f5f5f] transition-colors hover:bg-[#f4f5f8] hover:text-[#222125]"
        >
          <X className="size-4" />
        </button>
      </div>
      <ul className="max-h-[360px] overflow-y-auto py-1">
        {notifications.length === 0 ? (
          <li className="px-4 py-6 text-center text-sm text-ink-secondary">
            No notifications
          </li>
        ) : (
          notifications.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() =>
                  setNotifications((prev) =>
                    prev.map((x) =>
                      x.id === n.id ? { ...x, unread: false } : x,
                    ),
                  )
                }
                className="relative flex w-full flex-col items-start gap-0.5 px-4 py-2 text-left transition-colors hover:bg-[#f4f5f8]"
              >
                <span className="text-[16px] text-ink">{n.title}</span>
                <span className="text-[14px] leading-[1.4] text-ink-secondary">
                  {n.description}
                </span>
                <span className="text-[11px] text-ink-tertiary">
                  {fromNow(n.at)}
                </span>
                {n.unread ? (
                  <span
                    aria-label="Unread"
                    className="absolute top-3 right-3 block size-2 rounded-full bg-[#ef4444]"
                  />
                ) : null}
              </button>
            </li>
          ))
        )}
      </ul>
    </>
  );
}

function fromNow(timestamp: number): string {
  const diff = Math.max(0, Date.now() - timestamp);
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  const wk = Math.floor(day / 7);
  if (wk < 4) return `${wk}w ago`;
  const mo = Math.floor(day / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(day / 365)}y ago`;
}

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
    Icon: UsersRound,
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

  const activeHref = NAV_ITEMS.flatMap((item) =>
    item.children
      ? item.children.map((c) => c.href)
      : item.href
        ? [item.href]
        : [],
  )
    .filter((h) => pathname === h || pathname.startsWith(h + "/"))
    .sort((a, b) => b.length - a.length)[0];

  const [openMenu, setOpenMenu] = useState<string | null>(() => {
    const match = NAV_ITEMS.find(
      (item) =>
        item.collapsible && item.children?.some((c) => c.href === activeHref),
    );
    return match?.label ?? null;
  });

  const toggleMenu = (label: string) =>
    setOpenMenu((prev) => (prev === label ? null : label));

  const isActive = (href?: string) => !!href && href === activeHref;

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

type CountryChoice = { code: string; label: string };

const ALL_COUNTRY: CountryChoice = { code: "all", label: "All Country" };

function Header({
  mobileOpen,
  onToggleSidebar,
}: {
  mobileOpen: boolean;
  onToggleSidebar: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const [lang, setLang] = useState<(typeof LANGUAGES)[number]["code"]>("en");
  const [langDialogOpen, setLangDialogOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [userCountries, setUserCountries] = useState<string[]>([]);
  const [country, setCountry] = useState<string>("all");
  const [countryOpen, setCountryOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const countryRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];
  const unreadCount = notifications.filter((n) => n.unread).length;

  // Load the signed-in user's countries from the session (client-only).
  useEffect(() => {
    const session = getSession();
    setUserCountries(session?.countries ?? []);
  }, []);

  const isDashboard = pathname === "/distributor/dashboard";
  const sessionChoices: CountryChoice[] = userCountries.map((code) => ({
    code,
    label: COUNTRY_NAMES[code] ?? code,
  }));
  const countryOptions: CountryChoice[] = isDashboard
    ? [ALL_COUNTRY, ...sessionChoices]
    : sessionChoices;

  // If we navigate away from the dashboard while "All" is selected,
  // fall back to the first available country.
  useEffect(() => {
    if (country === "all" && !isDashboard) {
      setCountry(countryOptions[0]?.code ?? "");
    }
  }, [country, isDashboard, countryOptions]);

  // If the selected country is no longer in the user's list (e.g. session
  // loaded after first paint), snap back to the first available option.
  useEffect(() => {
    if (countryOptions.length === 0) return;
    if (!countryOptions.some((c) => c.code === country)) {
      setCountry(countryOptions[0].code);
    }
  }, [country, countryOptions]);

  const currentCountry =
    countryOptions.find((c) => c.code === country) ?? countryOptions[0];

  useEffect(() => {
    if (!profileOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [profileOpen]);

  useEffect(() => {
    if (!countryOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (!countryRef.current) return;
      if (!countryRef.current.contains(e.target as Node)) setCountryOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCountryOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [countryOpen]);

  useEffect(() => {
    if (!notifOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (!notifRef.current) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (notifRef.current.contains(target)) return;
      // Ignore clicks inside the mobile Dialog — it has its own backdrop close.
      if (target.closest('[role="dialog"]')) return;
      setNotifOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNotifOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [notifOpen]);

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
        <div ref={countryRef} className="relative">
          <button
            type="button"
            onClick={() => setCountryOpen((o) => !o)}
            aria-haspopup="listbox"
            aria-expanded={countryOpen}
            className="inline-flex items-center gap-2 rounded-lg bg-[#f5f5f8] px-3 py-2 text-sm text-[#1e1e1e] hover:bg-[#ececf0]"
          >
            <span>{currentCountry?.label ?? "All Country"}</span>
            <ChevronDown
              className={`size-4 transition-transform ${countryOpen ? "rotate-180" : ""}`}
            />
          </button>

          {countryOpen ? (
            <ul
              role="listbox"
              className="absolute left-0 top-full z-20 mt-2 w-[160px] overflow-hidden rounded-xl border border-line bg-white p-1 shadow-lg"
            >
              {countryOptions.map((opt) => {
                const selected = opt.code === country;
                return (
                  <li key={opt.code}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => {
                        setCountry(opt.code);
                        setCountryOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        selected
                          ? "bg-[#f8d237]/15 text-ink"
                          : "text-ink hover:bg-[#f4f5f8]"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {selected ? (
                        <Check className="size-4 text-[#1f7a3b]" aria-hidden />
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-4">
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={notifOpen}
            aria-label="Notifications"
            className="relative flex size-8 items-center justify-center rounded-lg text-[#1e1e1e] hover:bg-[#f5f5f8]"
          >
            <Bell className="size-5" />
            {unreadCount > 0 ? (
              <span
                aria-hidden
                className="absolute top-1 right-1 block size-2 rounded-full bg-[#ef4444] ring-2 ring-white"
              />
            ) : null}
          </button>

          {notifOpen ? (
            <div
              role="menu"
              className="hidden md:block absolute right-0 top-full z-20 mt-2 w-[340px] max-h-[420px] overflow-hidden rounded-xl border border-line bg-white shadow-lg"
            >
              {renderNotifBody({
                notifications,
                setNotifications,
                onClose: () => setNotifOpen(false),
              })}
            </div>
          ) : null}
        </div>

        <div className="md:hidden">
          <Dialog
            open={notifOpen}
            width="max-w-sm"
            onClose={() => setNotifOpen(false)}
          >
            {renderNotifBody({
              notifications,
              setNotifications,
              onClose: () => setNotifOpen(false),
            })}
          </Dialog>
        </div>
        <div aria-hidden className="h-6 w-px bg-[#cbcfd5]" />
        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={profileOpen}
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
            <ChevronDown
              className={`size-4 text-[#1e1e1e] transition-transform ${profileOpen ? "rotate-180" : ""}`}
            />
          </button>

          {profileOpen ? (
            <ul
              role="menu"
              className="absolute right-0 top-full z-20 mt-2 w-[180px] overflow-hidden rounded-xl border border-line bg-white p-1 shadow-lg"
            >
              <li>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setProfileOpen(false);
                    router.push("/distributor/profile");
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink transition-colors hover:bg-[#f4f5f8]"
                >
                  Profile
                </button>
              </li>
              <li>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setProfileOpen(false);
                    setLangDialogOpen(true);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 pt-2 pb-3 text-left text-sm text-ink transition-colors hover:bg-[#f4f5f8]"
                >
                  <span className="flex flex-1 flex-col items-start">
                    <span>Languages</span>
                    <span className="text-[11px] leading-none text-ink-secondary">
                      {currentLang.label}
                    </span>
                  </span>
                </button>
              </li>
              <li className="border-t border-line">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setProfileOpen(false);
                    clearSession();
                    router.push("/login");
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink transition-colors hover:bg-[#f4f5f8]"
                >
                  Logout
                </button>
              </li>
            </ul>
          ) : null}
        </div>
      </div>

      <Dialog
        open={langDialogOpen}
        width="max-w-xs"
        onClose={() => setLangDialogOpen(false)}
      >
        <div className="flex flex-col gap-3 py-4 md:py-6">
          <h2 className="text-[18px] md:text-[20px] font-medium border-b border-line pb-4 leading-[1.2] tracking-[0.02em] text-[#1e1e1e] px-4 md:px-6">
            Languages
          </h2>
          <ul role="radiogroup" className="flex flex-col gap-1 px-4 md:px-6">
            {LANGUAGES.map((l) => {
              const selected = l.code === lang;
              return (
                <li key={l.code}>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => {
                      setLang(l.code);
                      setLangDialogOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg py-2 text-left text-base transition-colors ${
                      selected ? " text-ink" : "text-ink hover:bg-[#f4f5f8]"
                    }`}
                  >
                    <span>{l.label}</span>
                    {selected ? (
                      <Check className="size-4 text-[#1f7a3b]" aria-hidden />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </Dialog>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*  LAYOUT                                                                     */
/* -------------------------------------------------------------------------- */

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const allowed = useRoleGuard("distributor");
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!allowed) return null;

  return (
    <div className="flex min-h-screen w-full bg-[#F6F7F9] text-[#1e1e1e]">
      <Sidebar
        mobileOpen={mobileOpen}
        onToggleSidebar={() => setMobileOpen((v) => !v)}
      />

      {/* Right side */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        <Header
          mobileOpen={mobileOpen}
          onToggleSidebar={() => setMobileOpen((v) => !v)}
        />
        <div
          className={`${!mobileOpen ? "block overflow-y-auto" : "hidden"} md:block md:overflow-y-auto`}
          style={{
            maxHeight: "calc(100vh - 68px)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
