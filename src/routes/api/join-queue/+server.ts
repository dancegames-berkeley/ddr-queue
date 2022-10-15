import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";

import { validate_uuid } from "$lib/server/util";
import { getQueueInfo, joinQueue } from "$lib/server/queue";

export const POST: RequestHandler = async ({ request }) => {
    let data;

    try { 
        data = await request.json();
    } catch {
        throw error(400, 'Malformed input');
    }

    const uuid = data.uuid;

    if (!validate_uuid(uuid)) {
        throw error(400, 'Invalid uuid');
    }

    joinQueue(uuid);

    return json(getQueueInfo(uuid));
};