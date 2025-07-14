import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Upload, Bold, Italic, List, Link } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

const newsSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  conteudo: z.string().min(1, "Conteúdo é obrigatório"),
  destaque: z.boolean(),
  imagemCapa: z.string().optional(),
})

type NewsFormData = z.infer<typeof newsSchema>

interface NewsFormProps {
  initialData?: Partial<NewsFormData>
  isEdit?: boolean
}

export function NewsForm({ initialData, isEdit = false }: NewsFormProps) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [editorContent, setEditorContent] = useState(initialData?.conteudo || "")

  const form = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      titulo: initialData?.titulo || "",
      conteudo: initialData?.conteudo || "",
      destaque: initialData?.destaque || false,
      imagemCapa: initialData?.imagemCapa || "",
    },
  })

  const onSubmit = (data: NewsFormData) => {
    const finalData = { ...data, conteudo: editorContent }
    console.log("Salvando notícia:", finalData)
    
    toast({
      title: isEdit ? "Notícia atualizada!" : "Notícia criada!",
      description: `${data.titulo} foi ${isEdit ? "atualizada" : "criada"} com sucesso.`,
    })
    
    navigate("/news")
  }

  const formatText = (command: string) => {
    document.execCommand(command, false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/news")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Notícias
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Editar Notícia" : "Nova Notícia"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Clube anuncia nova contratação para 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imagemCapa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagem de Capa</FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-1">
                          Clique para fazer upload da imagem de capa
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Formatos aceitos: JPG, PNG (máx. 2MB)
                        </p>
                        <Input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => field.onChange(e.target.files?.[0]?.name || "")}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="conteudo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conteúdo *</FormLabel>
                    <FormControl>
                      <div className="border rounded-lg overflow-hidden">
                        {/* Toolbar simples do WYSIWYG */}
                        <div className="border-b bg-muted/20 p-2 flex gap-1">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => formatText("bold")}
                          >
                            <Bold className="h-4 w-4" />
                          </Button>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => formatText("italic")}
                          >
                            <Italic className="h-4 w-4" />
                          </Button>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => formatText("insertUnorderedList")}
                          >
                            <List className="h-4 w-4" />
                          </Button>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => formatText("createLink")}
                          >
                            <Link className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {/* Editor de conteúdo */}
                        <div
                          contentEditable
                          className="min-h-48 p-4 outline-none prose prose-sm max-w-none"
                          style={{ minHeight: "200px" }}
                          onInput={(e) => {
                            const content = e.currentTarget.innerHTML
                            setEditorContent(content)
                            field.onChange(content)
                          }}
                          dangerouslySetInnerHTML={{ __html: editorContent }}
                          suppressContentEditableWarning={true}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="destaque"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Destaque
                      </FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Marque para exibir esta notícia como destaque na página principal
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-6">
                <Button type="submit" className="flex-1">
                  {isEdit ? "Atualizar Notícia" : "Publicar Notícia"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/news")}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}