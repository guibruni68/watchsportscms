import { useNavigate } from "react-router-dom";
import { CarouselForm } from "@/components/forms/CarouselForm";
import { toast } from "@/hooks/use-toast";

export default function NewCarouselPage() {
  const navigate = useNavigate();

  const handleSubmit = (formData: any) => {
    console.log("Creating new carousel:", formData);
    toast({
      title: "Sucesso",
      description: "Carrossel criado com sucesso!",
    });
    navigate("/carousels");
  };

  const handleCancel = () => {
    navigate("/carousels");
  };

  return <CarouselForm onSubmit={handleSubmit} onCancel={handleCancel} />;
}