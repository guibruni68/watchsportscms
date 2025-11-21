import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Tag as TagIcon, Calendar, X, Image as ImageIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { mockBanners, Banner } from "@/data/mockData";
import { getContentStatus, getStatusBadgeVariant } from "@/lib/utils";
import { format } from "date-fns";

export default function BannerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, [id, navigate]);

  const handleEdit = () => {
    navigate(`/banners/${id}/editar`);
  };

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

  const status = getContentStatus(banner.enabled, banner.scheduleDate);
  const statusVariant = getStatusBadgeVariant(status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/banners')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Banners
          </Button>
        </div>
        <Button onClick={handleEdit} className="gap-2">
          <Edit className="h-4 w-4" />
          Edit Banner
        </Button>
      </div>

      {/* Banner Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            {banner.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Banner Preview Section */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-muted-foreground block">Banner Preview ({banner.layout === "hero" ? "Hero Layout" : "Standard Layout"})</label>
            
            {/* Hero Layout Preview */}
            {banner.layout === "hero" && (
              <div className="relative w-full aspect-[21/9] rounded-lg overflow-hidden bg-muted">
                {banner.bgImageUrl ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={banner.bgImageUrl} 
                      alt={banner.title}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setLightboxImage(banner.bgImageUrl!)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      {banner.tag && (
                        <Badge className="mb-2" variant="secondary">
                          {banner.tag}
                        </Badge>
                      )}
                      <h2 className="text-4xl font-bold mb-2">{banner.title}</h2>
                      <p className="text-lg mb-4 max-w-2xl">{banner.text}</p>
                      {banner.buttonText && (
                        <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                          {banner.buttonText}
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
            )}

            {/* Standard Layout Preview */}
            {banner.layout === "standard" && (
              <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-muted">
                {banner.bgImageUrl ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={banner.bgImageUrl} 
                      alt={banner.title}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setLightboxImage(banner.bgImageUrl!)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 p-6 text-white max-w-md">
                      {banner.tag && (
                        <Badge className="mb-2" variant="secondary">
                          {banner.tag}
                        </Badge>
                      )}
                      <h3 className="text-2xl font-bold mb-2">{banner.title}</h3>
                      <p className="text-sm mb-3">{banner.text}</p>
                      {banner.buttonText && (
                        <Button className="bg-white text-black hover:bg-gray-100">
                          {banner.buttonText}
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
            )}

            {/* Mobile Preview */}
            {banner.bgMobileUrl && (
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">Mobile Banner</label>
                <div className="relative w-64 aspect-[9/16] rounded-lg overflow-hidden bg-muted mx-auto">
                  <img 
                    src={banner.bgMobileUrl} 
                    alt={`${banner.title} - Mobile`}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => setLightboxImage(banner.bgMobileUrl!)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Banner Info */}
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Layout Type</label>
              <div className="text-sm">
                <Badge variant="outline">
                  {banner.layout === "hero" ? "Hero" : "Standard"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="flex items-center gap-2">
                  <Badge variant={banner.enabled ? "default" : "outline"}>
                    {banner.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                  {banner.isPublished && (
                    <Badge variant="secondary">Published</Badge>
                  )}
                  <Badge variant={statusVariant}>{status}</Badge>
                </div>
              </div>

              {banner.tag && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Tag</label>
                  <div className="text-sm">
                    <Badge variant="secondary">
                      <TagIcon className="h-3 w-3 mr-1" />
                      {banner.tag}
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            {banner.scheduleDate && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Schedule Date</label>
                <div className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(banner.scheduleDate), "PPP 'at' p")}
                </div>
              </div>
            )}

            {banner.text && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Body Text</label>
                <p className="text-sm bg-muted/50 p-3 rounded-md">{banner.text}</p>
              </div>
            )}

            {banner.buttonText && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Button Text</label>
                  <div className="text-sm font-medium">{banner.buttonText}</div>
                </div>
                
                {banner.buttonRedirectionUrl && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Button URL</label>
                    <div className="text-sm text-muted-foreground font-mono text-xs break-all bg-muted/50 p-2 rounded">
                      {banner.buttonRedirectionUrl}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Created At</label>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(banner.createdAt), "PPP 'at' p")}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Updated At</label>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(banner.updatedAt), "PPP 'at' p")}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={() => setLightboxImage(null)}
          >
            <X className="h-6 w-6" />
          </Button>
          <img 
            src={lightboxImage} 
            alt="Enlarged view"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
