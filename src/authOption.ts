import { verifyPasswordToGetUser } from "@/service/auth";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOption: AuthOptions = {
  debug: true,
  pages: {
    signIn: "/signin",
    newUser: "/signup",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;

        const user = await verifyPasswordToGetUser(credentials.username, credentials.password);
        if (!user) return null;

        return {
          id: user.publicUserId,
          name: user.username,
        };
      },
    }),
  ],
};
