"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { message?: string };
        setError(data.message ?? "This reset link is expired or invalid.");
        return;
      }

      window.location.assign("/reset-password/success");
    } catch {
      setError("Unable to reset your password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="pointer-events-auto absolute left-1/2 top-[365px] flex w-[min(405px,calc(100vw-48px))] -translate-x-1/2 flex-col gap-4"
    >
      <h2 className="futura-light text-center text-[22px] text-soft-ivory">
        Create a new password
      </h2>
      <p className="futura-light text-center text-[16px] leading-6 text-soft-ivory/85">
        Choose a new password for your account.
      </p>
      {(["password", "confirmPassword"] as const).map((field) => (
        <label key={field} className="relative block">
          <span className="sr-only">
            {field === "password" ? "New password" : "Confirm new password"}
          </span>
          <input
            type={showPasswords ? "text" : "password"}
            placeholder={field === "password" ? "New password" : "Confirm new password"}
            value={field === "password" ? password : confirmPassword}
            onChange={(event) =>
              field === "password"
                ? setPassword(event.target.value)
                : setConfirmPassword(event.target.value)
            }
            className="futura-light h-12 w-full rounded-full border border-soft-ivory/45 bg-transparent px-5 pr-12 text-[16px] text-soft-ivory outline-none placeholder:text-soft-ivory/75 focus-visible:ring-2 focus-visible:ring-antique-gold"
          />
          {field === "password" && (
            <button
              type="button"
              onClick={() => setShowPasswords((visible) => !visible)}
              className="absolute right-0 top-0 h-12 w-12 text-soft-ivory/75 focus-visible:ring-2 focus-visible:ring-antique-gold"
              aria-label={showPasswords ? "Hide passwords" : "Show passwords"}
            >
              {showPasswords ? "Hide" : "Show"}
            </button>
          )}
        </label>
      ))}
      {error && <p role="alert" className="futura-light text-center text-[14px] leading-5 text-[#ffb4b4]">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="futura-light h-12 rounded-full bg-soft-ivory text-[16px] text-dark-burgundy hover:opacity-90 focus-visible:ring-2 focus-visible:ring-antique-gold disabled:opacity-60"
      >
        {submitting ? "SAVING..." : "SAVE NEW PASSWORD"}
      </button>
      <Link href="/sign-in" className="futura-light text-center text-[14px] text-antique-gold underline underline-offset-2 hover:opacity-70">
        Return to login
      </Link>
    </form>
  );
}
