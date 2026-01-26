import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Calendar, ExternalLink } from "lucide-react";
import { EventForm } from "@/components/forms/EventForm";
import { mockEvents } from "@/data/mockData";
import { format } from "date-fns";
import { getContentStatus, getStatusBadgeVariant } from "@/lib/utils";
export default function EventDetailPage() {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const [showEditForm, setShowEditForm] = useState(false);

  // Find the event
  const event = mockEvents.find(e => e.id === id);
  if (!event) {
    return <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/schedule")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Schedule
          </Button>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Event not found</p>
          </CardContent>
        </Card>
      </div>;
  }
  const status = getContentStatus(event.enabled, undefined);
  const statusVariant = getStatusBadgeVariant(status);
  if (showEditForm) {
    return <EventForm initialData={{
      title: event.title,
      description: event.description,
      date: new Date(event.date),
      cardImageUrl: event.cardImageUrl,
      redirectionUrl: event.redirectionUrl,
      enabled: event.enabled
    }} isEdit={true} onClose={() => setShowEditForm(false)} />;
  }
  return <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/schedule")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Schedule
          </Button>
        </div>
        <Button onClick={() => setShowEditForm(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Event
        </Button>
      </div>

      {/* Status Badge */}
      

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Image */}
          {event.cardImageUrl && <Card>
              <CardContent className="p-0">
                <img src={event.cardImageUrl} alt={event.title} className="w-full h-96 object-cover rounded-lg" onError={e => {
              e.currentTarget.src = "/placeholder.svg";
            }} />
              </CardContent>
            </Card>}

          {/* Event Header */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(event.date), "PPP 'at' p")}</span>
              </div>
            </div>
          </div>

          {/* Event Description */}
          <Card>
            <CardContent className="p-6">
              <p className="text-lg leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Metadata */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Event Information</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <div className="mt-1">
                      <Badge variant={statusVariant}>{status}</Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Event Date:</span>
                    <div className="mt-1 font-medium">
                      {format(new Date(event.date), "PPP 'at' p")}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Created:</span>
                    <div className="mt-1 font-medium">
                      {format(new Date(event.createdAt), "PPP")}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last Updated:</span>
                    <div className="mt-1 font-medium">
                      {format(new Date(event.updatedAt), "PPP")}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Enabled:</span>
                    <div className="mt-1 font-medium">
                      {event.enabled ? "Yes" : "No"}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button onClick={() => setShowEditForm(true)} variant="outline" className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Event
                </Button>
                {event.redirectionUrl && <Button asChild variant="outline" className="w-full">
                    <a href={event.redirectionUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Link
                    </a>
                  </Button>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
}