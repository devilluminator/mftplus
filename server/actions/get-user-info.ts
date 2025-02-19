"use server";
import { cookies } from "next/headers";
import { db } from "@/server/db";
import { actionClient } from "@/lib/safe-action";
import { decrypt } from "@/lib/auth";

// ✅ Single user info
export const getUserInfo = actionClient.action(async () => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken");
  if (!refreshToken) return { success: false, message: "شما وارد نشده اید" };
  const { uuid } = await decrypt(refreshToken.value, "refresh");
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.uuid, uuid as string),
  });
  return { success: true, user };
});

// ✅ All users info
export const getAllUsers = actionClient.action(async () => {
  const users = await db.query.users.findMany();
  return { success: true, users };
});
