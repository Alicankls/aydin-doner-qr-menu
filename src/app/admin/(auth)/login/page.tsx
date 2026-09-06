"use client";

import { Suspense, useActionState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { loginAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin/dashboard";
  const [state, formAction, isPending] = useActionState(loginAction, undefined);

  useEffect(() => {
    if (state?.success) {
      router.replace(callbackUrl);
    }
  }, [state?.success, router, callbackUrl]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal p-4 font-sans">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-aydin-red p-8 shadow-md">
        <div className="text-center">
          <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-md border border-black">
            <Image
              src="/uploads/logo/aydin-doner-logo.png"
              alt="Aydın Döner"
              fill
              sizes="80px"
              className="object-contain"
              priority
            />
          </div>
          <p className="mt-3 text-sm text-white/85">
            Menü yönetim panelinize hoş geldiniz.
          </p>
        </div>

        <form action={formAction} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white">
              E-posta
            </label>
            <Input
              type="email"
              name="email"
              placeholder="admin@aydindoner.com"
              required
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">
              Şifre
            </label>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              required
              className="mt-1"
            />
          </div>

          {state?.error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {state.error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-charcoal text-warm-cream hover:bg-warm-cream hover:text-charcoal"
            variant="secondary"
          >
            {isPending ? "Giriş yapılıyor..." : "Giriş Yap"}
          </Button>
        </form>
      </div>
    </div>
  );
}
