import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import CoursePage from "./pages/CoursePage.tsx";
import ModulePage from "./pages/ModulePage.tsx";
import LessonPage from "./pages/LessonPage.tsx";
import ProgressPage from "./pages/ProgressPage.tsx";
import AchievementsPage from "./pages/AchievementsPage.tsx";
import ExamModePage from "./pages/ExamModePage.tsx";
import ReviewPage from "./pages/ReviewPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import AIImportPage from "./pages/AIImportPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/course/:courseId" element={<CoursePage />} />
          <Route path="/course/:courseId/module/:moduleId" element={<ModulePage />} />
          <Route path="/course/:courseId/module/:moduleId/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/course/:courseId/exam" element={<ExamModePage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/ai-import" element={<AIImportPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
