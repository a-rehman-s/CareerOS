import type { Metadata } from "next";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your CareerOS account to manage your career",
};

export default function SignInPage() {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
        <p className="text-slate-400 mt-1">Sign in to your CareerOS account</p>
      </div>
      <SignInForm />
      <p className="text-center text-slate-400 text-sm mt-6">
        Don&apos;t have an account?{" "}
        <a
          href="/sign-up"
          className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
        >
          Create one
        </a>
      </p>
    </div>
  );
}
