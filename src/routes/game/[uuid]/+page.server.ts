import {
	FIREBASE_DATABASE_URL,
	FIREBASE_PROJECT_ID,
	FIREBASE_PRIVATE_KEY_ID,
	FIREBASE_CLIENT_ID,
	FIREBASE_CLIENT_CERT_URL,
	FIREBASE_PRIVATE_KEY,
	FIREBASE_CLIENT_EMAIL
} from '$env/static/private';

import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {

	const gameUuid = params.uuid;

	return {
		// See: https://firebase.google.com/docs/web/learn-more#config-object
		firebaseConfig: {
			databaseURL: FIREBASE_DATABASE_URL,
			type: 'service_account',
			project_id: FIREBASE_PROJECT_ID,
			private_key_id: FIREBASE_PRIVATE_KEY_ID,
			private_key: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
			client_email: FIREBASE_CLIENT_EMAIL,
			client_id: FIREBASE_CLIENT_ID,
			auth_uri: 'https://accounts.google.com/o/oauth2/auth',
			token_uri: 'https://oauth2.googleapis.com/token',
			auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
			client_x509_cert_url: FIREBASE_CLIENT_CERT_URL,
			universe_domain: 'googleapis.com'
		},
		gameUuid: gameUuid
	};
}) satisfies PageServerLoad;
