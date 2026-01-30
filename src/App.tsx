import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/dashboard/Index";
import VideosPage from "./pages/videos/VideosPage";
import VideoDetailsPage from "./pages/videos/VideoDetailsPage";
import EditVideoPage from "./pages/videos/EditVideoPage";
import LivesPage from "./pages/lives/LivesPage";
import LiveDetailsPage from "./pages/lives/LiveDetailsPage";
import EditLivePage from "./pages/lives/EditLivePage";
import AgentsPage from "./pages/agents/AgentsPage";
import GroupsPage from "./pages/groups/GroupsPage";
import GroupDetailsPage from "./pages/groups/GroupDetailsPage";
import AgentDetailsPage from "./pages/agents/AgentDetailsPage";
import ChampionshipDetailsPage from "./pages/championships/ChampionshipDetailsPage";
import SchedulePage from "./pages/schedule/SchedulePage";
import EventDetailPage from "./pages/schedule/EventDetailPage";
import NewsPage from "./pages/news/NewsPage";
import NewsDetailPage from "./pages/news/NewsDetailPage";
import ShelvesPage from "./pages/shelves/ShelvesPage";
import NewShelfPage from "./pages/shelves/NewShelfPage";
import EditShelfPage from "./pages/shelves/EditShelfPage";
import PagesPage from "./pages/pages/PagesPage";
import EditPagePage from "./pages/pages/EditPagePage";
import BannersPage from "./pages/banners/BannersPage";
import BannerDetailsPage from "./pages/banners/BannerDetailsPage";
import NewBannerPage from "./pages/banners/NewBannerPage";
import EditBannerPage from "./pages/banners/EditBannerPage";
import CustomizationPage from "./pages/customization/CustomizationPage";
import AdsPage from "./pages/ads/AdsPage";
import AnalyticsPage from "./pages/analytics/AnalyticsPage";
import CollectionsPage from "./pages/collections/CollectionsPage";
import CollectionForm from "./components/forms/CollectionForm";
import EditCollectionPage from "./pages/collections/EditCollectionPage";
import CollectionDetailsPage from "./pages/collections/CollectionDetailsPage";
import AuthPage from "./pages/AuthPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
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
            {/* Public routes for authentication */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            
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
            <Route path="/videos/:id" element={
              <ProtectedRoute>
                <VideoDetailsPage />
              </ProtectedRoute>
            } />
            <Route path="/videos/edit/:id" element={
              <ProtectedRoute>
                <EditVideoPage />
              </ProtectedRoute>
            } />
            <Route path="/lives" element={
              <ProtectedRoute>
                <LivesPage />
              </ProtectedRoute>
            } />
            <Route path="/lives/:id" element={
              <ProtectedRoute>
                <LiveDetailsPage />
              </ProtectedRoute>
            } />
            <Route path="/lives/edit/:id" element={
              <ProtectedRoute>
                <EditLivePage />
              </ProtectedRoute>
            } />
            <Route path="/players" element={
              <ProtectedRoute>
                <AgentsPage agentType="player" />
              </ProtectedRoute>
            } />
            <Route path="/players/:id" element={
              <ProtectedRoute>
                <AgentDetailsPage agentType="player" />
              </ProtectedRoute>
            } />
            <Route path="/coaches" element={
              <ProtectedRoute>
                <AgentsPage agentType="coach" />
              </ProtectedRoute>
            } />
            <Route path="/coaches/:id" element={
              <ProtectedRoute>
                <AgentDetailsPage agentType="coach" />
              </ProtectedRoute>
            } />
            <Route path="/agents" element={
              <ProtectedRoute>
                <AgentsPage />
              </ProtectedRoute>
            } />
            <Route path="/agents/:id" element={
              <ProtectedRoute>
                <AgentDetailsPage />
              </ProtectedRoute>
            } />
            <Route path="/groups" element={
              <ProtectedRoute>
                <GroupsPage />
              </ProtectedRoute>
            } />
            <Route path="/groups/:id" element={
              <ProtectedRoute>
                <GroupDetailsPage />
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
            <Route path="/schedule/:id" element={
              <ProtectedRoute>
                <EventDetailPage />
              </ProtectedRoute>
            } />
            <Route path="/news" element={
              <ProtectedRoute>
                <NewsPage />
              </ProtectedRoute>
            } />
            <Route path="/news/:id" element={
              <ProtectedRoute>
                <NewsDetailPage />
              </ProtectedRoute>
            } />
            <Route path="/shelves" element={
              <ProtectedRoute>
                <ShelvesPage />
              </ProtectedRoute>
            } />
            <Route path="/shelves/new" element={
              <ProtectedRoute>
                <NewShelfPage />
              </ProtectedRoute>
            } />
            <Route path="/shelves/:id/edit" element={
              <ProtectedRoute>
                <EditShelfPage />
              </ProtectedRoute>
            } />
            <Route path="/pages" element={
              <ProtectedRoute>
                <PagesPage />
              </ProtectedRoute>
            } />
            <Route path="/pages/:id/edit" element={
              <ProtectedRoute>
                <EditPagePage />
              </ProtectedRoute>
            } />
            <Route path="/banners" element={
              <ProtectedRoute>
                <BannersPage />
              </ProtectedRoute>
            } />
            <Route path="/banners/novo" element={
              <ProtectedRoute>
                <NewBannerPage />
              </ProtectedRoute>
            } />
            <Route path="/banners/:id" element={
              <ProtectedRoute>
                <BannerDetailsPage />
              </ProtectedRoute>
            } />
            <Route path="/banners/:id/editar" element={
              <ProtectedRoute>
                <EditBannerPage />
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
            <Route path="/collections" element={
              <ProtectedRoute>
                <CollectionsPage />
              </ProtectedRoute>
            } />
            <Route path="/collections/novo" element={
              <ProtectedRoute>
                <CollectionForm />
              </ProtectedRoute>
            } />
            <Route path="/collections/:id" element={
              <ProtectedRoute>
                <CollectionDetailsPage />
              </ProtectedRoute>
            } />
            <Route path="/collections/edit/:id" element={
              <ProtectedRoute>
                <EditCollectionPage />
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
