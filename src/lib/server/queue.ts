let counter = 0
const queue: string[] = []
const counters = new Map<string, number>()

/**
 * Enqueues player at the end of the queue
 *
 * @param   uuid  uuid of the player
 * @returns true  if successful
 *          false if the player is already in the queue
 */
export function joinQueue(uuid: string) {
    if (counters.has(uuid)) {
        return false
    }

    counter += 1
    queue.push(uuid)
    counters.set(uuid, counter)

    return true
}

/**
 * Dequeues next player from the queue
 *
 * @returns uuid of next player if queue is not empty,
 *          undefined           if queue is empty
 */
export function dequeue() {
    const next = queue.shift()

    if (!next) {
        return undefined;
    }

    counters.delete(next)

    return next;
}

/**
 * Returns the size of the queue
 *
 * @returns the size of the queue
 */
export function getQueueSize() {
    return queue.length
}

/**
 * Returns the position of the player in queue
 *
 * @param   uuid uuid of the player
 * @returns position of the queue if the player is in queue,
 *          undefined if player is not in queue
 */
export function getPosInQueue(uuid: string) {
    const cnt = counters.get(uuid)
    const next = queue.at(0)

    if (!cnt || !next) {
        return undefined
    }

    const nextCnt = counters.get(next)!!

    return cnt - nextCnt + 1
}

/**
 * Returns the queue info
 *
 * @param uuid uuid of the player
 */
export function getQueueInfo(uuid: string | undefined) {
    return {
        queueSize: getQueueSize(),
        posInQueue: uuid ? getPosInQueue(uuid) : undefined,
    }
}
