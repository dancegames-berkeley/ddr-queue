export const inboundMessages: { [key: string]: () => object } = {
    queueInfo: () => new IMQueueInfo
};

export class InboundMessage {
    action: string;

    constructor(action: string) {
        this.action = action;
    }

    static decodeJson(msg: any) {
        return Object.assign(inboundMessages[msg.action](), msg) as InboundMessage;
    }
}

export class IMQueueInfo extends InboundMessage {
    queueSize!: number;
    posInQueue: number | undefined;

    constructor() { super("queueInfo"); }
}

export class OutboundMessage {
    action: string;

    constructor(action: string) {
        this.action = action;
    }

    sendTo(socket: WebSocket) {
        socket.send(JSON.stringify(this));
    }
}

class OMJoinQueue extends OutboundMessage {
    uuid: string;

    constructor(uuid: string) {
        super('joinQueue');
        this.uuid = uuid;
    }
}

class OMPing extends OutboundMessage {
    constructor() {
        super('ping');
    }
}

class OMQueueInfo extends OutboundMessage {
    uuid: string;

    constructor(uuid: string) {
        super('queueInfo');
        this.uuid = uuid;
    }
}

export const outboundMessages = {
    'joinQueue': (uuid: string) => new OMJoinQueue(uuid),
    "ping": () => new OMPing(),
    "queueInfo": (uuid: string) => new OMQueueInfo(uuid)
}