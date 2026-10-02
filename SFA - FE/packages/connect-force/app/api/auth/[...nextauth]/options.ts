import { userLogin } from "@/service/auth/login.service";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "Sign in",
      id: "credentials",
      credentials: {
        userName: {
          label: "Username",
          type: "text",
          placeholder: "Username",
        },
        password: {
          label: "Password:",
          type: "password",
          placeholder: "Password",
        },
      },

      async authorize(credentials) {
        if (!credentials) {
          // Handle the case where credentials are undefined
          return null;
        }

        const res = await userLogin(credentials);
        const data = await res.json();

        if (res.ok && data?.result) {
          return {
            id: data.result.token,
            name: data.result.userName,
            email: null,
            accessToken: data.result.token,
            user: {
              name: data.result.userName,
              roleId: data.result.roleId,
              accessToken: data.result.token,
              isFirstLogin: data.result.isFirstLogin,
            },
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return { ...token, ...user };
      }
      return token;
    },

    async session({ session, token }) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.expiresIn = token.expiresIn;
      return session;
    },
  },
};
