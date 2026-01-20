import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Image as ImageIcon } from "lucide-react";
import { ImportButton } from "@/components/ui/import-button";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { SearchFilters } from "@/components/ui/search-filters";
import { toast } from "@/hooks/use-toast";
import { mockBanners, Banner } from "@/data/mockData";
import { getContentStatus, getStatusBadgeVariant } from "@/lib/utils";

export default function BannersPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [banners, setBanners] = useState<Banner[]>(mockBanners);
  const [searchTerm, setSearchTerm] = useState("");
  const [layoutFilter, setLayoutFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Check for new param on mount
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      navigate('/banners/novo');
      searchParams.delete('new');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams, navigate]);

  const layouts = [
    { value: "all", label: "All Layouts" },
    { value: "hero", label: "Hero" },
    { value: "standard", label: "Standard" }
  ];

  const statuses = [
    { value: "all", label: "All Statuses" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "Scheduled", label: "Scheduled" }
  ];

  const filteredBanners = banners.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLayout = layoutFilter === "all" || item.layout === layoutFilter;
    const itemStatus = getContentStatus(item.enabled, item.scheduleDate);
    const matchesStatus = statusFilter === "all" || itemStatus === statusFilter;
    return matchesSearch && matchesLayout && matchesStatus;
  });

  const totalPages = Math.ceil(filteredBanners.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBanners = filteredBanners.slice(startIndex, startIndex + itemsPerPage);

  const handleViewDetails = (id: string) => {
    navigate(`/banners/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/banners/${id}/editar`);
  };

  const handleDelete = (id: string) => {
    setBanners(banners.filter(item => item.id !== id));
    toast({
      title: "Banner deleted",
      description: "The banner was removed successfully.",
    });
  };

  const handleNewBanner = () => {
    navigate('/banners/novo');
  };

  const getLayoutLabel = (layout: string) => {
    const labels: Record<string, string> = {
      hero: "Hero",
      standard: "Standard"
    };
    return labels[layout] || layout;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Banners</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleNewBanner} className="gap-2">
            <Plus className="h-4 w-4" />
            New Banner
          </Button>
        </div>
      </div>

      <SearchFilters
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={layoutFilter}
        onCategoryChange={setLayoutFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categories={layouts}
        statuses={statuses}
        searchPlaceholder="Search banners..."
        categoryPlaceholder="Layout"
        statusPlaceholder="Status"
      />

      {paginatedBanners.length > 0 ? (
        <Card className="border-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="w-32">Layout</TableHead>
                <TableHead className="w-32">Status</TableHead>
                <TableHead className="w-20 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBanners.map((banner) => {
                const status = getContentStatus(banner.enabled, banner.scheduleDate);
                const statusVariant = getStatusBadgeVariant(status);

                return (
                  <TableRow key={banner.id}>
                    <TableCell>
                      <div className="font-medium">{banner.title}</div>
                      {banner.text && (
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {banner.text}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getLayoutLabel(banner.layout)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant}>
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <ActionDropdown
                        onView={() => handleViewDetails(banner.id)}
                        onEdit={() => handleEdit(banner.id)}
                        onDelete={() => handleDelete(banner.id)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground">
              {searchTerm || layoutFilter !== "all" || statusFilter !== "all"
                ? "No banners found with the applied filters."
                : "No banners registered yet."}
            </div>
            {!searchTerm && layoutFilter === "all" && statusFilter === "all" && (
              <Button onClick={handleNewBanner} className="mt-4">
                Create First Banner
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {filteredBanners.length > itemsPerPage && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredBanners.length)} of {filteredBanners.length} banners
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
