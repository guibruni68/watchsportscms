import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { BannerForm } from "@/components/forms/BannerForm";
import { mockBanners } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

export default function EditBannerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [banner, setBanner] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      if (!id) return;

      try {
        // Mock API call - replace with actual API
        const bannerData = mockBanners.find(b => b.id === id);
        
        if (!bannerData) {
          throw new Error("Banner not found");
        }
        
        setBanner(bannerData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Error loading banner data.",
          variant: "destructive",
        });
        navigate('/banners');
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!banner) {
    return null;
  }

  return (
      <BannerForm
        initialData={{
          title: banner.title,
          layout: banner.layout,
          text: banner.text,
          tag: banner.tag,
          buttonText: banner.buttonText,
          buttonRedirectionUrl: banner.buttonRedirectionUrl,
          scheduleDate: banner.scheduleDate ? new Date(banner.scheduleDate) : undefined,
          bgImageUrl: banner.bgImageUrl,
          bgMobileUrl: banner.bgMobileUrl,
          enabled: banner.enabled
        }}
      isEdit
    />
  );
}
