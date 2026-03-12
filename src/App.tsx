import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/dashboard/Index";
import VideosPage from "./pages/videos/VideosPage";
import VideoDetailsPage from "./pages/videos/VideoDetailsPage";
import EditVideoPage from "./pages/videos/EditVideoPage";
import LivesPage from "./pages/lives/LivesPage";
import LiveDetailsPage from "./pages/lives/LiveDetailsPage";
import EditLivePage from "./pages/lives/EditLivePage";
import MatchControlPage from "./pages/lives/MatchControlPage";
import AgentsPage from "./pages/agents/AgentsPage";
import TeamsPage from "./pages/teams/TeamsPage";
import TeamDetailsPage from "./pages/teams/TeamDetailsPage";
import CompetitionsPage from "./pages/competitions/CompetitionsPage";
import CompetitionDetailsPage from "./pages/competitions/CompetitionDetailsPage";
import SeasonDetailsPage from "./pages/competitions/SeasonDetailsPage";
import SeasonsPage from "./pages/seasons/SeasonsPage";
import AgentDetailsPage from "./pages/agents/AgentDetailsPage";
import PlayersPage from "./pages/players/PlayersPage";
import PlayerDetailsPage from "./pages/players/PlayerDetailsPage";
import CoachesPage from "./pages/coaches/CoachesPage";
import CoachDetailsPage from "./pages/coaches/CoachDetailsPage";
import RefereesPage from "./pages/referees/RefereesPage";
import StadiumsPage from "./pages/stadiums/StadiumsPage";
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
import AdsPage from "./pages/ads/AdsPage";
import CollectionsPage from "./pages/collections/CollectionsPage";
import CollectionForm from "./components/forms/CollectionForm";
import EditCollectionPage from "./pages/collections/EditCollectionPage";
import CollectionDetailsPage from "./pages/collections/CollectionDetailsPage";
import AuthPage from "./pages/AuthPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import NotFound from "./pages/NotFound";
import HelpPage from "./pages/help/HelpPage";

const router = createBrowserRouter([
  { path: "/auth", element: <AuthPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/", element: <ProtectedRoute><Index /></ProtectedRoute> },
  { path: "/videos", element: <ProtectedRoute><VideosPage /></ProtectedRoute> },
  { path: "/videos/:id", element: <ProtectedRoute><VideoDetailsPage /></ProtectedRoute> },
  { path: "/videos/edit/:id", element: <ProtectedRoute><EditVideoPage /></ProtectedRoute> },
  { path: "/lives", element: <ProtectedRoute><LivesPage /></ProtectedRoute> },
  { path: "/lives/:id", element: <ProtectedRoute><LiveDetailsPage /></ProtectedRoute> },
  { path: "/lives/edit/:id", element: <ProtectedRoute><EditLivePage /></ProtectedRoute> },
  { path: "/lives/:id/match-control", element: <ProtectedRoute><MatchControlPage /></ProtectedRoute> },
  { path: "/seasons/:seasonId/games/:gameId/match-control", element: <ProtectedRoute><MatchControlPage /></ProtectedRoute> },
  { path: "/players", element: <ProtectedRoute><PlayersPage /></ProtectedRoute> },
  { path: "/players/:id", element: <ProtectedRoute><PlayerDetailsPage /></ProtectedRoute> },
  { path: "/coaches", element: <ProtectedRoute><CoachesPage /></ProtectedRoute> },
  { path: "/coaches/:id", element: <ProtectedRoute><CoachDetailsPage /></ProtectedRoute> },
  { path: "/referees", element: <ProtectedRoute><RefereesPage /></ProtectedRoute> },
  { path: "/stadiums", element: <ProtectedRoute><StadiumsPage /></ProtectedRoute> },
  { path: "/agents", element: <ProtectedRoute><AgentsPage /></ProtectedRoute> },
  { path: "/agents/:id", element: <ProtectedRoute><AgentDetailsPage /></ProtectedRoute> },
  { path: "/teams", element: <ProtectedRoute><TeamsPage /></ProtectedRoute> },
  { path: "/teams/:id", element: <ProtectedRoute><TeamDetailsPage /></ProtectedRoute> },
  { path: "/competitions", element: <ProtectedRoute><CompetitionsPage /></ProtectedRoute> },
  { path: "/competitions/:id", element: <ProtectedRoute><CompetitionDetailsPage /></ProtectedRoute> },
  { path: "/competitions/:competitionId/seasons/:seasonId", element: <ProtectedRoute><SeasonDetailsPage /></ProtectedRoute> },
  { path: "/seasons", element: <ProtectedRoute><SeasonsPage /></ProtectedRoute> },
  { path: "/seasons/:id", element: <ProtectedRoute><SeasonDetailsPage /></ProtectedRoute> },
  { path: "/championships/:id", element: <ProtectedRoute><ChampionshipDetailsPage /></ProtectedRoute> },
  { path: "/schedule", element: <ProtectedRoute><SchedulePage /></ProtectedRoute> },
  { path: "/schedule/:id", element: <ProtectedRoute><EventDetailPage /></ProtectedRoute> },
  { path: "/news", element: <ProtectedRoute><NewsPage /></ProtectedRoute> },
  { path: "/news/:id", element: <ProtectedRoute><NewsDetailPage /></ProtectedRoute> },
  { path: "/shelves", element: <ProtectedRoute><ShelvesPage /></ProtectedRoute> },
  { path: "/shelves/new", element: <ProtectedRoute><NewShelfPage /></ProtectedRoute> },
  { path: "/shelves/:id/edit", element: <ProtectedRoute><EditShelfPage /></ProtectedRoute> },
  { path: "/pages", element: <ProtectedRoute><PagesPage /></ProtectedRoute> },
  { path: "/pages/:id/edit", element: <ProtectedRoute><EditPagePage /></ProtectedRoute> },
  { path: "/banners", element: <ProtectedRoute><BannersPage /></ProtectedRoute> },
  { path: "/banners/novo", element: <ProtectedRoute><NewBannerPage /></ProtectedRoute> },
  { path: "/banners/:id", element: <ProtectedRoute><BannerDetailsPage /></ProtectedRoute> },
  { path: "/banners/:id/editar", element: <ProtectedRoute><EditBannerPage /></ProtectedRoute> },
  { path: "/ads", element: <ProtectedRoute><AdsPage /></ProtectedRoute> },
  { path: "/collections", element: <ProtectedRoute><CollectionsPage /></ProtectedRoute> },
  { path: "/collections/novo", element: <ProtectedRoute><CollectionForm /></ProtectedRoute> },
  { path: "/collections/:id", element: <ProtectedRoute><CollectionDetailsPage /></ProtectedRoute> },
  { path: "/collections/edit/:id", element: <ProtectedRoute><EditCollectionPage /></ProtectedRoute> },
  { path: "/help", element: <ProtectedRoute><HelpPage /></ProtectedRoute> },
  { path: "*", element: <NotFound /> },
]);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="dark">
        <Toaster />
        <Sonner />
        <RouterProvider router={router} />
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
