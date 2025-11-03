import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import { ImportButton } from "@/components/ui/import-button";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { SearchFilters } from "@/components/ui/search-filters";
import { toast } from "@/hooks/use-toast";
import { mockCatalogues } from "@/data/mockCatalogues";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Catalogue {
  id: string;
  titulo: string;
  descricao?: string;
  tipo_catalogo: string;
  status: boolean;
  ordem_exibicao: number;
  created_at: string;
  content_count?: number;
}

const tipoLabels = {
  serie: "Série",
  colecao: "Coleção",
  playlist: "Playlist",
  outro: "Outro"
};

export default function CataloguesPage() {
  const navigate = useNavigate();
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [catalogueToDelete, setCatalogueToDelete] = useState<Catalogue | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchCatalogues = async () => {
    setLoading(true);
    try {
      const data = mockCatalogues.map(cat => ({
        ...cat,
        content_count: cat.conteudos?.length || 0
      }));

      setCatalogues(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar catálogos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogues();
  }, []);

  const types = Array.from(new Set(catalogues.map(c => c.tipo_catalogo)));
  const statuses = Array.from(new Set(catalogues.map(c => c.status)));

  const filteredCatalogues = catalogues.filter(catalogue => {
    const matchesSearch = catalogue.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (catalogue.descricao && catalogue.descricao.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === "all" || catalogue.tipo_catalogo === typeFilter;
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "true" && catalogue.status) ||
      (statusFilter === "false" && !catalogue.status);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCatalogues.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCatalogues = filteredCatalogues.slice(startIndex, startIndex + itemsPerPage);

  const handleEdit = (catalogue: Catalogue) => {
    navigate(`/catalogues/edit/${catalogue.id}`);
  };

  const handleView = (catalogue: Catalogue) => {
    navigate(`/catalogues/${catalogue.id}`);
  };

  const handleDeleteClick = (catalogue: Catalogue) => {
    setCatalogueToDelete(catalogue);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!catalogueToDelete) return;

    // Verificar se há conteúdos vinculados
    if (catalogueToDelete.content_count && catalogueToDelete.content_count > 0) {
      toast({
        title: "Erro",
        description: `Não é possível excluir o catálogo "${catalogueToDelete.titulo}" pois há ${catalogueToDelete.content_count} conteúdo(s) vinculado(s).`,
        variant: "destructive",
      });
      setDeleteDialogOpen(false);
      setCatalogueToDelete(null);
      return;
    }

    // Mock deletion
    toast({
      title: "Sucesso",
      description: "Catálogo excluído com sucesso! (Dados de exemplo)",
    });

    fetchCatalogues();
    setDeleteDialogOpen(false);
    setCatalogueToDelete(null);
  };

  const handleNewCatalogue = () => {
    navigate('/catalogues/novo');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Catálogos</h1>
          <p className="text-muted-foreground">Gerencie os catálogos de conteúdo do clube</p>
        </div>
        <div className="flex gap-2">
          <ImportButton entityName="catálogos" />
          <Button onClick={handleNewCatalogue} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Catálogo
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <SearchFilters
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={typeFilter}
        onCategoryChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categories={[
          { value: "all", label: "Todos os tipos" },
          ...types.map(type => ({ 
            value: type, 
            label: tipoLabels[type as keyof typeof tipoLabels] || type 
          }))
        ]}
        statuses={[
          { value: "all", label: "Todos os status" },
          { value: "true", label: "Ativo" },
          { value: "false", label: "Inativo" }
        ]}
        searchPlaceholder="Buscar catálogos..."
        categoryPlaceholder="Tipo"
        statusPlaceholder="Status"
      />

      {/* Tabela */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="w-32">Conteúdos</TableHead>
              <TableHead className="w-24">Status</TableHead>
              <TableHead className="w-32">Criado em</TableHead>
              <TableHead className="w-32">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : paginatedCatalogues.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  {filteredCatalogues.length === 0 && searchTerm === "" && typeFilter === "all" && statusFilter === "all" 
                    ? "Nenhum catálogo cadastrado ainda." 
                    : "Nenhum catálogo encontrado com os filtros aplicados."}
                </TableCell>
              </TableRow>
            ) : (
              paginatedCatalogues.map((catalogue) => (
                <TableRow key={catalogue.id}>
                  <TableCell>
                    <span className="font-medium">{catalogue.titulo}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {tipoLabels[catalogue.tipo_catalogo as keyof typeof tipoLabels] || catalogue.tipo_catalogo}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <span className="font-medium">{catalogue.content_count || 0}</span>
                      <div className="text-xs text-muted-foreground">
                        {catalogue.content_count === 1 ? 'item' : 'itens'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={catalogue.status ? "default" : "outline"}>
                      {catalogue.status ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(catalogue.created_at).toLocaleDateString("pt-BR")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <ActionDropdown
                      onView={() => handleView(catalogue)}
                      onEdit={() => handleEdit(catalogue)}
                      onDelete={() => handleDeleteClick(catalogue)}
                      showView={true}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Paginação */}
      {filteredCatalogues.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredCatalogues.length)} de {filteredCatalogues.length} catálogos
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <div className="flex items-center gap-1">
              <span className="text-sm">
                Página {currentPage} de {totalPages}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              {catalogueToDelete?.content_count && catalogueToDelete.content_count > 0 ? (
                <>
                  Não é possível excluir o catálogo "{catalogueToDelete.titulo}" pois há{' '}
                  <strong>{catalogueToDelete.content_count} conteúdo(s)</strong> vinculado(s) a ele.
                  <br /><br />
                  Remova os conteúdos vinculados antes de excluir o catálogo.
                </>
              ) : (
                <>
                  Tem certeza que deseja excluir o catálogo "{catalogueToDelete?.titulo}"?
                  <br />
                  Esta ação não pode ser desfeita.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            {(!catalogueToDelete?.content_count || catalogueToDelete.content_count === 0) && (
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Excluir
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}