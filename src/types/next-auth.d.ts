/**
 * NextAuth.js type augmentation.
 * Extends the Session and JWT types to include user.id.
 */
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string | null;
  }
}
