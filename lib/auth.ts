// OPTIONS for Next Auth and Providers eg "Google", "Github"

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import Users from "@/models/Users";
import bcrypt from "bcryptjs";
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username:{label:"Username",type:"text"},
        email: { label: "Email",type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or passowrd");
        }
        try {
          await connectToDatabase();
          const user = await Users.findOne({ email: credentials.email });
          if (!user) {
            throw new Error("User not found");
          }
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValid) {
            throw new Error("Invalid password");
          }
          return {
            id: user._id.toString(),
            username:user.username,
            email: user.email,
          };
        } catch (error) {
          throw error;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },
pages:{
    signIn:"/login",
    error:"/login"
},
session: {
    strategy: "jwt",
    maxAge:30*24*60*60
  },
  secret:process.env.NEXTAUTH_SECRET
};
