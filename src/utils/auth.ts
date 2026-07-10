import { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { getAuthSecret } from "@/lib/server/authSecret";

const hasValue = (value: string | undefined) => typeof value === "string" && value.trim().length > 0;
const cleanEnvValue = (value: string | undefined) => {
  if (!value) {
    return "";
  }

  return value.trim().replace(/^['\"]|['\"]$/g, "");
};

const providers: NonNullable<NextAuthOptions["providers"]> = [
  CredentialsProvider({
    name: "Admin Login",
    credentials: {
      email: { label: "Email", type: "email" },
      otpLoginToken: { label: "OTP Login Token", type: "text" },
    },
    async authorize(credentials) {
      const adminEmail = cleanEnvValue(process.env.ADMIN_LOGIN_EMAIL);

      if (!adminEmail) {
        return null;
      }

      if (!credentials?.email || !credentials?.otpLoginToken) {
        return null;
      }

      const normalizedEmail = credentials.email.trim().toLowerCase();
      const isAdminEmail = normalizedEmail === adminEmail.trim().toLowerCase();

      if (!isAdminEmail) {
        return null;
      }

      const { consumeAdminLoginToken } = await import("@/lib/server/adminOtp");
      const isValidOtpToken = await consumeAdminLoginToken(normalizedEmail, credentials.otpLoginToken);

      if (!isValidOtpToken) {
        return null;
      }

      return {
        id: "admin",
        email: adminEmail,
        name: "Admin",
        role: "admin",
      };
    },
  }),
];

if (hasValue(process.env.GITHUB_CLIENT_ID) && hasValue(process.env.GITHUB_CLIENT_SECRET)) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  );
}

if (hasValue(process.env.GOOGLE_CLIENT_ID) && hasValue(process.env.GOOGLE_CLIENT_SECRET)) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  );
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/signin",
  },
  secret: getAuthSecret(),
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
    updateAge: 60 * 60,
  },

  providers,

  callbacks: {
    jwt: async ({ token, user }) => {
      const authToken = token as JWT & { id?: string; role?: string };
      const authUser = user as { id?: string; role?: string } | undefined;

      if (authUser) {
        return {
          ...authToken,
          id: authUser.id,
          role: authUser.role || authToken.role || "user",
        };
      }
      return authToken;
    },

    session: async ({ session, token }) => {
      const authToken = token as JWT & { id?: string; role?: string };

      if (session?.user) {
        return {
          ...session,
          user: {
            ...session.user,
            id: authToken.id,
            role: authToken.role,
          },
        };
      }
      return session;
    },
  },
};
