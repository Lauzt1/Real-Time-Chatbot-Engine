// src/app//api/auth/[...nextauth]/route.js
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import Admin from "@/models/admin";
import connectMongoDB from "@/libs/mongodb";

// App Router handler for NextAuth
const handler = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize({ username, password }) {
        await connectMongoDB();
        const admin = await Admin.findOne({ username });
        if (!admin || password !== admin.password) return null;
        return { id: admin._id.toString(), name: admin.username };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

// Export named HTTP methods for App Router
export { handler as GET, handler as POST };