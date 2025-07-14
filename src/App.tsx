import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ProtectedRoute } from "@/components/ProtectedRoute";
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
import CampaignsPage from "./pages/campaigns/CampaignsPage";
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
          <Routes>
            {/* Public route for authentication */}
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/videos" element={
              <ProtectedRoute>
                <VideosPage />
              </ProtectedRoute>
            } />
            <Route path="/lives" element={
              <ProtectedRoute>
                <LivesPage />
              </ProtectedRoute>
            } />
            <Route path="/teams" element={
              <ProtectedRoute>
                <TeamsPage />
              </ProtectedRoute>
            } />
            <Route path="/teams/:id" element={
              <ProtectedRoute>
                <TeamDetailsPage />
              </ProtectedRoute>
            } />
            <Route path="/championships/:id" element={
              <ProtectedRoute>
                <ChampionshipDetailsPage />
              </ProtectedRoute>
            } />
            <Route path="/schedule" element={
              <ProtectedRoute>
                <SchedulePage />
              </ProtectedRoute>
            } />
            <Route path="/news" element={
              <ProtectedRoute>
                <NewsPage />
              </ProtectedRoute>
            } />
            <Route path="/carousels" element={
              <ProtectedRoute>
                <CarouselsPage />
              </ProtectedRoute>
            } />
            <Route path="/customization" element={
              <ProtectedRoute>
                <CustomizationPage />
              </ProtectedRoute>
            } />
            <Route path="/ads" element={
              <ProtectedRoute>
                <AdsPage />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            } />
            <Route path="/campaigns" element={
              <ProtectedRoute>
                <CampaignsPage />
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
