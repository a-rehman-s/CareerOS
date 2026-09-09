/**
 * Environment variable validation.
 * Validates all required env vars at application startup using Zod.
 * Throws clearly if misconfigured — fail fast, never silently.
 */
import { z } from "zod";

const serverEnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid PostgreSQL connection string"),
  DIRECT_URL: z.string().url("DIRECT_URL must be a valid PostgreSQL connection string").optional(),

  // Auth
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters"),
  AUTH_URL: z.string().url("AUTH_URL must be a valid URL").optional(),

  // App
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  // Optional services (validated lazily when used)
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  AI_API_KEY: z.string().optional(),
  AI_PROVIDER: z.enum(["openai", "anthropic", "google"]).optional(),
  STORAGE_BUCKET: z.string().optional(),
  JOB_PROVIDER_API_KEY: z.string().optional(),
  JOB_PROVIDER_APP_ID: z.string().optional(),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
});

type ServerEnv = z.infer<typeof serverEnvSchema>;
type ClientEnv = z.infer<typeof clientEnvSchema>;

/**
 * Validate server-side environment variables.
 * Only call from server-side code (API routes, server components, lib).
 */
function validateServerEnv(): ServerEnv {
  const result = serverEnvSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const messages = Object.entries(errors)
      .map(([key, msgs]) => `  ${key}: ${msgs?.join(", ")}`)
      .join("\n");

    throw new Error(
      `\n❌ Invalid environment variables:\n${messages}\n\nPlease check your .env file against .env.example`
    );
  }

  return result.data;
}

/**
 * Validate client-side public environment variables.
 */
function validateClientEnv(): ClientEnv {
  const result = clientEnvSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  if (!result.success) {
    console.warn("⚠️ Some client environment variables are invalid:", result.error.flatten());
  }

  return result.data ?? {};
}

// Validated singletons — throws at startup if server env is broken
export const env = validateServerEnv();
export const clientEnv = validateClientEnv();
