// src/middleware.js
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

// only run on /admin routes:
export const config = { matcher: ["/admin/:path*"] };
