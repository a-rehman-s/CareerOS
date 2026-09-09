import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Root landing page.
 * Redirects authenticated users to the dashboard,
 * unauthenticated users to the sign-in page.
 *
 * Phase 4 will add a proper public landing/portfolio page here.
 */
export default async function RootPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  redirect("/sign-in");
}
