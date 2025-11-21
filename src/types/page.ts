export type PageName = 
  | "home"
  | "content"
  | "news"
  | "article details"
  | "agent details"
  | "group details";

export interface PageShelf {
  id: string;
  shelfId: string;
  shelfTitle: string;
  order: number;
}

export interface Page {
  id: string;
  name: PageName;
  shelves: PageShelf[];
  createdAt: Date;
  updatedAt: Date;
}
