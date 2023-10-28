<!-- Hello world -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { initializeApp } from 'firebase/app';

	import { getDatabase, ref, update, get, onValue } from 'firebase/database';

	// TODO: Replace the following with your app's Firebase project configuration
	// See: https://firebase.google.com/docs/web/learn-more#config-object
	const firebaseConfig = {
		databaseURL: 'https://harvest-hackathon-default-rtdb.firebaseio.com/',

		type: 'service_account',
		project_id: 'harvest-hackathon',
		private_key_id: 'cdab07eaa2cbfaed410aafbd27cf2e83b619d370',
		private_key:
			'-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCWscVmPwBcUzCh\nYbpMos1AZgoyBgQiAB6rM3nOCvCuZM70tfZUtvRAQgBhwtNq3l1qHsDVt1akV64c\nQCzw/hLiNu9Qb3PyyQAdeity8hNUb9iQB2yWg4dTlHm5vOLvlGcNT0wYysC1PMc9\nmuPBissV4RhoWUmyI9LRT5m002K0gmYOxqkvVvdL9Gfun6wUEIQYH/XsOgYPRMmn\nhTNKC3b56MGjKNGbwOJYlwWviFDvCJpRrVeiBwi0VMX425ktzFdRtNQown1CVBZ9\nchzCgmcxL+Pv0mPIbymPbGcCKI6q8qXkTnk8/4acKgYJk1J1yAtx1QQoaFUMN9KR\nBlu34q8jAgMBAAECggEAHwnFkU43qkx+Lzc8Uo2TvghmYDBKCKDCsFt9YplxQlJE\nKDYUYxV90IBnqLsipZfgYLut1zcYcugWVf5H42lJhWtwNj6GgMKysd+YdGf04Ebb\nMas9y/CSXn4t5jpH+bW01hJ3p4GXWJ0IoqE0+Qe31a1TxCZj3fuv7+m3zH1fjrMd\n/pyTTHmUCap4QD5OpCwbLk49WalEuTxe0QyDwH1U6DrWj/ECBiKodeB/VW7YJmc7\n263Bfc+/C7feSJozbqXmFbWTYVO30qlnJCXLtuhknID9ILdgpkuVQCBlsRXoCAAn\ntV0FzC9bqxBKRcZSR8ek8JpIbVUpoB/lgFcYOyZfIQKBgQDPj2KOxPQCwACohcV6\n0j257Mi0TBKdaZ2pLqFmSKanIX4LSByJY95po/GQwpaaZGlc2Hj/jUNJZ1wnWZ55\nhG2og8Jg0t4LWFHxNwO5FOVqxq6w9A5ZS7gi7jOAIamPW5R5n1Bq0bKSWrTQ7zT1\n5C4ckRjStVFPf9PUF3tz1vVaoQKBgQC53PaemeV4/n3VfYhZ0HboIFVH8V6eR7xs\ncqTg4+bKfJB5yRAh9ol8Tu/8R9S2wUDMcXvIQhsJZdrfdGWfeFbAQoDbiA2YqXm2\n8eLY1L7gT884DX9+h/nNERqZYGKauJeOqPGEcb7rAv9GuGcae6j/J5p2laSAe+jX\ni2MMoNeXQwKBgEPJtIqkUH1Fb/GaHvEKERbT+ojH/5xhjhhfHl9lgug6zAurNYa5\nkz41SQPaSY2LFc449Ouhm0Qx+arwXg2Z7qaGwckVlWdnJPv+17xu0q6YzR0F2FnZ\nnP3rhe5nEBW99zPxkDYS3ptl/H/wX/+e0mCKEu1eQnwQZ4JxWORwZBmBAoGAYsT8\nvd3Up06+ehRiwC/a8JI2H6wx9vTyOcNWwTf7LoGxmTZy/0lvWILuX2egr5nVII/y\nEsKmcYESJgtJ8cvWdgchSQhtCUKOrtyuC0JLSRLAcO4jYY9K/WHoe7dPzx7nU2WO\nKy7zIRqPo/pcuCMc9LMMD5aIO8sdOmYVNeHHj9cCgYEAtHWPZ8rofC/Cs0v6s/cX\nW6qXx+Je+1iH5sFvaohxgneQ0C4chtBI2fSntvJ0A4LB2pbq9WOYNZ53RBbwewSo\nwk2rCpyuPAjBtbWzIGfgOoQRDfQK4jrbMcuxjjIH9JSqnyGth2xzJEfVGEDo2Gqw\n36XAbeHQ+6c4wsbCGZgU6ig=\n-----END PRIVATE KEY-----\n',
		client_email: 'firebase-adminsdk-786st@harvest-hackathon.iam.gserviceaccount.com',
		client_id: '111876862146970250925',
		auth_uri: 'https://accounts.google.com/o/oauth2/auth',
		token_uri: 'https://oauth2.googleapis.com/token',
		auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
		client_x509_cert_url:
			'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-786st%40harvest-hackathon.iam.gserviceaccount.com',
		universe_domain: 'googleapis.com'
	};

	// Initialize Firebase
	const app = initializeApp(firebaseConfig);

	// Initialize Realtime Database and get a reference to the service
	const db = getDatabase(app);

    let currentHand = ""
    let otherHand = ""

    let gameTimer = 0

	onMount(async () => {
        let gameState = (await get(ref(db, '/'))).val()

        console.log("lastactive", gameState.leftHand.sessionLastActive)
        console.log( new Date(Date.now() - 5000))
        currentHand = (new Date(gameState.leftHand.sessionLastActive) > new Date(Date.now() - 5000)) ? "rightHand" : "leftHand"
        otherHand = (currentHand == "leftHand") ? "rightHand" : "leftHand"

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
            })
        }, 500)

        setInterval(() => {

            // check if hands are touching
            let leftHand = document.getElementById("leftHand");
            let rightHand = document.getElementById("rightHand");

            let leftHandX = parseInt(leftHand!.style.left.replace("px", ""))
            let leftHandY = parseInt(leftHand!.style.top.replace("px", ""))

            let rightHandX = parseInt(rightHand!.style.left.replace("px", ""))
            let rightHandY = parseInt(rightHand!.style.top.replace("px", ""))

            let distance = Math.sqrt(Math.pow(leftHandX - rightHandX, 2) + Math.pow(leftHandY - rightHandY, 2))

            if (leftHandX + 25 > rightHandX - 25 && leftHandX - 25 < rightHandX + 25 && leftHandY + 25 > rightHandY - 25 && leftHandY - 25 < rightHandY + 25) {
                gameTimer += 1
                update(ref(db, '/'), {
                    timer: gameTimer
                })
            } else { gameTimer = 0 }

        }, 500)
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
