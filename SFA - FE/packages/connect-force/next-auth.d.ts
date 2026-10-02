import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    expiresIn: number;
    refreshExpireIn: string;
    refreshToken: string;
    tokenType: string;
    sessionStateOfBackend: string;
    user: {
      id: string;
      roleId: number;
      name: string;
      email: string;
      isFirstLogin?: boolean;
    };
  }
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    expiresIn: number;
    refreshExpireIn: string;
    refreshToken: string;
    tokenType: string;
    sessionStateOfBackend: string;
    user: {
      id: string;
      roleId: number;
      name: string;
      email: string;
      isFirstLogin?: boolean;
    };
  }
}
