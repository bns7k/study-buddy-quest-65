import { useState, useEffect, useCallback } from "react";

export interface AppSettings {
  language: "en" | "hu";
  darkMode: boolean;
  notifications: boolean;
  examDate: string; // ISO date string
  preferredStudyTime: "morning" | "afternoon" | "evening" | "night";
  dailyGoalXp: number;
}

const SETTINGS_KEY = "studyapp-settings";

const defaultSettings: AppSettings = {
  language: "en",
  darkMode: false,
  notifications: true,
  examDate: "",
  preferredStudyTime: "morning",
  dailyGoalXp: 50,
};

function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) return { ...defaultSettings, ...JSON.parse(stored) };
  } catch {}
  return defaultSettings;
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  // Apply dark mode
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.darkMode]);

  const updateSetting = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  return { settings, updateSetting, resetSettings };
}
