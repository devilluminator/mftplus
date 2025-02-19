import { getUserInfo, getAllUsers } from "@/server/actions/get-user-info";
export const userQueryOptions = () => ({
  queryKey: ["user"],
  queryFn: getUserInfo,
});

export const usersQueryOptions = () => ({
  queryKey: ["users"],
  queryFn: getAllUsers,
});
