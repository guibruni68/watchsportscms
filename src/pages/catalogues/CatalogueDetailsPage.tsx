import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Edit, Tag, Calendar, FileText } from "lucide-react";
import { getCatalogueById } from "@/data/mockCatalogues";
import { toast } from "@/hooks/use-toast";

interface Catalogue {
  id: string;
  titulo: string;
  descricao?: string;
  tipo_catalogo: string;
  status: boolean;
  ordem_exibicao: number;
  created_at: string;
  updated_at: string;
}

interface CatalogueContent {
  id: string;
  titulo: string;
  tipo_conteudo: string;
  status: boolean;
  created_at: string;
}

const tipoLabels = {
  serie: "Série",
  colecao: "Coleção",
  playlist: "Playlist",
  outro: "Outro"
};

export default function CatalogueDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [catalogue, setCatalogue] = useState<Catalogue | null>(null);
  const [contents, setContents] = useState<CatalogueContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const catalogueData = getCatalogueById(id);
        
        if (!catalogueData) {
          throw new Error("Catalogue not found");
        }
        
        setCatalogue(catalogueData);

        // Mock content data
        setContents([
          {
            id: "1",
            titulo: "Final do Campeonato 2024",
            tipo_conteudo: "live",
            status: true,
            created_at: new Date().toISOString()
          },
          {
            id: "2",
            titulo: "Melhores Momentos - Semifinal",
            tipo_conteudo: "vod",
            status: true,
            created_at: new Date().toISOString()
          }
        ]);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao carregar dados do catálogo.",
          variant: "destructive",
        });
        navigate('/catalogues');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleEdit = () => {
    navigate(`/catalogues/edit/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando catálogo...</p>
        </div>
      </div>
    );
  }

  if (!catalogue) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Catálogo não encontrado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {catalogue.titulo}
            </h1>
            <p className="text-muted-foreground">
              Detalhes do catálogo e conteúdos vinculados
            </p>
          </div>
        </div>
        <Button onClick={handleEdit} className="gap-2">
          <Edit className="h-4 w-4" />
          Editar Catálogo
        </Button>
      </div>

      {/* Informações do Catálogo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Informações do Catálogo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Tipo</label>
              <Badge variant="secondary">
                {tipoLabels[catalogue.tipo_catalogo as keyof typeof tipoLabels] || catalogue.tipo_catalogo}
              </Badge>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <Badge variant={catalogue.status ? "default" : "outline"}>
                {catalogue.status ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Ordem</label>
              <p className="text-sm">{catalogue.ordem_exibicao}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Total de Conteúdos</label>
              <p className="text-sm font-medium">{contents.length}</p>
            </div>
          </div>

          {catalogue.descricao && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Descrição</label>
              <p className="text-sm bg-muted/50 p-3 rounded-md">{catalogue.descricao}</p>
            </div>
          )}

          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Criado em: {new Date(catalogue.created_at).toLocaleDateString("pt-BR")}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Atualizado em: {new Date(catalogue.updated_at).toLocaleDateString("pt-BR")}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conteúdos Vinculados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Conteúdos Vinculados ({contents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {contents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum conteúdo vinculado a este catálogo ainda.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="w-24">Status</TableHead>
                  <TableHead className="w-32">Criado em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contents.map((content) => (
                  <TableRow key={content.id}>
                    <TableCell className="font-medium">
                      {content.titulo}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {content.tipo_conteudo}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={content.status ? "default" : "outline"}>
                        {content.status ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(content.created_at).toLocaleDateString("pt-BR")}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}