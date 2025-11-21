import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageForm } from "@/components/forms/PageForm";
import { Page } from "@/types/page";

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

export default function EditPagePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<Partial<any>>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual Supabase query
        const page = mockPages.find(p => p.id === id);
        
        if (!page) {
          navigate('/pages');
          return;
        }
        setInitialData(page);
      } catch (error) {
        console.error("Error fetching page:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [id, navigate]);

  const handleCancel = () => {
    navigate("/pages");
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <PageForm 
        initialData={initialData}
        isEdit={true}
        onClose={handleCancel}
      />
    </div>
  );
}
