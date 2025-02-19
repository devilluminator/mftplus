"use server";

import { object, string } from "yup";
import { actionClient } from "@/lib/safe-action";
import { getUserInfo } from "./get-user-info";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

const schema = object({
  username: string().required(),
  password: string().required(),
});

export const adminLoginAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { username, password } }) => {
    const user = await getUserInfo();
    console.log(user);

    if (!user?.data?.success) {
      return { failure: "لطفا در ابتدا وارد حساب کاربری خود شوید" };
    }
    if (username === "admin" && password === "admin") {
      // Set role to admin
      await db
        .update(users)
        .set({ role: "admin" })
        .where(eq(users.uuid, user.data.user?.uuid as string))
        .returning()
        .catch((error) => {
          console.log("\x1b[32m%s\x1b[0m", error);
          throw new Error("Failed to update role");
        });
      return {
        success: "ادمین عزیز خوش آمدید",
      };
    }

    return { failure: "اطلاعات وارد شده صحیح نمی باشد" };
  });
