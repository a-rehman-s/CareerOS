/**
 * Authentication Server Actions
 */
"use server";

import { db } from "@/lib/db";
import { signUpSchema } from "@/validators/auth";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import type { ActionState } from "@/types";

/**
 * Register a new user account.
 */
export async function registerUser(
  _prevState: ActionState<{ email: string }>,
  formData: FormData
): Promise<ActionState<{ email: string }>> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please fix the form errors",
      details: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { name, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  // Check if email already taken
  const existing = await db.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true },
  });

  if (existing) {
    return {
      success: false,
      error: "An account with this email already exists",
      details: { email: ["Email already in use"] },
    };
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Create user and initial profile
  await db.user.create({
    data: {
      name,
      email: normalizedEmail,
      passwordHash,
      emailVerified: new Date(), // auto-verify for credentials
      profile: {
        create: {}, // empty profile shell
      },
    },
  });

  return { success: true, data: { email: normalizedEmail } };
}

/**
 * Sign in with credentials.
 */
export async function signInWithCredentials(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Invalid email or password" };
        default:
          return { success: false, error: "An error occurred. Please try again." };
      }
    }
    // Next.js redirect throws an error that we need to propagate
    throw error;
  }
}
