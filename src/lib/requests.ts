import { base } from '$app/paths';

export async function token(uuid: string, token: string) {
    await fetch(`${base}/api/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'uuid': uuid, 'token': token })
    })
}

export async function queueInfo(uuid: string | undefined = undefined) {
    let url = `${base}/api/queue-info`;

    if (uuid) url += `/${uuid}`;

    const response = await fetch(url);
    const json = await response.json();

    return {
        queueSize: json.queueSize,
        posInQueue: json.posInQueue
    }
}

export async function joinQueue(uuid: string) {
    const response = await fetch(`${base}/api/join-queue`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'uuid': uuid })
    });

    const json = await response.json();

    return {
        queueSize: json.queueSize,
        posInQueue: json.posInQueue
    }
}