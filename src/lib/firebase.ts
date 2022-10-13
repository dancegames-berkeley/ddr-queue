import { base } from '$app/paths';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { uuid } from './uuid';
import { token } from './requests';

const firebaseConfig = {
	apiKey: 'AIzaSyCipMIrB4eZOTg4kX88Ke_uFynZwDVhomM',
	authDomain: 'ddr-queue.firebaseapp.com',
	databaseURL: 'https://ddr-queue-default-rtdb.firebaseio.com',
	projectId: 'ddr-queue',
	storageBucket: 'ddr-queue.appspot.com',
	messagingSenderId: '189054218363',
	appId: '1:189054218363:web:faa115905d02613e7972de',
	measurementId: 'G-SW71XGW0M4'
};

const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

navigator.serviceWorker.register(`${base}/firebase-messaging-sw.js`).then((registration) => {
    getToken(messaging, {
        vapidKey: 'BOFg_GZXkheciuX6MqSjd2vEoUG72BiYOpbP6z8J5kEwZoE7uu0DNGiHYII8HBjfYNM5NpJOQSGMS7Bzr8CQOk8',
        serviceWorkerRegistration: registration
    }).then((currentToken) => {
        if (currentToken) {
            console.log(currentToken)
            token(uuid, currentToken)
        } else {
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    console.log('permission granted');
                }
            });
        }
    });
}).catch(e => console.log(e));

type MessageHandler = (data: { [key: string]: string } | undefined) => void;

const subscriptions = new Set<MessageHandler>();

onMessage(messaging, (msg) => {
    subscriptions.forEach(h => h(msg.data));

    if (msg.notification) {
        new Notification(msg.notification.title || 'DDR Queue', { body: msg.notification.body })
    }
});

export const Firebase = {
    onMessage(handler: MessageHandler) {
        subscriptions.add(handler);

        return () => {
            subscriptions.delete(handler);
        }
    }
};