import { app, apps } from "firebase-admin";
import { initializeApp } from 'firebase-admin/app'
import { getMessaging, type Message } from 'firebase-admin/messaging'

const firebaseConfig = {
    apiKey: 'AIzaSyCipMIrB4eZOTg4kX88Ke_uFynZwDVhomM',
    authDomain: 'ddr-queue.firebaseapp.com',
    databaseURL: 'https://ddr-queue-default-rtdb.firebaseio.com',
    projectId: 'ddr-queue',
    storageBucket: 'ddr-queue.appspot.com',
    messagingSenderId: '189054218363',
    appId: '1:189054218363:web:faa115905d02613e7972de',
    measurementId: 'G-SW71XGW0M4',
}

if (apps.length === 0) {
    initializeApp(firebaseConfig);
}

export function subscribeToUpdate(token: string) {
    getMessaging().subscribeToTopic([token], 'update')
}

export function broadcastUpdate() {
    const message: Message = {
        data: { action: 'update' },
        topic: 'update',
    }

    getMessaging().send(message)
}

export function notifyNext(token: string) {
    const message: Message = {
        notification: {
            title: 'DDR Queue',
            body: 'It is your turn!'
        },
        token: token
    };

    getMessaging().send(message);
}