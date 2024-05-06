import CredentialsProvider from "next-auth/providers/credentials";

export const authOption = {
  debug: true,
  pages: {
    signIn: "/signin",
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (credentials?.username === process.env.USERNAME && credentials?.password === process.env.PASSWORD) {
          const user = { id: "1", name: "", email: "" };
          return user;
        }

        return null;
      },
    }),
  ],
};
