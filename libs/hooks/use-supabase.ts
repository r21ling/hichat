import { useEffect, useState, useMemo } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import {
  createClient,
  type SupabaseClient,
  type PostgrestError,
} from "@supabase/supabase-js";
import { useEvent } from "react-use-event-hook";
import { useQuery } from "@tanstack/react-query";

export const useSupabaseStore = createWithEqualityFn<{
  supabase: SupabaseClient | undefined;
  setSupabase: (supabase: SupabaseClient) => void;
}>(
  (set) => ({
    supabase: undefined,
    setSupabase: (supabase) => set({ supabase }),
  }),
  Object.is
);

const supabaseClient = (supabaseAccessToken: string) =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY,
    {
      global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } },
    }
  );

export function useSupabase() {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const { supabase, setSupabase } = useSupabaseStore(
    (state) => ({
      supabase: state.supabase,
      setSupabase: state.setSupabase,
    }),
    shallow
  );
  const isInitialized = useMemo(
    () => isSignedIn && !supabase,
    [isSignedIn, supabase]
  );

  const fetchData = useEvent(async () => {
    const supabaseAccessToken = await getToken({ template: "supabase" });

    const supabase = await supabaseClient(supabaseAccessToken as string);
    setSupabase(supabase);

    supabase
      .from("users")
      .upsert({
        user_id: user?.id,
        name: user?.username ?? user?.fullName,
        first_name: user?.firstName,
        last_name: user?.lastName,
        image_url: user?.imageUrl,
        email: user?.primaryEmailAddress?.emailAddress,
        update_at: new Date(),
      })
      .then(() => console.log("user", user));
  });

  useQuery({
    enabled: isInitialized,
    queryKey: ["initializeSupabase"],
    queryFn: fetchData,
  });

  return supabase;
}

type Result<T> = {
  data: T | null;
  error: PostgrestError | null;
};

export function useSuapbaseWithCallback<T>(
  callback?: (s: SupabaseClient) => any
) {
  const supabase = useSupabase();
  const [result, setResult] = useState<Result<T>>({
    data: null,
    error: null,
  });

  const fn = useEvent(async () => {
    if (supabase && callback) {
      await callback(supabase).then((res: Result<T>) => setResult(res));
    }
  });

  useEffect(() => {
    if (supabase) {
      fn();
    }
  }, [fn, supabase]);

  return result;
}
