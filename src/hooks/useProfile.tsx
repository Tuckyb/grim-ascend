import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useProfile(userId: string | null) {
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setDisplayName(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from("profiles")
      .select("display_name")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => {
        setDisplayName(data?.display_name ?? null);
        setLoading(false);
      });
  }, [userId]);

  const saveName = useCallback(async (name: string) => {
    if (!userId) return;
    const trimmed = name.trim();
    setDisplayName(trimmed || null);
    await supabase
      .from("profiles")
      .upsert({ user_id: userId, display_name: trimmed || null }, { onConflict: "user_id" });
  }, [userId]);

  return { displayName, loading, saveName };
}
