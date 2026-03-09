import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = {
    title: "Apex Admin | Motor Spares",
    description: "Administrative control panel for Apex Auto Parts.",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex bg-surface-50 min-h-screen text-surface-950 font-outfit">
            <AdminSidebar />
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
