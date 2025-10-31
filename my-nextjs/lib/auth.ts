import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import  prisma  from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"

export const authOptions : NextAuthOptions= {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) return null

        const isValid = await compare(credentials.password, user.hashedPassword ?? "")
        if (!isValid) return null

        return user
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (token) session.user.id = token.id
      return session
    },
  },

  pages: {
    signIn: "/auth/signin", // optional custom login page
  },
}

