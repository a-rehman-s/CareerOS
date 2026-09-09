/**
 * Unit tests for utility functions.
 */
import { cn, formatDate, formatDateRange, truncate, capitalize, enumToLabel, slugify, formatSalary, getInitials } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });
  it("resolves Tailwind conflicts", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
  it("handles falsy values", () => {
    expect(cn("a", false && "b", undefined, null, "c")).toBe("a c");
  });
});

describe("formatDate", () => {
  it("formats a valid date", () => {
    const result = formatDate(new Date("2024-01-15"));
    expect(result).toMatch(/Jan/);
    expect(result).toMatch(/2024/);
  });
  it("returns dash for null/undefined", () => {
    expect(formatDate(null)).toBe("—");
    expect(formatDate(undefined)).toBe("—");
  });
});

describe("formatDateRange", () => {
  it("formats a date range", () => {
    const result = formatDateRange("2022-01-01", "2023-06-01");
    expect(result).toContain("–");
  });
  it("shows Present for current position", () => {
    const result = formatDateRange("2022-01-01", null, true);
    expect(result).toContain("Present");
  });
});

describe("truncate", () => {
  it("truncates long strings", () => {
    expect(truncate("Hello World", 8)).toBe("Hello...");
  });
  it("does not truncate short strings", () => {
    expect(truncate("Hello", 10)).toBe("Hello");
  });
});

describe("capitalize", () => {
  it("capitalizes first letter", () => {
    expect(capitalize("hello")).toBe("Hello");
  });
  it("lowercases rest", () => {
    expect(capitalize("HELLO")).toBe("Hello");
  });
});

describe("enumToLabel", () => {
  it("converts FULL_TIME to Full Time", () => {
    expect(enumToLabel("FULL_TIME")).toBe("Full Time");
  });
  it("converts FINAL_INTERVIEW to Final Interview", () => {
    expect(enumToLabel("FINAL_INTERVIEW")).toBe("Final Interview");
  });
});

describe("slugify", () => {
  it("converts spaces to dashes", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });
  it("removes special characters", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
  });
});

describe("formatSalary", () => {
  it("formats a salary range", () => {
    const result = formatSalary(100000, 150000, "USD");
    expect(result).toContain("$100,000");
    expect(result).toContain("$150,000");
  });
  it("returns Not disclosed when both null", () => {
    expect(formatSalary(null, null)).toBe("Not disclosed");
  });
  it("formats min only", () => {
    const result = formatSalary(80000, null);
    expect(result).toContain("$80,000");
  });
});

describe("getInitials", () => {
  it("gets initials from full name", () => {
    expect(getInitials("John Doe")).toBe("JD");
  });
  it("gets one initial from single name", () => {
    expect(getInitials("John")).toBe("J");
  });
  it("returns ? for null", () => {
    expect(getInitials(null)).toBe("?");
  });
});
