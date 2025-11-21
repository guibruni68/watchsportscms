import { useNavigate } from "react-router-dom";
import { ShelfForm } from "@/components/forms/ShelfForm";

export default function NewShelfPage() {
  const navigate = useNavigate();

  const handleSubmit = (formData: any) => {
    console.log("Creating new shelf:", formData);
    // TODO: Integrate with Supabase
    navigate("/shelves");
  };

  const handleCancel = () => {
    navigate("/shelves");
  };

  return (
    <div className="container mx-auto py-6">
      <ShelfForm onClose={handleCancel} />
    </div>
  );
}
