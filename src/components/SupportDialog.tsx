import { Heart } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface SupportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SupportDialog({ open, onOpenChange }: SupportDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm rounded-2xl">
        <AlertDialogHeader className="items-center text-center">
          <span className="mx-auto text-4xl">☕</span>
          <AlertDialogTitle className="text-xl font-black">Support the project</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2 text-left text-sm leading-relaxed">
            <span className="block">
              Hi! I'm Benjamin, a finance master's student who got tired of learning from old, non-interactive slides.
            </span>
            <span className="block">So I started building a better way to study finance.</span>
            <span className="block">
              The app is free and built in my spare time. If you find it useful, you can support the project with a coffee ☕
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
          <AlertDialogAction asChild>
            <a
              href="https://buymeacoffee.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground transition-transform hover:scale-[1.02]"
            >
              ☕ Buy me a coffee
            </a>
          </AlertDialogAction>
          <AlertDialogCancel className="mt-0 w-full rounded-xl">Maybe later</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const SUPPORT_STORAGE_KEY = "studyapp-support-shown";

/** Returns true if it's time to show the support prompt (every ~10 completions) */
export function shouldShowSupportPrompt(): boolean {
  const stored = localStorage.getItem(SUPPORT_STORAGE_KEY);
  const count = stored ? parseInt(stored, 10) : 0;
  const next = count + 1;
  localStorage.setItem(SUPPORT_STORAGE_KEY, String(next));
  // Show on 5th, 15th, 30th, 50th... completions (rare, increasing gaps)
  return [5, 15, 30, 50, 80, 120].includes(next);
}
