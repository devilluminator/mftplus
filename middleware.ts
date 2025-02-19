"use server";
import { NextResponse, NextRequest } from "next/server";
import { decrypt, encrypt } from "./lib/auth";
import { cookies } from "next/headers";
import { db } from "./server/db";

export async function middleware(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  const refreshToken = cookieStore.get("refreshToken");

  if (!refreshToken) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const payload = await decrypt(refreshToken.value, "refresh");

  if (!payload) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ✅ Refreshing the access-token if refresh-token is valid
  if (!accessToken) {
    const newAccessToken = await encrypt(payload, "access");
    if (newAccessToken) {
      console.log("\x1b[32m%s\x1b[0m", "New token generated!");
      cookieStore.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 15, // 15 min
      });
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", req.url));
  }
  // ✅ Checking if user role === admin
  if (req.nextUrl.pathname.startsWith("/admin-dashboard")) {
    const user = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.uuid, payload.uuid as string),
    });
    if (user?.role !== "admin") {
      return NextResponse.redirect(new URL("/admin-dashboard", req.url));
    }
  }
}

export const config = {
  matcher: ["/dashboard", "/admin-dashboard/(.*)"],
};
