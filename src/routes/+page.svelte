<script lang="ts">
	import { goto } from '$app/navigation';

	function joinExistingGame() {
		goto('/lobby/existing');
	}

	function hostGame() {
		goto('/lobby/new');
	}
</script>

<div class="box">
	<h1 class="title">Harvest Hackathon Game</h1>

	<div class="field is-grouped">
		<p class="control">
			<button class="is-dark button is-outlined is-rounded" on:click={joinExistingGame}>
				<span class="icon is-small">
					<i class="fas fa-house-signal" />
				</span>
				<span>Join an existing game.</span>
			</button>
		</p>

		<p class="control">
			<button class="is-black button is-outlined is-rounded" on:click={hostGame}>
				<span class="icon is-small">
					<i class="fas fa-house-chimney-medical" />
				</span>
				<span>Host a new game.</span>
			</button>
		</p>
	</div>
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
