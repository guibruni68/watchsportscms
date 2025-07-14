import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useGuestMode } from "@/hooks/useGuestMode"
import { Eye, EyeOff, LogIn, UserPlus, Users } from "lucide-react"

export default function AuthPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { enableGuestMode } = useGuestMode()
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        navigate("/")
      }
    }
    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          navigate("/")
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [navigate])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Erro de autenticação",
            description: "Email ou senha incorretos. Verifique suas credenciais.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Erro",
            description: error.message,
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Login realizado com sucesso!",
          description: "Você será redirecionado em instantes.",
        })
      }
    } catch (error: any) {
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
          }
        }
      })

      if (error) {
        if (error.message.includes("User already registered")) {
          toast({
            title: "Usuário já existe",
            description: "Este email já está cadastrado. Tente fazer login.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Erro",
            description: error.message,
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Cadastro realizado!",
          description: "Verifique seu email para confirmar a conta.",
        })
        // Clear form
        setEmail("")
        setPassword("")
        setFullName("")
      }
    } catch (error: any) {
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGuestAccess = () => {
    enableGuestMode()
    navigate("/")
    toast({
      title: "Modo visitante ativado",
      description: "Você está navegando como visitante.",
    })
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Welcome Section */}
      <div className="hidden lg:flex bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex-col justify-between p-12 text-white">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/178882be-43bc-492f-ab1c-036716604bc1.png" 
            alt="Logo" 
            className="h-12"
          />
        </div>
        
        <div className="space-y-6">
          <h1 className="text-5xl font-bold leading-tight">
            Bem-vindo ao nosso
            <br />
            sistema de gestão
            <br />
            esportiva
          </h1>
          <p className="text-xl text-white/80">
            Gerencie times, campeonatos e muito mais
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-white/60">Não tem uma conta?</span>
          <Button 
            variant="secondary"
            className="bg-white text-primary hover:bg-white/90"
            onClick={() => {/* handled by tabs */}}
          >
            Cadastre-se
          </Button>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <img 
              src="/lovable-uploads/178882be-43bc-492f-ab1c-036716604bc1.png" 
              alt="Logo" 
              className="h-16 mx-auto mb-8"
            />
          </div>

          {/* Auth Card */}
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <Tabs defaultValue="signin" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Entrar</TabsTrigger>
                  <TabsTrigger value="signup">Cadastrar</TabsTrigger>
                </TabsList>

                {/* Sign In Tab */}
                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <CardHeader className="px-0 pb-2">
                      <CardTitle className="text-2xl">
                        Entrar na sua conta
                      </CardTitle>
                      <CardDescription>
                        Digite seus dados para prosseguir
                      </CardDescription>
                    </CardHeader>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Sua senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={loading}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-primary hover:bg-gradient-primary/90 transition-all"
                        disabled={loading}
                      >
                        {loading ? "Entrando..." : "Entrar"}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                {/* Sign Up Tab */}
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <CardHeader className="px-0 pb-2">
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        <UserPlus className="h-5 w-5" />
                        Criar Conta
                      </CardTitle>
                      <CardDescription>
                        Cadastre-se para começar a usar o sistema
                      </CardDescription>
                    </CardHeader>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Nome Completo</Label>
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="Seu nome completo"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          disabled={loading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signupEmail">Email</Label>
                        <Input
                          id="signupEmail"
                          type="email"
                          placeholder="seu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signupPassword">Senha</Label>
                        <div className="relative">
                          <Input
                            id="signupPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Mínimo 6 caracteres"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            disabled={loading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={loading}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-primary hover:bg-gradient-primary/90 transition-all"
                        disabled={loading}
                      >
                        {loading ? "Cadastrando..." : "Criar Conta"}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Guest Access Button */}
          <Button 
            onClick={handleGuestAccess}
            variant="outline" 
            className="w-full border-primary/20 hover:bg-primary/10 transition-all"
          >
            <Users className="h-4 w-4 mr-2" />
            Entrar como Visitante
          </Button>
        </div>
      </div>
    </div>
  )
}