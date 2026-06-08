"use client";

import Link from "next/link";
import { useTranslations } from "@/components/providers/language-provider";
import { buttonVariants } from "@/components/ui/button";

export function NotFoundView() {
  const t = useTranslations();
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="font-mono text-5xl font-bold text-accent">404</p>
      <h1 className="text-2xl font-semibold text-foreground">
        {t.notFound.title}
      </h1>
      <p className="max-w-sm text-muted">{t.notFound.body}</p>
      <Link href="/" className={buttonVariants({ variant: "primary" })}>
        {t.notFound.back}
      </Link>
    </div>
  );
}
