import type { Metadata } from "next";
import AdminNavbar from "@/components/admin-navbar";
import { getUserInfo } from "@/server/actions/get-user-info";

const isAdmin = async () => {
  const admin = await getUserInfo();
  return admin?.data?.user?.role === "admin";
};

// ⭐ Static Metadata
export const metadata: Metadata = {
  title: "Admin - Dashboard",
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='relative flex md:flex-row flex-col justify-start items-start gap-3 container'>
      {(await isAdmin()) ? <AdminNavbar /> : null}
      {children}
    </div>
  );
}
