import { useState, useEffect, useCallback } from "react";
import { AvatarGender } from "@/lib/avatars";

const AVATAR_KEY = "studyapp-avatar";

interface AvatarState {
  gender: AvatarGender | null;
  chosen: boolean;
  onboardingComplete: boolean;
}

function loadAvatar(): AvatarState {
  try {
    const stored = localStorage.getItem(AVATAR_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { gender: null, chosen: false, onboardingComplete: false };
}

export function useAvatar() {
  const [avatar, setAvatarState] = useState<AvatarState>(loadAvatar);

  useEffect(() => {
    localStorage.setItem(AVATAR_KEY, JSON.stringify(avatar));
  }, [avatar]);

  const chooseAvatar = useCallback((gender: AvatarGender) => {
    setAvatarState((prev) => ({ ...prev, gender, chosen: true }));
  }, []);

  const completeOnboarding = useCallback(() => {
    setAvatarState((prev) => ({ ...prev, onboardingComplete: true }));
  }, []);

  const resetAvatar = useCallback(() => {
    setAvatarState({ gender: null, chosen: false, onboardingComplete: false });
  }, []);

  return { avatar, chooseAvatar, completeOnboarding, resetAvatar };
}
