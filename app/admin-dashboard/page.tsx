import React, { use } from "react";
import { getUserInfo } from "@/server/actions/get-user-info";
import AdminLoginForm from "@/components/admin-login";
import { FakeChart } from "@/components/fake-chart";
import AddCategory from "@/components/category/add-category";

function AdminDashboardPage() {
  // ⭐ React Query could be used to display user information and handle re-fetching data here as well, but we will explore some alternative approaches.
  const admin = use(getUserInfo());

  if (admin?.data?.user?.role !== "admin") return <AdminLoginForm />;

  return (
    <div className='relative flex flex-col justify-center items-start gap-3 w-full'>
      <FakeChart />
      <AddCategory />
    </div>
  );
}

export default AdminDashboardPage;
