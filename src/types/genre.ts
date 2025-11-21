// Genre types for different entities in the platform
export type GenreType = "content" | "live" | "collection" | "agent" | "group" | "news"

export interface Genre {
  id: string
  name: string
  type: GenreType
  createdAt?: string
  updatedAt?: string
}

// Helper function to get human-readable type name
export function getGenreTypeName(type: GenreType): string {
  const typeNames: Record<GenreType, string> = {
    content: "Content",
    live: "Live",
    collection: "Collection",
    agent: "Agent",
    group: "Group",
    news: "News"
  }
  return typeNames[type]
}
