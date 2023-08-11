"use client";

import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";

export default function Page({
  params,
}: {
  params: {
    platform: string;
  };
}) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "loading" && !session) {
      signIn(params?.platform);
    }

    if (session) {
      window.close();
    }
  }, [params?.platform, session, status]);

  return <div className="w-screen h-screen" />;
}
