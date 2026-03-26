<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<style>
	:global(:root) {
		--color-hero-red: #ef4444;
		--color-hero-blue: #2563eb;
		--color-hero-yellow: #fbbf24;
		--color-hero-black: #1a1a1a;
		--color-hero-white: #ffffff;
		--comic-border: 4px solid var(--color-hero-black);
		--comic-shadow: 6px 6px 0px var(--color-hero-black);
		--font-heading: "Bangers", system-ui, sans-serif;
		--font-body: "Inter", system-ui, sans-serif;
		--font-comic-text: var(--font-body);
	}

	:global(body) {
		margin: 0;
		padding: 0;
		font-family: var(--font-body);
		background-color: #f0f0f0;
		background-image: radial-gradient(
			var(--color-hero-black) 0.5px,
			transparent 0.5px
		);
		background-size: 20px 20px;
		background-attachment: local;
		color: var(--color-hero-black);
		-webkit-overflow-scrolling: touch;
	}

	:global(h1, h2, h3) {
		font-family: var(--font-heading);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
</style>
