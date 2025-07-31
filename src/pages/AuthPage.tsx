import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useGuestMode } from "@/hooks/useGuestMode"
import { Eye, EyeOff, UserPlus, Users, KeyRound } from "lucide-react"

export default function AuthPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
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

  const cleanupAuthState = () => {
    // Remove standard auth tokens
    localStorage.removeItem('supabase.auth.token');
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    // Remove from sessionStorage if in use
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Clean up existing state
      cleanupAuthState();
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }

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
        // Force page reload for clean state
        if (rememberMe) {
          window.location.href = '/';
        } else {
          // For non-persistent sessions, just navigate
          navigate('/');
        }
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

  const handlePasswordReset = async () => {
    if (!email) {
      toast({
        title: "Email necessário",
        description: "Digite seu email para recuperar a senha.",
        variant: "destructive",
      })
      return
    }

    setResetLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      })

      if (error) {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Email enviado!",
          description: "Verifique sua caixa de entrada para redefinir sua senha.",
        })
      }
    } catch (error: any) {
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setResetLoading(false)
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
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-6">

          {/* Auth Forms - Sem Card */}
          <div className="space-y-6">
            <Tabs defaultValue="signin" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Cadastrar</TabsTrigger>
              </TabsList>

              {/* Sign In Tab */}
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2 pb-4">
                    <h2 className="text-2xl font-semibold">
                      Entrar na sua conta
                    </h2>
                    <p className="text-muted-foreground">
                      Digite seus dados para prosseguir
                    </p>
                  </div>

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
                        className="h-12"
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
                          className="h-12"
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

                    <div className="text-center">
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => navigate('/forgot-password')}
                        className="text-sm text-primary hover:underline p-0 h-auto"
                      >
                        Esqueceu sua senha?
                      </Button>
                    </div>
                  </div>
                </form>
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2 pb-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-2">
                      <UserPlus className="h-5 w-5" />
                      Criar Conta
                    </h2>
                    <p className="text-muted-foreground">
                      Cadastre-se para começar a usar o sistema
                    </p>
                  </div>

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
                        className="h-12"
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
                        className="h-12"
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
                          className="h-12"
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
          </div>

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