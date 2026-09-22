import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminShell({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex min-h-screen bg-bg-canvas">
      <AdminSidebar adminEmail={session?.user?.email} />
      <div className="min-w-0 flex-1">
        <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10 py-8">{children}</main>
      </div>
    </div>
  );
}
