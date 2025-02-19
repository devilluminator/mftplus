"use server";

import { actionClient } from "@/lib/safe-action";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import { updateUserInfoSchema } from "@/schemas/update-user-info";
import { number, object, string } from "yup";

export const UpdateUserInfo = actionClient
  .schema(updateUserInfoSchema)
  .action(
    async ({
      parsedInput: { full_name, email, address, city, state, lat, lng },
    }) => {
      console.log(full_name, email, address, city, state, lat, lng);

      const updated_at = new Date().toISOString();
      const cookieStore = await cookies();
      const refreshToken = cookieStore.get("refreshToken");
      if (!refreshToken)
        return { success: false, message: " لطفا وارد حساب کاربری خود شوید " };
      const { uuid } = await decrypt(refreshToken.value, "refresh");
      console.log("UUID=>", uuid);

      await db
        .update(users)
        .set({
          full_name,
          email,
          address,
          city,
          state,
          lat,
          lng,
          updated_at,
        })
        .where(eq(users.uuid, uuid as string))
        .returning()
        .catch((error) => {
          console.log("\x1b[32m%s\x1b[0m", error);
          return {
            message: "خطا در به روز رسانی اطلاعات",
            success: false,
          };
        });
      return {
        message: "اطلاعات شما با موفقیت به روز رسانی شد",
        success: true,
      };
    },
  );
// ✅ Update user role admin/user by id
export const updateUserRole = actionClient
  .schema(
    object({
      id: number().required(),
      role: string().required(),
    }),
  )
  .action(async ({ parsedInput: { id, role } }) => {
    await db
      .update(users)
      .set({ role })
      .where(eq(users.id, id))
      .returning()
      .catch((error) => {
        console.log("\x1b[32m%s\x1b[0m", error);
        return { message: "خطا در به روز رسانی سطح دسترسی", success: false };
      });
    return { message: "سطح دسترسی با موفقیت به روز رسانی شد", success: true };
  });
