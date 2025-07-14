import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import Index from "./pages/dashboard/Index";
import VideosPage from "./pages/videos/VideosPage";
import LivesPage from "./pages/lives/LivesPage";
import TeamsPage from "./pages/teams/TeamsPage";
import TeamDetailsPage from "./pages/teams/TeamDetailsPage";
import ChampionshipDetailsPage from "./pages/championships/ChampionshipDetailsPage";
import SchedulePage from "./pages/schedule/SchedulePage";
import NewsPage from "./pages/news/NewsPage";
import CarouselsPage from "./pages/carousels/CarouselsPage";
import CustomizationPage from "./pages/customization/CustomizationPage";
import AdsPage from "./pages/ads/AdsPage";
import AnalyticsPage from "./pages/analytics/AnalyticsPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="dark">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <DashboardLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/videos" element={<VideosPage />} />
              <Route path="/lives" element={<LivesPage />} />
              <Route path="/teams" element={<TeamsPage />} />
              <Route path="/teams/:id" element={<TeamDetailsPage />} />
              <Route path="/championships/:id" element={<ChampionshipDetailsPage />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/carousels" element={<CarouselsPage />} />
              <Route path="/customization" element={<CustomizationPage />} />
              <Route path="/ads" element={<AdsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/auth" element={<AuthPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DashboardLayout>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
