import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Eye, Edit, Trash2, Play } from "lucide-react";
import { ImportButton } from "@/components/ui/import-button";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { SearchFilters } from "@/components/ui/search-filters";
import { toast } from "@/hooks/use-toast";
import { mockCatalogues } from "@/data/mockCatalogues";
import { getContentStatus, getStatusBadgeVariant } from "@/lib/utils";
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

interface Collection {
  id: string;
  titulo: string;
  descricao?: string;
  genre?: string[];
  status: boolean;
  ordem_exibicao: number;
  published_at: string;
  content_count?: number;
  cover_url?: string;
}

export default function CollectionsPage() {
  const navigate = useNavigate();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<Collection | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const data = mockCatalogues.map(cat => ({
        ...cat,
        content_count: cat.conteudos?.length || 0
      }));

      setCollections(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error loading collections.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const categories = Array.from(new Set(collections.flatMap(c => c.genre || [])));

  const filteredCollections = collections.filter(collection => {
    const matchesSearch = collection.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (collection.descricao && collection.descricao.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (collection.genre || []).some(g => g.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === "all" || (collection.genre || []).includes(categoryFilter);
    
    const collectionStatus = getContentStatus(collection.status, collection.published_at);
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "Active" && collectionStatus === "Active") ||
      (statusFilter === "Inactive" && collectionStatus === "Inactive") ||
      (statusFilter === "Publishing" && collectionStatus === "Publishing");
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCollections.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCollections = filteredCollections.slice(startIndex, startIndex + itemsPerPage);

  const handleEdit = (collection: Collection) => {
    navigate(`/collections/edit/${collection.id}`);
  };

  const handleView = (collection: Collection) => {
    navigate(`/collections/${collection.id}`);
  };

  const handleDeleteClick = (collection: Collection) => {
    setCollectionToDelete(collection);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!collectionToDelete) return;

    // Check if there are linked contents
    if (collectionToDelete.content_count && collectionToDelete.content_count > 0) {
      toast({
        title: "Error",
        description: `Cannot delete collection "${collectionToDelete.titulo}" because it has ${collectionToDelete.content_count} linked content(s).`,
        variant: "destructive",
      });
      setDeleteDialogOpen(false);
      setCollectionToDelete(null);
      return;
    }

    // Mock deletion
    toast({
      title: "Success",
      description: "Collection deleted successfully! (Sample data)",
    });

    fetchCollections();
    setDeleteDialogOpen(false);
    setCollectionToDelete(null);
  };

  const handleNewCollection = () => {
    navigate('/collections/novo');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Collections</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleNewCollection} className="gap-2">
            <Plus className="h-4 w-4" />
            New Collection
          </Button>
        </div>
      </div>

      {/* Filters */}
      <SearchFilters
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categories={[
          { value: "all", label: "All Genres" },
          ...categories.map(cat => ({ value: cat, label: cat }))
        ]}
        statuses={[
          { value: "all", label: "All statuses" },
          { value: "Active", label: "Active" },
          { value: "Inactive", label: "Inactive" },
          { value: "Publishing", label: "Publishing" }
        ]}
        searchPlaceholder="Search collections..."
        categoryPlaceholder="Genre"
        statusPlaceholder="Status"
      />

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Thumb</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="min-w-[250px]">Genres</TableHead>
              <TableHead className="w-32">Publish Date</TableHead>
              <TableHead className="w-24">Status</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : paginatedCollections.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  {filteredCollections.length === 0 && searchTerm === "" && categoryFilter === "all" && statusFilter === "all" 
                    ? "No collections registered yet." 
                    : "No collections found with the applied filters."}
                </TableCell>
              </TableRow>
            ) : (
              paginatedCollections.map((collection) => (
                <TableRow key={collection.id}>
                  <TableCell>
                    <div className="w-16 aspect-[3/4] bg-muted rounded-md flex items-center justify-center overflow-hidden">
                      {collection.cover_url ? (
                        <img 
                          src={collection.cover_url} 
                          alt={collection.titulo}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Play className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="font-medium truncate">{collection.titulo}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {(collection.genre || []).map((genre, index) => (
                        <Badge key={index} variant="secondary">
                          <span>{genre}</span>
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(collection.published_at).toLocaleDateString("en-US")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(getContentStatus(collection.status, collection.published_at))}>
                      {getContentStatus(collection.status, collection.published_at)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ActionDropdown
                      onView={() => handleView(collection)}
                      onEdit={() => handleEdit(collection)}
                      onDelete={() => handleDeleteClick(collection)}
                      showView={true}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {filteredCollections.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCollections.length)} of {filteredCollections.length} collections
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              {collectionToDelete?.content_count && collectionToDelete.content_count > 0 ? (
                <>
                  Cannot delete collection "{collectionToDelete.titulo}" because it has{' '}
                  <strong>{collectionToDelete.content_count} linked content(s)</strong>.
                  <br /><br />
                  Remove the linked contents before deleting the collection.
                </>
              ) : (
                <>
                  Are you sure you want to delete collection "{collectionToDelete?.titulo}"?
                  <br />
                  This action cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {(!collectionToDelete?.content_count || collectionToDelete.content_count === 0) && (
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}