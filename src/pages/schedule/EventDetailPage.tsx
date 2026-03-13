import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CalendarDays, Info, Globe, ExternalLink } from "lucide-react";
import { EventForm } from "@/components/forms/EventForm";
import { mockEvents } from "@/data/mockData";
import { format } from "date-fns";
import { getContentStatus, getStatusBadgeVariant, cn } from "@/lib/utils";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showEditForm, setShowEditForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "publishing">("overview")

  const event = mockEvents.find(e => e.id === id);

  if (!event) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/schedule")}
          className="text-muted-foreground hover:text-foreground gap-2 px-0">
          <ArrowLeft className="h-4 w-4" />
          Back to Schedule
        </Button>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Event not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const status = getContentStatus(event.enabled, undefined);
  const statusVariant = getStatusBadgeVariant(status);

  if (showEditForm) {
    return (
      <EventForm
        initialData={{
          title: event.title,
          description: event.description,
          date: new Date(event.date),
          cardImageUrl: event.cardImageUrl,
          redirectionUrl: event.redirectionUrl,
          enabled: event.enabled
        }}
        isEdit={true}
        onClose={() => setShowEditForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/schedule")}
        className="text-muted-foreground hover:text-foreground gap-2 px-0"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Schedule
      </Button>

      {/* Header Card */}
      <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl overflow-hidden">
        <div className="h-32 bg-cover bg-center" style={{ backgroundImage: "url(/assets/BackgroundAFA.png)" }} />
        <div className="px-7 pb-7 -mt-14">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="w-[116px] h-[116px] rounded-full bg-[#262626] border border-[#1f1f1f] overflow-hidden flex items-center justify-center shadow-lg mb-4">
                {event.cardImageUrl ? (
                  <img src={event.cardImageUrl} alt={event.title} className="w-full h-full object-cover"
                    onError={e => { e.currentTarget.src = "/placeholder.svg" }} />
                ) : (
                  <CalendarDays className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
              <h1 className="text-2xl font-bold text-white tracking-[-0.6px]">{event.title}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {format(new Date(event.date), "PPP 'at' p")}
              </p>
            </div>
            <Button
              onClick={() => setShowEditForm(true)}
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
            { id: "overview"   as const, label: "Overview",   icon: Info },
            { id: "publishing" as const, label: "Publishing", icon: Globe },
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

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <CardContent className="p-7 space-y-8">
            {event.cardImageUrl && (
              <img
                src={event.cardImageUrl}
                alt={event.title}
                className="w-full h-72 object-cover rounded-xl"
                onError={e => { e.currentTarget.src = "/placeholder.svg" }}
              />
            )}
            <div>
              <h3 className="text-base font-semibold text-white mb-4">Description</h3>
              <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </div>
            {event.redirectionUrl && (
              <div>
                <h3 className="text-base font-semibold text-white mb-4">Link</h3>
                <a href={event.redirectionUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  {event.redirectionUrl}
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Publishing Tab */}
      {activeTab === "publishing" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <CardContent className="p-7">
            <div className="flex gap-12">
              <div className="flex-1 space-y-8">
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Status</h3>
                  <Badge variant={statusVariant}>{status}</Badge>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Enabled</h3>
                  <p className="text-sm text-white/80">{event.enabled ? "Yes" : "No"}</p>
                </div>
              </div>
              <div className="w-64 space-y-8">
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Event Date</h3>
                  <p className="text-sm text-white/80">{format(new Date(event.date), "PPP 'at' p")}</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Created</h3>
                  <p className="text-sm text-white/80">{format(new Date(event.createdAt), "PPP")}</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Last Updated</h3>
                  <p className="text-sm text-white/80">{format(new Date(event.updatedAt), "PPP")}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
