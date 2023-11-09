import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import {
  createClient,
  type SupabaseClient,
  type PostgrestError,
} from "@supabase/supabase-js";
import { useEvent } from "react-use-event-hook";

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
  const { supabase, setSupabase } = useSupabaseStore(
    (state) => ({
      supabase: state.supabase,
      setSupabase: state.setSupabase,
    }),
    shallow
  );

  const fetchData = useEvent(async () => {
    const supabaseAccessToken = await getToken({ template: "supabase" });

    const supabase = await supabaseClient(supabaseAccessToken as string);
    setSupabase(supabase);
  });

  useEffect(() => {
    if (isSignedIn && !supabase) {
      fetchData();
    }
  }, [fetchData, isSignedIn, supabase]);

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
