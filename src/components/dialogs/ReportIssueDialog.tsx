import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

const schema = z.object({
  transmissaoId: z.string().min(1, "Selecione a transmissão"),
  tipoProblem: z.string().min(1, "Selecione o tipo de problema"),
  descricao: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  prioridade: z.string().min(1, "Selecione a prioridade"),
})

type FormValues = z.infer<typeof schema>

const MOCK_LIVES = [
  { id: "1", name: "State Championship Final" },
  { id: "2", name: "2024 Squad Presentation" },
  { id: "3", name: "Preparatory Practice Match" },
  { id: "4", name: "Coach Interview" },
  { id: "5", name: "Open Training for Fans" },
]

const PROBLEM_TYPES = [
  { value: "stream_offline", label: "Stream Offline" },
  { value: "audio", label: "Problema de Áudio" },
  { value: "video_quality", label: "Qualidade de Vídeo" },
  { value: "delay", label: "Delay / Latência" },
  { value: "other", label: "Outro" },
]

const PRIORITIES = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Média" },
  { value: "high", label: "Alta" },
  { value: "critical", label: "Crítica" },
]

interface ReportIssueDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  liveTitle?: string
  liveId?: string
}

export function ReportIssueDialog({ open, onOpenChange, liveTitle, liveId }: ReportIssueDialogProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      transmissaoId: "",
      tipoProblem: "",
      descricao: "",
      prioridade: "",
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        transmissaoId: liveId || "",
        tipoProblem: "",
        descricao: "",
        prioridade: "",
      })
    }
  }, [open, liveId, form])

  const onSubmit = async (_data: FormValues) => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    setLoading(false)
    toast({
      title: "Chamado aberto com sucesso!",
      description: "Nossa equipe foi notificada e irá investigar o problema.",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Reportar Problema
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Transmissão */}
            <FormField
              control={form.control}
              name="transmissaoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transmissão</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!!liveId}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a transmissão" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MOCK_LIVES.map(live => (
                        <SelectItem key={live.id} value={live.id}>
                          {live.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tipo de Problema */}
            <FormField
              control={form.control}
              name="tipoProblem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Problema</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de problema" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PROBLEM_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Descrição */}
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o problema em detalhes..."
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Prioridade */}
            <FormField
              control={form.control}
              name="prioridade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioridade</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PRIORITIES.map(p => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Abrindo..." : "Abrir Chamado"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
