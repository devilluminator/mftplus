"use server";
// ⭐ using neonDB drizzle-orm postgresql with resend email api => authentication handling
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
//  ✅ Schema for phone_number and pin code validation,
import { registerValidation } from "@/types/registration-schema";
//  ✅ JWT-jose
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";

const deletePinCode = async (phone_number: string) => {
  await db
    .update(users)
    .set({ pin: "empty" })
    .where(eq(users.phone_number, phone_number))
    .returning()
    .catch((error) => {
      throw new Error(error);
    });
};
// ✅ SMS panel infos
const username = process.env.WEB_ONE_USERNAME;
const password = process.env.WEB_ONE_PASSWORD;

const sendPinCode = async (phone_number: string, pin_code: string) => {
  const { status, body } = await fetch(
    "https://rest.payamakapi.ir/api/v1/SMS/Send",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        UserName: username,
        Password: password,
        From: "10002147",
        To: phone_number,
        Message: `کد تست وورد برای پروژه پایانی ${pin_code} - دوره Nextjs در مجتمع فنی - mftplus`,
      }),
    },
  );
  console.log(status, body);

  if (status === 200) {
    // ✅ Deleting pin code after 3 minutes
    setTimeout(async () => {
      await deletePinCode(phone_number);
    }, 180000);
    return {
      success: true,
      type: "code-sent",
      message: "کد ورود برای شما ارسال شد",
    };
  }
};
// ✅ First check if user exists => sending only pin, if not, save the user
const checkUserAndSave = async (phone_number: string) => {
  // ✅ Validate phone number
  const validate_phone_number = await registerValidation.isValid({
    phone_number,
  });
  if (!validate_phone_number)
    return {
      success: false,
      type: "invalid- phone-number",
      message: "شماره وارد شده اشتباه است",
    };
  // ✅ 6 digit pin code
  const pin_code = Math.floor(100000 + Math.random() * 900000);
  try {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.phone_number, phone_number),
    });
    // ✅ If user exists, update pin code, return
    if (user) {
      await db
        .update(users)
        .set({ pin: pin_code.toString() })
        .where(eq(users.phone_number, phone_number))
        .returning()
        .catch((error) => {
          console.log(error);

          throw new Error("Failed to update pin code");
        });
      await sendPinCode(phone_number, pin_code.toString());
      return {
        success: true,
        type: "existing",
        message: "کد ورود جدید ارسال شد",
      };
    }
    // ✅ Insert new user to DB
    await db
      .insert(users)
      .values({
        phone_number: phone_number,
        pin: pin_code.toString(),
      })
      .returning()
      .catch((error) => {
        console.log("Error inserting new user:", error);
        throw new Error("Failed to insert new user");
      });
    await sendPinCode(phone_number, pin_code.toString());
    return { success: true, type: "new", message: "کد ورود ارسال شد" };
  } catch (error) {
    console.log(error);
    return { success: false, type: "error", message: "خطا در ارسال کد ورود" };
  } finally {
    // ✅ Logging pin code in server side for debugging stuff and faster process to insert the code in the client side
    console.log("\x1b[32m%s\x1b[0m", `Pin Code => ${pin_code}`);
  }
};
const checkPin = async (phone_number: string, pin: string) => {
  // ✅ Validate email & pin code
  const validation = await registerValidation.isValid({ phone_number, pin });
  if (!validation)
    return {
      success: false,
      type: "invalid-data",
      message: "اطلاعات وارد شده اشتباه است",
    };
  const pinExist = await db.query.users.findFirst({
    where: (users, { eq, and }) =>
      and(eq(users.phone_number, phone_number), eq(users.pin, pin)),
  });
  if (!pinExist) {
    return {
      success: false,
      type: "invalid-pin",
      message: "کد ورود اشتباه است",
    };
  }
  // ✅ JWT-jose for session handling
  const accessToken = await encrypt({ uuid: pinExist.uuid }, "access");
  const refreshToken = await encrypt({ uuid: pinExist.uuid }, "refresh");
  // ✅ set access token and refresh token in cookies
  (await cookies()).set("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 15, // 15 min
    path: "/",
  });
  // refresh token
  (await cookies()).set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
  // ✅ Update pin code to empty after successful login
  await deletePinCode(phone_number);
  return {
    success: true,
    type: "valid-pin",
    message: "ورود به حساب کاربری",
    uuid: pinExist.uuid,
  };
};
export { checkUserAndSave, checkPin };
