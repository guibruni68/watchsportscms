import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Determines the content status based on availability and publish date
 * @param available - Whether the content is marked as available
 * @param publishDate - The scheduled publish date (optional)
 * @returns "Active" | "Inactive" | "Publishing"
 */
export function getContentStatus(available: boolean, publishDate?: string | Date): "Active" | "Inactive" | "Publishing" {
  // If available is true, the content is active
  if (available) {
    return "Active";
  }
  
  // If available is false and there's a publish date in the future, it's publishing
  if (!available && publishDate) {
    const pubDate = typeof publishDate === 'string' ? new Date(publishDate) : publishDate;
    const now = new Date();
    
    if (pubDate > now) {
      return "Publishing";
    }
  }
  
  // Otherwise, it's inactive
  return "Inactive";
}

/**
 * Gets the badge variant for a content status
 * @param status - The content status
 * @returns The appropriate badge variant
 */
export function getStatusBadgeVariant(status: "Active" | "Inactive" | "Publishing"): "default" | "outline" | "secondary" {
  switch (status) {
    case "Active":
      return "default";
    case "Publishing":
      return "secondary";
    case "Inactive":
      return "outline";
    default:
      return "outline";
  }
}
