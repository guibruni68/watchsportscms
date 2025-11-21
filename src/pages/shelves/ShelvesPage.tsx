import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { SearchFilters } from "@/components/ui/search-filters";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Shelf } from "@/types/shelf";

interface ShelfWithOrder extends Shelf {
  order: number;
  status: "active" | "inactive";
}

const mockShelves: ShelfWithOrder[] = [
  {
    id: "1",
    title: "Trending Now",
    type: "PERSONALIZED",
    layout: "CAROUSEL",
    domain: "CONTENT",
    hasSeeMore: true,
    seeMoreUrl: "/content/trending",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    enabled: true,
    algorithm: "SUGGESTIONS_FOR_YOU",
    limit: 20,
    order: 1,
    status: "active",
  },
  {
    id: "2",
    title: "Featured Collections",
    type: "MANUAL",
    layout: "GRID",
    domain: "COLLECTION",
    hasSeeMore: false,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
    enabled: true,
    selectedItems: ["col-1", "col-2", "col-3"],
    order: 2,
    status: "active",
  },
  {
    id: "3",
    title: "Latest News",
    type: "AUTOMATIC",
    layout: "LIST",
    domain: "NEWS",
    hasSeeMore: true,
    seeMoreUrl: "/news",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
    enabled: false,
    filter: {
      rule: "RECENT",
      domain: "NEWS",
      domainField: "publishDate",
    },
    order: 3,
    status: "inactive",
  },
];

const getTypeLabel = (type: string) => {
  const labels = {
    MANUAL: "Manual",
    PERSONALIZED: "Personalized", 
    AUTOMATIC: "Automatic"
  };
  return labels[type as keyof typeof labels];
};

const getLayoutLabel = (layout: string) => {
  const labels = {
    CAROUSEL: "Carousel",
    LIST: "List",
    HERO_BANNER: "Hero Banner",
    MID_BANNER: "Mid Banner",
    AD_BANNER: "Ad Banner",
    GRID: "Grid"
  };
  return labels[layout as keyof typeof labels];
};

const getDomainLabel = (domain: string) => {
  const labels = {
    CONTENT: "Content",
    COLLECTION: "Collection", 
    NEWS: "News",
    AGENT: "Agent",
    GROUP: "Group",
    AGENDA: "Agenda",
    BANNER: "Banner"
  };
  return labels[domain as keyof typeof labels];
};

export default function ShelvesPage() {
  const navigate = useNavigate();
  const [shelves, setShelves] = useState<ShelfWithOrder[]>(mockShelves);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  const categories = [
    { value: "all", label: "All types" },
    { value: "MANUAL", label: "Manual" },
    { value: "PERSONALIZED", label: "Personalized" },
    { value: "AUTOMATIC", label: "Automatic" }
  ];

  const statuses = [
    { value: "all", label: "All statuses" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" }
  ];

  const filteredShelves = shelves.filter(shelf => {
    const matchesSearch = shelf.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || shelf.type === categoryFilter;
    const matchesStatus = statusFilter === "all" || shelf.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleEdit = (id: string) => {
    navigate(`/shelves/${id}/edit`);
  };

  const handleDeleteShelf = (id: string) => {
    setShelves(shelves.filter(s => s.id !== id));
    toast({
      title: "Shelf removed",
      description: "The shelf was deleted successfully.",
    });
  };

  const handleNewShelf = () => {
    navigate('/shelves/new');
  };

  const totalPages = Math.ceil(filteredShelves.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedShelves = filteredShelves.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Shelves</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleNewShelf} className="gap-2">
            <Plus className="h-4 w-4" />
            New Shelf
          </Button>
        </div>
      </div>

      <SearchFilters
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categories={categories}
        statuses={statuses}
        searchPlaceholder="Search shelves..."
        categoryPlaceholder="Shelf Type"
        statusPlaceholder="Status"
      />

      {paginatedShelves.length > 0 ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Layout</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead className="w-32">Status</TableHead>
                <TableHead className="w-20 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedShelves.map((shelf) => (
                <TableRow key={shelf.id}>
                  <TableCell>
                    <div className="font-medium">{shelf.title}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getTypeLabel(shelf.type)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getLayoutLabel(shelf.layout)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{getDomainLabel(shelf.domain)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={shelf.enabled ? "default" : "secondary"}>
                      {shelf.enabled ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <ActionDropdown
                      onEdit={() => handleEdit(shelf.id)}
                      onDelete={() => handleDeleteShelf(shelf.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground">
              {searchTerm || categoryFilter !== "all" || statusFilter !== "all"
                ? "No shelves found with the applied filters."
                : "No shelves registered yet."}
            </div>
            {!searchTerm && categoryFilter === "all" && statusFilter === "all" && (
              <Button onClick={handleNewShelf} className="mt-4">
                Create First Shelf
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {filteredShelves.length > itemsPerPage && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredShelves.length)} of {filteredShelves.length} shelves
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
