import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Tag as TagIcon, Calendar, X, Image as ImageIcon, Megaphone, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { mockBanners, Banner } from "@/data/mockData";
import { getContentStatus, getStatusBadgeVariant, cn } from "@/lib/utils";
import { format } from "date-fns";

export default function BannerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"preview" | "information">("preview")

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
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

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/banners')}
        className="text-muted-foreground hover:text-foreground gap-2 px-0"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Banners
      </Button>

      {/* Header Card */}
      <Card className="border-[#1f1f1f] bg-[#171717] rounded-xl overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-[#262626] to-[#171717]" />
        <div className="px-7 pb-7 -mt-14">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="w-[116px] h-[116px] rounded-full bg-[#262626] border border-[#1f1f1f] overflow-hidden flex items-center justify-center shadow-lg mb-4">
                {banner.bgImageUrl ? (
                  <img src={banner.bgImageUrl} alt={banner.title} className="w-full h-full object-cover" />
                ) : (
                  <Megaphone className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white tracking-[-0.6px]">{banner.title}</h1>
                <Badge variant="neutral">{banner.enabled ? "Enabled" : "Disabled"}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1 capitalize">{banner.layout} layout</p>
            </div>
            <Button
              onClick={handleEdit}
              className="bg-primary hover:bg-primary/80 text-white rounded-[10px] px-6 h-10 mt-16"
            >
              Edit
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-[#1f1f1f]">
        <div className="flex gap-0">
          {([
            { id: "preview"     as const, label: "Preview",     icon: ImageIcon },
            { id: "information" as const, label: "Information", icon: Info },
          ]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-6 py-3 text-xs font-normal uppercase tracking-wider transition-colors relative flex items-center gap-1.5",
                activeTab === tab.id ? "text-white" : "text-muted-foreground hover:text-white/80"
              )}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Preview Tab */}
      {activeTab === "preview" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <CardContent className="p-7 space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-3">
                Banner Preview ({banner.layout === "hero" ? "Hero Layout" : "Standard Layout"})
              </p>

              {banner.layout === "hero" && (
                <div className="relative w-full aspect-[21/9] rounded-lg overflow-hidden bg-muted">
                  {banner.bgImageUrl ? (
                    <div className="relative w-full h-full">
                      <img src={banner.bgImageUrl} alt={banner.title}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setLightboxImage(banner.bgImageUrl!)} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        {banner.tag && <Badge className="mb-2" variant="neutral">{banner.tag}</Badge>}
                        <h2 className="text-4xl font-bold mb-2">{banner.title}</h2>
                        <p className="text-lg mb-4 max-w-2xl">{banner.text}</p>
                        {banner.buttonText && (
                          <Button size="lg" className="bg-white text-black hover:bg-gray-100">{banner.buttonText}</Button>
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

              {banner.layout === "standard" && (
                <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-muted">
                  {banner.bgImageUrl ? (
                    <div className="relative w-full h-full">
                      <img src={banner.bgImageUrl} alt={banner.title}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setLightboxImage(banner.bgImageUrl!)} />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
                      <div className="absolute top-1/2 -translate-y-1/2 left-0 p-6 text-white max-w-md">
                        {banner.tag && <Badge className="mb-2" variant="neutral">{banner.tag}</Badge>}
                        <h3 className="text-2xl font-bold mb-2">{banner.title}</h3>
                        <p className="text-sm mb-3">{banner.text}</p>
                        {banner.buttonText && (
                          <Button className="bg-white text-black hover:bg-gray-100">{banner.buttonText}</Button>
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

              {banner.bgMobileUrl && (
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground mb-3">Mobile Banner</p>
                  <div className="relative w-48 aspect-[9/16] rounded-lg overflow-hidden bg-muted">
                    <img src={banner.bgMobileUrl} alt={`${banner.title} - Mobile`}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setLightboxImage(banner.bgMobileUrl!)} />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Tab */}
      {activeTab === "information" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <CardContent className="p-7">
            <div className="flex gap-12">
              <div className="flex-1 space-y-8">
                {banner.text && (
                  <div>
                    <h3 className="text-base font-semibold text-white mb-4">Body Text</h3>
                    <p className="text-sm text-white/80">{banner.text}</p>
                  </div>
                )}
                {banner.buttonText && (
                  <div>
                    <h3 className="text-base font-semibold text-white mb-4">Button Text</h3>
                    <p className="text-sm text-white/80">{banner.buttonText}</p>
                  </div>
                )}
                {banner.buttonRedirectionUrl && (
                  <div>
                    <h3 className="text-base font-semibold text-white mb-4">Button URL</h3>
                    <p className="text-sm text-white/80 font-mono break-all">{banner.buttonRedirectionUrl}</p>
                  </div>
                )}
              </div>
              <div className="w-64 space-y-8">
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Status</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={banner.enabled ? "default" : "outline"}>
                      {banner.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                    {banner.isPublished && <Badge variant="neutral">Published</Badge>}
                    <Badge variant={getStatusBadgeVariant(status)}>{status}</Badge>
                  </div>
                </div>
                {banner.tag && (
                  <div>
                    <h3 className="text-base font-semibold text-white mb-4">Tag</h3>
                    <Badge variant="neutral"><TagIcon className="h-3 w-3 mr-1" />{banner.tag}</Badge>
                  </div>
                )}
                {banner.scheduleDate && (
                  <div>
                    <h3 className="text-base font-semibold text-white mb-4">Schedule Date</h3>
                    <p className="text-sm text-white/80 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(banner.scheduleDate), "PPP 'at' p")}
                    </p>
                  </div>
                )}
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Created At</h3>
                  <p className="text-sm text-white/80">{format(new Date(banner.createdAt), "PPP")}</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Updated At</h3>
                  <p className="text-sm text-white/80">{format(new Date(banner.updatedAt), "PPP")}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}>
          <Button variant="ghost" size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={() => setLightboxImage(null)}>
            <X className="h-6 w-6" />
          </Button>
          <img src={lightboxImage} alt="Enlarged view"
            className="max-w-full max-h-full object-contain"
            onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
