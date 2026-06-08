import { ToastProvider } from "@/components/admin/toast";
import { AdminHeader } from "@/components/admin/admin-header";

/**
 * Admin chrome. No auth check here (layouts don't re-render on navigation —
 * Next 16 guidance); each admin page calls verifySession() itself.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <AdminHeader />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
          {children}
        </div>
      </main>
    </ToastProvider>
  );
}
