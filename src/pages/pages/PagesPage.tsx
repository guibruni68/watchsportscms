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
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Page, PageName } from "@/types/page";

const mockPages: Page[] = [
  {
    id: "1",
    name: "home",
    shelves: [
      { id: "ps1", shelfId: "1", shelfTitle: "Trending Now", order: 0 },
      { id: "ps2", shelfId: "2", shelfTitle: "Featured Collections", order: 1 },
    ],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "content",
    shelves: [
      { id: "ps3", shelfId: "1", shelfTitle: "Trending Now", order: 0 },
    ],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    name: "news",
    shelves: [
      { id: "ps4", shelfId: "3", shelfTitle: "Latest News", order: 0 },
    ],
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
  },
  {
    id: "4",
    name: "article details",
    shelves: [],
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
  },
  {
    id: "5",
    name: "agent details",
    shelves: [],
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
  },
  {
    id: "6",
    name: "group details",
    shelves: [],
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
  },
];

const getPageNameLabel = (name: PageName) => {
  const labels: Record<PageName, string> = {
    "home": "Home",
    "content": "Content",
    "news": "News",
    "article details": "Article Details",
    "agent details": "Agent Details",
    "group details": "Group Details",
  };
  return labels[name];
};

export default function PagesPage() {
  const navigate = useNavigate();
  const [pages, setPages] = useState<Page[]>(mockPages);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredPages = pages.filter(page => {
    const matchesSearch = getPageNameLabel(page.name).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleEdit = (id: string) => {
    navigate(`/pages/${id}/edit`);
  };

  const totalPages = Math.ceil(filteredPages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPages = filteredPages.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Pages</h1>
          <p className="text-muted-foreground">Configure shelves for each page</p>
        </div>
      </div>

      <Card className="p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {paginatedPages.length > 0 ? (
        <Card className="border-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page Name</TableHead>
                <TableHead>Shelves Count</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-20 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell>
                    <div className="font-medium">{getPageNameLabel(page.name)}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{page.shelves.length} shelves</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {new Date(page.updatedAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <ActionDropdown
                      onEdit={() => handleEdit(page.id)}
                      showDelete={false}
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
              {searchTerm
                ? "No pages found with the applied filters."
                : "No pages registered yet."}
            </div>
          </CardContent>
        </Card>
      )}

      {filteredPages.length > itemsPerPage && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredPages.length)} of {filteredPages.length} pages
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
