<!-- Hello world -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { initializeApp } from 'firebase/app';

	import { getDatabase, ref, update, get, onValue } from 'firebase/database';

	// See: https://firebase.google.com/docs/web/learn-more#config-object
	const firebaseConfig = {
		databaseURL: process.env.FIREBASE_DATABASE_URL!,
		type: 'service_account',
		project_id: process.env.FIREBASE_PROJECT_ID!,
		private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID!,
		private_key: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
		client_email: process.env.FIREBASE_CLIENT_EMAIL!,
		client_id: process.env.FIREBASE_CLIENT_ID!,
		auth_uri: 'https://accounts.google.com/o/oauth2/auth',
		token_uri: 'https://oauth2.googleapis.com/token',
		auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
		client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL!,
		universe_domain: 'googleapis.com'
	};

	// Initialize Firebase
	const app = initializeApp(firebaseConfig);

	// Initialize Realtime Database and get a reference to the service
	const db = getDatabase(app);

	let currentHand = '';
	let otherHand = '';

	let gameTimer = 0;

	onMount(async () => {
		let gameState = (await get(ref(db, '/'))).val();

		console.log('lastactive', gameState.leftHand.sessionLastActive);
		console.log(new Date(Date.now() - 5000));
		currentHand =
			new Date(gameState.leftHand.sessionLastActive) > new Date(Date.now() - 5000)
				? 'rightHand'
				: 'leftHand';
		otherHand = currentHand == 'leftHand' ? 'rightHand' : 'leftHand';

		window.addEventListener('mousemove', (e) => {
			const x = e.clientX;
			const y = e.clientY;

			update(ref(db, currentHand), {
				x: x,
				y: y
			});
		});

		onValue(ref(db, currentHand), (snapshot) => {
			const data = snapshot.val();

			let hand = document.getElementById(currentHand);

			hand!.style.left = data.x - 50 + 'px';
			hand!.style.top = data.y - 50 + 'px';
		});

		onValue(ref(db, otherHand), (snapshot) => {
			const data = snapshot.val();

			let hand = document.getElementById(otherHand);

			hand!.style.left = data.x - 50 + 'px';
			hand!.style.top = data.y - 50 + 'px';
		});

		setInterval(() => {
			update(ref(db, currentHand), {
				sessionLastActive: new Date()
			});
		}, 500);

		setInterval(() => {
			// check if hands are touching
			let leftHand = document.getElementById('leftHand');
			let rightHand = document.getElementById('rightHand');

			let leftHandX = parseInt(leftHand!.style.left.replace('px', ''));
			let leftHandY = parseInt(leftHand!.style.top.replace('px', ''));

			let rightHandX = parseInt(rightHand!.style.left.replace('px', ''));
			let rightHandY = parseInt(rightHand!.style.top.replace('px', ''));

			let distance = Math.sqrt(
				Math.pow(leftHandX - rightHandX, 2) + Math.pow(leftHandY - rightHandY, 2)
			);

			if (
				leftHandX + 25 > rightHandX - 25 &&
				leftHandX - 25 < rightHandX + 25 &&
				leftHandY + 25 > rightHandY - 25 &&
				leftHandY - 25 < rightHandY + 25
			) {
				gameTimer += 1;
				update(ref(db, '/'), {
					timer: gameTimer
				});
			} else {
				gameTimer = 0;
			}
		}, 500);
	});
</script>

<div class="box">
	<h1>Hello world</h1>

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

	#rightHand {
		position: absolute;
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
