import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { LogIn, Users, Video, Calendar, Trophy } from "lucide-react"

const Index = () => {
  const { user, signOut, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Watch Sports CMS
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Sistema completo de gestão esportiva
          </p>
          
          {!user ? (
            <div className="flex justify-center gap-4">
              <Link to="/auth">
                <Button className="bg-gradient-primary transition-all">
                  <LogIn className="h-4 w-4 mr-2" />
                  Entrar / Cadastrar
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex justify-center items-center gap-4">
              <p className="text-foreground">
                Bem-vindo, <span className="font-semibold">{user.email}</span>!
              </p>
              <Button variant="outline" onClick={signOut}>
                Sair
              </Button>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link to="/groups">
            <Card className="bg-gradient-card border-border/50 transition-all duration-300 cursor-pointer">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Groups</h3>
                <p className="text-muted-foreground text-sm">Gerencie seus times</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/videos">
            <Card className="bg-gradient-card border-border/50 transition-all duration-300 cursor-pointer">
              <CardContent className="p-6 text-center">
                <Video className="h-12 w-12 text-secondary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Vídeos</h3>
                <p className="text-muted-foreground text-sm">Biblioteca de vídeos e conteúdo</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/schedule">
            <Card className="bg-gradient-card border-border/50 transition-all duration-300 cursor-pointer">
              <CardContent className="p-6 text-center">
                <Calendar className="h-12 w-12 text-warning mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Agenda</h3>
                <p className="text-muted-foreground text-sm">Calendário de jogos e eventos</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/championships">
            <Card className="bg-gradient-card border-border/50 transition-all duration-300 cursor-pointer">
              <CardContent className="p-6 text-center">
                <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Campeonatos</h3>
                <p className="text-muted-foreground text-sm">Gestão de torneios e competições</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center text-muted-foreground">
          <p>© 2024 Watch Sports CMS. Sistema completo para gestão esportiva.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
