"use client";

import { LocaleProvider } from "./i18n/locale";

export function Providers({ children }: { children: React.ReactNode }) {
  return <LocaleProvider>{children}</LocaleProvider>;
}
