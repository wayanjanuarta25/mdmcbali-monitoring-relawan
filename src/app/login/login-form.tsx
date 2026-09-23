"use client";

import { useActionState } from "react";
import { LockKeyhole, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { login, type LoginState } from "@/app/login/actions";

const initialState: LoginState = { error: null };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground" htmlFor="email">
          Username atau Email
        </label>
        <div className="relative">
          <Mail
            aria-hidden="true"
            className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            autoComplete="username email"
            className="h-11 w-full rounded-md border border-input bg-white pl-10 pr-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
            id="email"
            name="email"
            placeholder="Masukkan username atau email..."
            required
            type="text"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-semibold text-foreground"
          htmlFor="password"
        >
          Password
        </label>
        <div className="relative">
          <LockKeyhole
            aria-hidden="true"
            className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            autoComplete="current-password"
            className="h-11 w-full rounded-md border border-input bg-white pl-10 pr-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
            id="password"
            minLength={6}
            name="password"
            placeholder="Masukkan password"
            required
            type="password"
          />
        </div>
      </div>

      {state.error ? (
        <p
          aria-live="polite"
          className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-sm text-destructive"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <Button className="h-11 w-full" disabled={pending} type="submit">
        {pending ? "Memproses..." : "Masuk"}
      </Button>
    </form>
  );
}
