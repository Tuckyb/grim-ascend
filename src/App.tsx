import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import BoardPage from "./pages/BoardPage";
import DailyPlanPage from "./pages/DailyPlanPage";
import GoalsPage from "./pages/GoalsPage";
import InitiativesPage from "./pages/InitiativesPage";
import ImportPage from "./pages/ImportPage";
import ChatPage from "./pages/ChatPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/daily" element={<DailyPlanPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/initiatives" element={<InitiativesPage />} />
          <Route path="/import" element={<ImportPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
