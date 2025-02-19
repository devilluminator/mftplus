import type { Metadata } from "next";
// ⭐ Static Metadata
export const metadata: Metadata = {
  title: "Dashboard",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='relative flex flex-col justify-start items-start gap-3 container'>
      {children}
    </div>
  );
}
