export interface CardImageSize {
	name: string;
	sourceUrl: string;
	width?: string;
	height?: string;
}

export interface CardImageNode {
	sourceUrl: string;
	mediaDetails?: {
		width?: number;
		height?: number;
		sizes?: CardImageSize[];
	};
}

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
		node?: CardImageNode;
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

export interface SingleCardResponse {
	post: Card | null;
}
