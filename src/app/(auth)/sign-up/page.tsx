import type { Metadata } from "next";
import { SignUpForm } from "./sign-up-form";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your CareerOS account and take control of your career",
};

export default function SignUpPage() {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Create your account</h1>
        <p className="text-slate-400 mt-1">Start managing your career with CareerOS</p>
      </div>
      <SignUpForm />
      <p className="text-center text-slate-400 text-sm mt-6">
        Already have an account?{" "}
        <a
          href="/sign-in"
          className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
        >
          Sign in
        </a>
      </p>
    </div>
  );
}
