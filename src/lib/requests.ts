import { base } from '$app/paths';

export async function token(uuid: string, token: string) {
    await fetch(`${base}/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'uuid': uuid, 'token': token })
    })
}

export async function queueInfo(uuid: string | undefined = undefined) {
    let url = `${base}/queue-info`;

    if (uuid) url += `/${uuid}`;

    const response = await fetch(url);
    const json = await response.json();

    return {
        queueSize: json['queue_size'],
        posInQueue: json['pos_in_queue']
    }
}

export async function joinQueue(uuid: string) {
    const response = await fetch(`${base}/join-queue`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'uuid': uuid })
    });

    const json = await response.json();

    return {
        queueSize: json['queue_size'],
        posInQueue: json['pos_in_queue']
    }
}