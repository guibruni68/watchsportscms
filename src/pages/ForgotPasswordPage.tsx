import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { KeyRound, ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast({
        title: "Email necessário",
        description: "Digite seu email para recuperar a senha.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

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
        setEmail("")
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

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Welcome Section */}
      <div className="hidden lg:flex relative bg-cover bg-center bg-no-repeat flex-col justify-between p-12 text-white" style={{ backgroundImage: "url('/lovable-uploads/Backgroundfnb.png')" }}>
        <div className="absolute inset-0 bg-black/30 -z-10" />
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/178882be-43bc-492f-ab1c-036716604bc1.png" 
            alt="Logo" 
            className="h-12"
          />
        </div>
      </div>

      {/* Right Side - Reset Form */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Back Button */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Button>
          </div>

          {/* Reset Form */}
          <div className="space-y-6">
            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div className="space-y-2 pb-4">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <KeyRound className="h-7 w-7" />
                  Recover Password
                </h2>
                <p className="text-muted-foreground">
                  Enter your email to receive recovery instructions
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@cms.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="h-12"
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-gradient-primary hover:bg-gradient-primary/90 transition-all"
                  disabled={loading || !email}
                >
                  {loading ? "Loading..." : "Submit"}
                </Button>
              </div>
            </form>
          </div>

          {/* Additional Help */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Did not receive the email? Check your spam folder or{" "}
              <button
                onClick={handlePasswordReset}
                disabled={loading || !email}
                className="text-primary hover:underline font-medium"
              >
                try again
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}