import { withAuth } from "next-auth/middleware";
import { signOut } from "next-auth/react";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/login",
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};
