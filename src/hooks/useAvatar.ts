import { useState, useEffect, useCallback } from "react";
import { AvatarGender } from "@/lib/avatars";

const AVATAR_KEY = "studyapp-avatar";

interface AvatarState {
  gender: AvatarGender | null;
  chosen: boolean;
}

function loadAvatar(): AvatarState {
  try {
    const stored = localStorage.getItem(AVATAR_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { gender: null, chosen: false };
}

export function useAvatar() {
  const [avatar, setAvatarState] = useState<AvatarState>(loadAvatar);

  useEffect(() => {
    localStorage.setItem(AVATAR_KEY, JSON.stringify(avatar));
  }, [avatar]);

  const chooseAvatar = useCallback((gender: AvatarGender) => {
    setAvatarState({ gender, chosen: true });
  }, []);

  const resetAvatar = useCallback(() => {
    setAvatarState({ gender: null, chosen: false });
  }, []);

  return { avatar, chooseAvatar, resetAvatar };
}
