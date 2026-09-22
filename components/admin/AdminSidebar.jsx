"use client";

import { useState } from "react";
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

function SidebarContent({ collapsed, onNavigate, adminEmail }) {
  const pathname = usePathname();

  return (
    <>
      <nav className="flex-1 space-y-1 px-2">
        {navItems.map((item) => {
          const active =
            item.href === "/control-center"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-brand-primary/15 text-brand-cyan"
                  : "text-text-muted hover:bg-white/5 hover:text-text-secondary"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
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

export default function AdminSidebar({ adminEmail }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b border-border-subtle bg-bg-surface px-4 py-3">
        <span className="inline-flex items-center gap-2 font-heading text-sm font-bold text-text-primary">
          <ShieldCheck size={18} className="text-brand-cyan" />
          Control Center
        </span>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-md p-2 text-text-muted hover:bg-white/5"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex h-full w-64 flex-col border-r border-border-subtle bg-bg-surface">
            <div className="flex items-center justify-between px-4 py-4">
              <span className="inline-flex items-center gap-2 font-heading text-sm font-bold text-text-primary">
                <ShieldCheck size={18} className="text-brand-cyan" />
                Control Center
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-md p-1.5 text-text-muted hover:bg-white/5"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>
            <SidebarContent
              collapsed={false}
              adminEmail={adminEmail}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex sticky top-0 h-screen shrink-0 flex-col border-r border-border-subtle bg-bg-surface transition-[width] duration-200 ${
          collapsed ? "w-[68px]" : "w-64"
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

        <SidebarContent collapsed={collapsed} adminEmail={adminEmail} />
      </aside>
    </>
  );
}
