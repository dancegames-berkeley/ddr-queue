import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";

import { getQueueInfo } from "$lib/server/queue";

export const GET: RequestHandler = ({ params }) => {
    const uuid = params.slug;

    return json(getQueueInfo(uuid));
}