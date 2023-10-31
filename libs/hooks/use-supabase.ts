import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  createClient,
  type SupabaseClient,
  type PostgrestError,
} from "@supabase/supabase-js";
import { useEvent } from "react-use-event-hook";

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
  const [supabaseInstance, setSupabaseInstance] = useState<
    SupabaseClient | undefined
  >();

  const fetchData = useEvent(async () => {
    const supabaseAccessToken = await getToken({ template: "supabase" });

    const supabase = await supabaseClient(supabaseAccessToken as string);
    setSupabaseInstance(supabase);
  });

  useEffect(() => {
    if (isSignedIn) {
      fetchData();
    }
  }, [fetchData, isSignedIn]);

  return supabaseInstance;
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
