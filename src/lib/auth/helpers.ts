/**
 * Auth helper functions for server-side use.
 *
 * These helpers provide typed, convenient access to the authenticated session.
 * Never expose these to the client.
 */
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Get the current session, or return null.
 * Use in Server Components and Route Handlers.
 */
export async function getSession() {
  return await auth();
}

/**
 * Get the authenticated user, throwing a redirect if not authenticated.
 * Use this in protected Server Components.
 */
export async function requireAuth() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  return session.user as { id: string; email: string; name: string | null };
}

/**
 * Get the current user's ID from the session.
 * Returns null if not authenticated.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}
