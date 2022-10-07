import type { IMQueueInfo, IMJoinQueue, InboundMessage, OutboundMessage } from './messages';
import { outboundMessages as om } from './messages';

const subscriptions = {
    all: new Set<(msg: string) => void>(),
    queueInfo: new Set<(msg: IMQueueInfo) => void>(),
    joinQueue: new Set<(msg: IMJoinQueue) => void>()
}

// TODO handle disconnect->reconnect logic with exponential timeout
function createWebsocket(url: string) {
    let socket: WebSocket | undefined;
    let openPromise: Promise<void> | undefined;
    let pingTimer: NodeJS.Timer | undefined;

    const messageHandlers: { [key: string]: (msg: InboundMessage) => void } = {
        queueInfo: msg => subscriptions.queueInfo.forEach(subscription => subscription(msg as IMQueueInfo)),
        joinQueue: msg => subscriptions.joinQueue.forEach(subscription => subscription(msg as IMJoinQueue))
    }

    function open() {
        if (openPromise || socket?.OPEN) return openPromise;

        socket = new WebSocket(url);

        socket.onmessage = event => {
            const msg = JSON.parse(event.data);
            subscriptions.all.forEach(s => s(msg));
            messageHandlers[msg.action]?.(msg);
        }

        socket.onclose = () => {
            clearInterval(pingTimer);
        };

        openPromise = new Promise((resolve, reject) => {
            socket!!.onerror = error => {
                reject(error);
                openPromise = undefined;
            };

            socket!!.onopen = event => {
                pingTimer = setInterval(() => {
                    om.ping().sendTo(socket!!);
                }, 60000);
                resolve();
                openPromise = undefined;
            }
        });

        return openPromise;
    }

    function close() {
        if (socket) socket.close();
        socket = undefined;
    }

    return {
        async send(message: OutboundMessage) {
            await open();
            if (socket) message.sendTo(socket);
        },
        subscribe(handler: (msg: string) => void) {
            subscriptions.all.add(handler);
            return () => {
                subscriptions.all.delete(handler);
            }
        },
        onQueueInfo(handler: (msg: IMQueueInfo) => void) {
            subscriptions.queueInfo.add(handler);
            return () => {
                subscriptions.queueInfo.delete(handler);
            }
        },
        onJoinQueue(handler: (msg: IMJoinQueue) => void) {
            subscriptions.joinQueue.add(handler);
            return () => {
                subscriptions.joinQueue.delete(handler);
            }
        }
    }
}

export const socket = createWebsocket("wss://75dz4fc17b.execute-api.us-west-1.amazonaws.com/production");