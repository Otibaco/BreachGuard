"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  ListChecks,
  ShieldAlert,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/control-center", label: "Overview", icon: LayoutDashboard },
  { href: "/control-center/checks", label: "Checks", icon: ListChecks },
  {
    href: "/control-center/security-events",
    label: "Security Events",
    icon: ShieldAlert,
  },
];

const SECURITY_EVENTS_READ_KEY = "breachguard-security-events-last-read";

function getLastReadSecurityEventCount() {
  if (typeof window === "undefined") return 0;

  try {
    const raw = window.localStorage.getItem(SECURITY_EVENTS_READ_KEY);
    const value = Number(raw ?? "0");
    return Number.isFinite(value) ? value : 0;
  } catch {
    return 0;
  }
}

function SidebarContent({ collapsed, onNavigate, adminEmail, securityEventCount = 0, onSecurityEventsClick }) {
  const pathname = usePathname();

  return (
    <>
      <nav className="flex-1 space-y-1 px-2">
        {navItems.map((item) => {
          const active =
            item.href === "/control-center"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          const isSecurityEventsItem = item.href === "/control-center/security-events";
          const badgeCount = isSecurityEventsItem ? securityEventCount : 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(event) => {
                if (isSecurityEventsItem && typeof window !== "undefined") {
                  window.localStorage.setItem(SECURITY_EVENTS_READ_KEY, String(securityEventCount));
                  onSecurityEventsClick?.();
                }
                onNavigate?.(event);
              }}
              className={`focus-ring relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${active
                  ? "bg-brand-primary/15 text-brand-cyan"
                  : "text-text-muted hover:bg-white/5 hover:text-text-secondary"
                }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} className="shrink-0" />
              {!collapsed && (
                <span className="flex flex-1 items-center justify-between gap-3">
                  <span>{item.label}</span>
                  {isSecurityEventsItem && badgeCount > 0 && (
                    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-sm shadow-red-500/40">
                      {badgeCount > 99 ? "99+" : badgeCount}
                    </span>
                  )}
                </span>
              )}
              {collapsed && isSecurityEventsItem && badgeCount > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex min-w-4 items-center justify-center rounded-full bg-red-500 px-1 py-0.5 text-[9px] font-semibold text-white shadow-sm shadow-red-500/40">
                  {badgeCount > 9 ? "9+" : badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {!collapsed && adminEmail && (
        <div className="truncate border-t border-border-subtle px-4 py-3 text-xs text-text-dim font-mono">
          {adminEmail}
        </div>
      )}

      <div className="border-t border-border-subtle px-2 py-3">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/control-center/login" })}
          className="focus-ring flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-muted hover:bg-white/5 hover:text-critical-light transition-colors"
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </>
  );
}

export default function AdminSidebar({ adminEmail, securityEventCount = 0 }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [liveSecurityEventCount, setLiveSecurityEventCount] = useState(
    Math.max(securityEventCount - getLastReadSecurityEventCount(), 0)
  );

  useEffect(() => {
    let active = true;

    const refreshCount = async () => {
      try {
        const response = await fetch("/api/security-events/count", { cache: "no-store" });
        const payload = await response.json();
        const total = Number(payload?.count ?? 0);
        const lastRead = getLastReadSecurityEventCount();
        const unread = Math.max(total - lastRead, 0);
        if (active) {
          setLiveSecurityEventCount(Number.isFinite(unread) ? unread : 0);
        }
      } catch {
        if (active) setLiveSecurityEventCount(0);
      }
    };

    refreshCount();
    const interval = setInterval(refreshCount, 30000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const lastRead = getLastReadSecurityEventCount();
    setLiveSecurityEventCount(Math.max(securityEventCount - lastRead, 0));
  }, [securityEventCount]);

  const handleSecurityEventsClick = () => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SECURITY_EVENTS_READ_KEY, String(securityEventCount));
    setLiveSecurityEventCount(0);
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 flex w-full items-center justify-between border-b border-border-subtle bg-bg-surface/95 px-4 py-3 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex items-center justify-center rounded-md p-2 text-text-muted transition-colors hover:bg-white/5 hover:text-text-secondary"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <span className="inline-flex items-center justify-center rounded-md border border-border-subtle bg-bg-card p-2 text-brand-cyan shadow-sm shadow-black/10">
          <ShieldCheck size={18} />
        </span>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex h-full w-72 flex-col border-r border-border-subtle bg-bg-surface">
            <div className="flex items-center justify-between px-4 py-4">
              <span className="inline-flex items-center justify-center rounded-md border border-border-subtle bg-bg-card p-2 text-brand-cyan shadow-sm shadow-black/10">
                <ShieldCheck size={18} />
              </span>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center rounded-md p-1.5 text-text-muted transition-colors hover:bg-white/5 hover:text-text-secondary"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>
            <SidebarContent
              collapsed={false}
              adminEmail={adminEmail}
              securityEventCount={liveSecurityEventCount}
              onNavigate={() => setMobileOpen(false)}
              onSecurityEventsClick={handleSecurityEventsClick}
            />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex sticky top-0 h-screen shrink-0 flex-col border-r border-border-subtle bg-bg-surface transition-[width] duration-200 ${collapsed ? "w-[68px]" : "w-64"
          }`}
      >
        <div className="flex items-center justify-between px-4 py-5">
          {!collapsed && (
            <span className="inline-flex items-center gap-2 font-heading text-sm font-bold text-text-primary">
              <ShieldCheck size={18} className="text-brand-cyan" />
              Control Center
            </span>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="focus-ring ml-auto rounded-md p-1.5 text-text-muted hover:bg-white/5 hover:text-text-secondary"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        <SidebarContent
          collapsed={collapsed}
          adminEmail={adminEmail}
          securityEventCount={liveSecurityEventCount}
          onSecurityEventsClick={handleSecurityEventsClick}
        />
      </aside>
    </>
  );
}
