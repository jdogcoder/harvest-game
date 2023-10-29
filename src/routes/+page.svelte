<script lang="ts">
	import { enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	const cities = data.visited.map((v) => v.city.split(', '));
	const countries = [...new Set(cities.map((c) => c[1]))].sort();
</script>

<div class="box">
	<h1 class="title">Harvest Hackathon Game</h1>

	{#if form?.signed}
		<!-- redirect to /game -->
		<!-- redirect to /game -->
		<script>
			import { goto } from '$app/navigation';
			goto('/game');
		</script>
	{:else}
		<p>Sign in to get started!</p>
		<div class="box">
			<form action="/" method="post" use:enhance>
				<label>
					Your name:
					<input type="text" name="name" required />
				</label>
				<label>
					Your Github Username:
					<input type="text" name="github-username" required />
				</label>
				<button>I was here</button>
			</form>
		</div>
	{/if}
</div>

<style>
	:global(body) {
		background-image: url('/backround.svg');
		background-repeat: no-repeat;
		background-position: center;
		background-attachment: fixed;
		min-height: 100vh;
		z-index: 0;
		width: 100%;
		height: 100%;
		background-size: cover;
	}
</style>
