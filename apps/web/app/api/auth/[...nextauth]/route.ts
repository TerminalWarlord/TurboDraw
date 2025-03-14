import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import { prismaClient } from "db/db";
import NextAuth, { AuthOptions, User } from "next-auth"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


interface CustomUser extends User {
  id: string;
  username: string;
  accessToken?: string;
}


export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "johndoe" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req): Promise<CustomUser | null> {
        console.log(credentials)
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await prismaClient.user.findFirst({
          where: {
            username: credentials?.username
          }
        });
        console.log(user)
        if (user) {
          const hashedPassword = await bcrypt.compare(credentials.password, user.password || "");
          if (hashedPassword) {
            const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "");

            return {
              id: user.id.toString(),
              username: user.username,
              accessToken,
            }
          }
          else {
            throw new Error("Invalid password");
          }
        } else {
          throw new Error("User not found");
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    })
  ],
  pages: {
    signIn: "/auth"
  },
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          id: token.id as number,
          username: token.username as string,
          email: token.email,
          accessToken: token.accessToken as string,
        }
      }
    },
    async jwt({ token, user, account }) {
      const customUser = user as CustomUser;
      if (user) {
        token.id = user.id;
        token.username = user.email;
        token.email = user.email;
        if (customUser.accessToken) {
          token.accessToken = customUser.accessToken;
        }
      }
      if (account?.provider==="google" && !token.accessToken) {
        const accessToken = jwt.sign({
          userId: user.id
        }, process.env.JWT_SECRET||"");
        token.accessToken = accessToken;
      }
      return token;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user.email) {
          return false;
        }
        const exisitingUser = await prismaClient.user.findFirst({
          where: { email: user.email }
        });

        if (!exisitingUser) {
          await prismaClient.user.create({
            data: {
              email: user.email,
              username: user.email,
              providers: "GOOGLE"
            }
          });
          return true;
        }

        return true;

      }
      else if (account?.provider === 'credentials') {
        console.log("signin")
        return true;
      }
      return false;
    },
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }