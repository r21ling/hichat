"use client";

import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }: React.PropsWithChildren) {
  return <SessionProvider>{children}</SessionProvider>;
}
