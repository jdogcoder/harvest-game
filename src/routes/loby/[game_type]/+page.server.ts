import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {

    const gameType = params.game_type;

    return {
        gameType: gameType
    };
}) satisfies PageServerLoad;