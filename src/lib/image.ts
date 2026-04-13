import type { CardImageNode, CardImageSize } from '$lib/types';

const EXCLUDED_IMAGE_SIZE_NAMES = new Set(['thumbnail']);
const PREFERRED_IMAGE_SIZE_ORDER = ['medium_large', 'large', 'medium'];

export const CARD_GRID_IMAGE_SIZES =
	'(max-width: 768px) calc(100vw - 2rem), (max-width: 1024px) calc(50vw - 2rem), 320px';
export const CARD_DETAIL_IMAGE_SIZES = '(max-width: 768px) calc(100vw - 2rem), 360px';

export interface ResponsiveImageAsset {
	src: string;
	srcSet?: string;
	width?: number;
	height?: number;
}

function toNumber(value: string | number | undefined | null) {
	if (typeof value === 'number') {
		return Number.isFinite(value) ? value : undefined;
	}

	if (typeof value === 'string' && value.trim()) {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : undefined;
	}

	return undefined;
}

function normalizeSize(size: CardImageSize) {
	const width = toNumber(size.width);
	const height = toNumber(size.height);

	if (!size.sourceUrl || !width || !height || EXCLUDED_IMAGE_SIZE_NAMES.has(size.name)) {
		return null;
	}

	return {
		name: size.name,
		sourceUrl: size.sourceUrl,
		width,
		height
	};
}

export function getResponsiveImage(node?: CardImageNode): ResponsiveImageAsset | null {
	if (!node?.sourceUrl) {
		return null;
	}

	const normalizedSizes = (node.mediaDetails?.sizes ?? [])
		.map(normalizeSize)
		.filter((size): size is NonNullable<typeof size> => Boolean(size))
		.sort((a, b) => a.width - b.width);

	const preferredSize =
		PREFERRED_IMAGE_SIZE_ORDER.map((name) => normalizedSizes.find((size) => size.name === name)).find(
			Boolean
		) ?? normalizedSizes.at(-1);

	const srcSet = normalizedSizes.length
		? normalizedSizes.map((size) => `${size.sourceUrl} ${size.width}w`).join(', ')
		: undefined;

	return {
		src: preferredSize?.sourceUrl ?? node.sourceUrl,
		srcSet,
		width: preferredSize?.width ?? node.mediaDetails?.width,
		height: preferredSize?.height ?? node.mediaDetails?.height
	};
}
