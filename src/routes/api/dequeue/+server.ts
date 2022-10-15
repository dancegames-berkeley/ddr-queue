import { SECRET_API_KEY } from '$env/static/private'

import { error } from '@sveltejs/kit'
import type { RequestHandler } from '@sveltejs/kit'
import { dequeue } from '$lib/server/queue'
import { broadcastUpdate, notifyNext } from '$lib/server/firebase'
import { getToken } from '$lib/server/token'

export const POST: RequestHandler = async ({ request }) => {
    let json;

    try {
        json = await request.json()
    } catch {
        throw error(400, 'Malformed request')
    }

    const key = json.key

    if (key !== SECRET_API_KEY) {
        throw error(401, 'Unauthorized')
    }

    const next = dequeue()

    if (!next) {
        return new Response('Queue empty')
    }

    const token = getToken(next)

    if (token) {
        notifyNext(token)
    }

    broadcastUpdate()

    return new Response('OK')
}
