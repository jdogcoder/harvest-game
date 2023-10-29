<script lang="ts">
	import { onMount } from 'svelte';
	import { initializeApp } from 'firebase/app';
	import { getDatabase, ref, update, get, onValue } from 'firebase/database';

	import type { PageData } from './$types';

	export let data: PageData;

	// Initialize Firebase
	const app = initializeApp(data.firebaseConfig);
	// Initialize Realtime Database and get a reference to the service
	const db = getDatabase(app);

	let gameUuid = data.gameUuid;

	// Set up important game variables.
	let currentHand = '';
	let otherHand = '';
	let gameTimer = 0;

	onMount(async () => {
		// Set the game state to the current state in the database if it exists, otherwise set it to the default state and then set that to the db.
		let gameState = (await get(ref(db, `/${gameUuid}/`))).val();

		if (!gameState) {
			gameState = {
				leftHand: {
					x: Math.floor(Math.random() * 1000),
					y: Math.floor(Math.random() * 1000),
					sessionLastActive: new Date()
				},
				rightHand: {
					x: Math.floor(Math.random() * 1000),
					y: Math.floor(Math.random() * 1000),
					sessionLastActive: new Date()
				},
				timer: 0
			};

			update(ref(db, `/${gameUuid}/`), gameState);
		}

		// Set the current hand to the one that was not last active, and the other hand to the one that was last active.
		currentHand =
			new Date(gameState.leftHand.sessionLastActive) > new Date(Date.now() - 5000)
				? 'rightHand'
				: 'leftHand';
		otherHand = currentHand == 'leftHand' ? 'rightHand' : 'leftHand';

		//  Add event listeners to the current hand.
		window.addEventListener('mousemove', (e) => {
			// Get the mouse position.
			const x = e.clientX;
			const y = e.clientY;

			// Update the database with the new mouse position.
			update(ref(db, currentHand), {
				x: x,
				y: y
			});
		});

		// Move the current hand to the position in the database.
		onValue(ref(db, currentHand), (snapshot) => {
			const data = snapshot.val();

			let hand = document.getElementById(currentHand);

			hand!.style.left = data.x - 50 + 'px';
			hand!.style.top = data.y - 50 + 'px';
		});

		// Move the other hand to the position in the database.
		onValue(ref(db, otherHand), (snapshot) => {
			const data = snapshot.val();

			let hand = document.getElementById(otherHand);

			hand!.style.left = data.x - 50 + 'px';
			hand!.style.top = data.y - 50 + 'px';
		});

		// Update the current hand in the database with sessionLastActive every 500ms.
		setInterval(() => {
			update(ref(db, currentHand), {
				sessionLastActive: new Date()
			});
		}, 500);

		// Update the game timer in the database based on if the hands are touching (checks every 500ms).
		setInterval(() => {
			// check if hands are touching
			let leftHand = document.getElementById('leftHand');
			let rightHand = document.getElementById('rightHand');

			let leftHandX = parseInt(leftHand!.style.left.replace('px', ''));
			let leftHandY = parseInt(leftHand!.style.top.replace('px', ''));

			let rightHandX = parseInt(rightHand!.style.left.replace('px', ''));
			let rightHandY = parseInt(rightHand!.style.top.replace('px', ''));

			// console.log("left hand", leftHandX, leftHandY);
			// console.log("right hand", rightHandX, rightHandY);

			if (leftHandX === rightHandX && leftHandY === rightHandY) {
				gameTimer += 1;
				update(ref(db, `/${gameUuid}/`), {
					timer: gameTimer
				});
			} else {
				gameTimer = 0;
				update(ref(db, `/${gameUuid}/`), {
					timer: gameTimer
				});
			}
		}, 500);

		// if both hands are inactive for more than 2 minutes, reset the game timer, and reset the hands to random positions. (checks every minute)
		setInterval(async () => {
			let leftHandLastActive = new Date((await get(ref(db, `/${gameUuid}/leftHand/sessionLastActive`))).val());
			let rightHandLastActive = new Date((await get(ref(db, `/${gameUuid}/rightHand/sessionLastActive`))).val());

			if (
				leftHandLastActive < new Date(Date.now() - 120000) &&
				rightHandLastActive < new Date(Date.now() - 120000)
			) {
				// reset the game timer
				gameTimer = 0;
				update(ref(db, `/${gameUuid}/`), {
					timer: gameTimer
				});

				// reset the hands to random positions
				update(ref(db, `/${gameUuid}/leftHand/`), {
					x: Math.floor(Math.random() * 1000),
					y: Math.floor(Math.random() * 1000)
				});
				update(ref(db, `/${gameUuid}/rightHand/`), {
					x: Math.floor(Math.random() * 1000),
					y: Math.floor(Math.random() * 1000)
				});
			}
		}, 60000);

		// once the game timer reaches 20, end the game.
		onValue(ref(db, `/${gameUuid}/timer`), (snapshot) => {
			const data = snapshot.val();

			if (data >= 20) {
				// redirect both players to the game over page
				window.location.href = '/gameover/' + gameUuid;
			}
		});
	});
</script>

<div class="box">
	<h1 class="title">Welcome to the Harvest Hackathon Game!</h1>
	<p>
		Link your hand with the hand of the other player, then dodge objects together for as long as
		possible!
	</p>

	<p>Timer {gameTimer}</p>
</div>
<!-- LEFT -->
<div id="leftHand">
	<img src="/left_hand.png" alt="Logo" width="100" height="100" />
</div>

<!-- RIGHT -->
<div id="rightHand">
	<img src="/right_hand.png" alt="Logo" width="100" height="100" />
</div>

<style>
	/* TODO: Add animation to make smoother */
	#leftHand {
		position: absolute;
		top: 0px;
		left: 0px;
	}

	/* TODO: Add animation to make smoother */
	#rightHand {
		position: absolute;
		top: 0px;
		left: 0px;
	}

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
		cursor: none;
	}
</style>
