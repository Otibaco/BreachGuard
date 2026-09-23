import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getSecurityEventCountSince } from "@/controllers/securityEventController";

export default async function AdminShell({ children }) {
  const session = await getServerSession(authOptions);
  const securityEventCount = await getSecurityEventCountSince(24);

  return (
    <div className="flex min-h-screen flex-col bg-bg-canvas lg:flex-row">
      <AdminSidebar adminEmail={session?.user?.email} securityEventCount={securityEventCount} />
      <div className="min-w-0 flex-1">
        <main className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
