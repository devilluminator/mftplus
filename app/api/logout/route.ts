import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const cookieStore = await cookies();
  cookieStore.delete("refreshToken");
  cookieStore.delete("accessToken");
  console.log("\x1b[32m%s\x1b[0m", "Session Deleted! - Logged Out");
  // no need to also delete user from DB
  return NextResponse.json({
    message: "Session deleted successfully",
    status: 200,
  });
}
