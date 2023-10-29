<script>
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';

	inject({ mode: dev ? 'development' : 'production' });

	import '../global.css';
</script>

<svelte:head>
	<title>Harvest Hackathon Game</title>
</svelte:head>

<main>
	<slot />
</main>

<style>
	main {
		max-width: 100ch;
		margin: 0 auto;
		padding: 1rem;
	}

	main > :global(* + *),
	:global(.flow > * + *) {
		margin-top: var(--flow-space, 1em);
	}
</style>