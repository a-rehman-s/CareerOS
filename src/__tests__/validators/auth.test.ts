/**
 * Unit tests for Zod auth validators.
 */
import { signInSchema, signUpSchema } from "@/validators/auth";

describe("signInSchema", () => {
  it("validates a correct sign-in", () => {
    const result = signInSchema.safeParse({ email: "test@example.com", password: "secret" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = signInSchema.safeParse({ email: "not-an-email", password: "secret" });
    expect(result.success).toBe(false);
  });

  it("rejects empty password", () => {
    const result = signInSchema.safeParse({ email: "test@example.com", password: "" });
    expect(result.success).toBe(false);
  });
});

describe("signUpSchema", () => {
  const valid = {
    name: "Alex Smith",
    email: "alex@example.com",
    password: "Password1",
    confirmPassword: "Password1",
  };

  it("validates a correct sign-up", () => {
    const result = signUpSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects short name", () => {
    const result = signUpSchema.safeParse({ ...valid, name: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = signUpSchema.safeParse({ ...valid, email: "bad-email" });
    expect(result.success).toBe(false);
  });

  it("rejects weak password (too short)", () => {
    const result = signUpSchema.safeParse({ ...valid, password: "pass", confirmPassword: "pass" });
    expect(result.success).toBe(false);
  });

  it("rejects password without uppercase", () => {
    const result = signUpSchema.safeParse({ ...valid, password: "password1", confirmPassword: "password1" });
    expect(result.success).toBe(false);
  });

  it("rejects password without number", () => {
    const result = signUpSchema.safeParse({ ...valid, password: "Password", confirmPassword: "Password" });
    expect(result.success).toBe(false);
  });

  it("rejects mismatched passwords", () => {
    const result = signUpSchema.safeParse({ ...valid, confirmPassword: "Different1" });
    expect(result.success).toBe(false);
    const errors = result.error?.flatten().fieldErrors;
    expect(errors?.confirmPassword).toBeDefined();
  });
});
