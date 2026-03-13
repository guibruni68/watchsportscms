import { useState } from "react";
import { PlayCircle } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface TutorialButtonProps {
  videoUrl?: string;
}

export function TutorialButton({ videoUrl }: TutorialButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-white shadow-lg hover:bg-primary/80 transition-colors text-sm font-medium"
      >
        <PlayCircle className="h-4 w-4" />
        Tutorial
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl p-0 bg-[#0d0d0d] border-[#1f1f1f] overflow-hidden">
          {videoUrl ? (
            <div className="aspect-video w-full">
              <iframe
                src={videoUrl}
                title="Tutorial"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          ) : (
            <div className="aspect-video w-full">
              <img
                src="/tutorial-placeholder.png"
                alt="Tutorial"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
