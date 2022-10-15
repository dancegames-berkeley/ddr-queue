import { error } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";

import { validate_uuid } from "$lib/server/util";
import { setToken } from "$lib/server/token";
import { subscribeToUpdate } from "$lib/server/firebase";

export const POST: RequestHandler = async ({ request }) => {
    let data; 
    
    try {
        data = await request.json();
    } catch {
        throw error(400, 'Malformed request');
    }

    const uuid = data.uuid;
    const token = data.token;

    if (!validate_uuid(uuid)) {
        throw error(400, 'Invalid uuid');
    }

    if (!token) {
        throw error(400, 'Invalid token');
    }

    subscribeToUpdate(token);
    setToken(uuid, token);

    return new Response('OK');
}