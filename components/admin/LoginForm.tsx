"use client";

import { useActionState } from "react";
import { loginAction, type AuthResult } from "@/app/admin/_actions/auth";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<AuthResult, FormData>(loginAction, {});
  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="passcode" className="text-sm font-semibold text-ink">
          Passcode
        </label>
        <input
          id="passcode"
          name="passcode"
          type="password"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          minLength={4}
          autoFocus
          className="mt-2 w-full rounded-xl border border-line bg-bg px-4 py-3 text-lg tracking-[0.4em] text-center font-semibold focus:border-ink focus:outline-none"
        />
      </div>
      {state.error ? (
        <p className="text-sm font-medium text-red-700">{state.error}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-full bg-ink px-5 py-3 text-base font-semibold text-bg disabled:opacity-50"
      >
        {pending ? "Checking..." : "Enter admin"}
      </button>
    </form>
  );
}
