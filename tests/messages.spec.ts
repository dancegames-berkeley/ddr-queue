import { IMQueueInfo, InboundMessage } from '$lib/messages';
import { test, expect } from 'vitest';

test('InboundMessage.decodeJSON queueInfo', () => {
    const json = { 
        action: 'queueInfo',
        queueSize: 3,
        posInQueue: 1
    };

    const msg = InboundMessage.decodeJson(JSON.stringify(json)) as IMQueueInfo;

    expect(msg.action).toBe(json.action);
    expect(msg.queueSize).toBe(json.queueSize);
    expect(msg.posInQueue).toBe(json.posInQueue);
});

test('InboundMessage.decodeJSON invalid', () => {
    const json = {
        action: 'invalid'
    };

    const msg = InboundMessage.decodeJson(JSON.stringify(json));

    expect(msg).toBeFalsy();
})