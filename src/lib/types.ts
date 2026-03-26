export interface Card {
	id: string;
	title: string;
	slug?: string;
	excerpt?: string;
	content?: string;
	date?: string;
	rating?: number;
	viewerHasVoted?: boolean;
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

export interface CardsResponse {
	posts: {
		nodes: Card[];
	};
}
