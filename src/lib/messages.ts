export const inboundMessages: { [key: string]: () => object } = {
    queueInfo: () => new IMQueueInfo,
    joinQueue: () => new IMJoinQueue
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

export class IMJoinQueue extends InboundMessage {
    success!: boolean;

    constructor() { super('joinQueue'); }
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

export class OMJoinQueue extends OutboundMessage {
    uuid: string;

    constructor(uuid: string) {
        super('joinQueue');
        this.uuid = uuid;
    }
}

export class OMPing extends OutboundMessage {
    constructor() {
        super('ping');
    }
}

export class OMQueueInfo extends OutboundMessage {
    uuid: string;

    constructor(uuid: string) {
        super('queueInfo');
        this.uuid = uuid;
    }
}

export class OMFCMKey extends OutboundMessage {
    uuid: string;
    key: string;

    constructor(uuid: string, key: string) {
        super('fcmkey');
        this.uuid = uuid;
        this.key = key;
    }
}