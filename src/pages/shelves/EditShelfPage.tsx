import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShelfForm } from "@/components/forms/ShelfForm";
import { Shelf } from "@/types/shelf";

const mockShelves: Shelf[] = [
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
  },
];

export default function EditShelfPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<Partial<any>>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShelf = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual Supabase query
        const shelf = mockShelves.find(s => s.id === id);
        
        if (!shelf) {
          navigate('/shelves');
          return;
        }
        setInitialData(shelf);
      } catch (error) {
        console.error("Error fetching shelf:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShelf();
  }, [id, navigate]);

  const handleSubmit = (formData: any) => {
    console.log("Updating shelf:", formData);
    // TODO: Integrate with Supabase
    navigate("/shelves");
  };

  const handleCancel = () => {
    navigate("/shelves");
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
      <ShelfForm 
        initialData={initialData}
        isEdit={true}
        onClose={handleCancel}
      />
    </div>
  );
}
