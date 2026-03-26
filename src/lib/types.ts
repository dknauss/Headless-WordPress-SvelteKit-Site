export interface Card {
  id?: string;
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  date?: string;
  rating?: number;
  featuredImage?: {
    node?: {
      sourceUrl: string;
    };
  };
  categories?: {
    nodes?: Array<{
      name: string;
      slug?: string;
    }>;
  };
}

// Response from WordPress when fetching all cards
export interface CardsResponse {
  posts: {
    nodes: Card[];
  };
}
