import { base } from '$app/paths';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { socket } from './websocket';
import { OMFCMKey } from './messages';
import { uuid } from './uuid';

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

export const messaging = getMessaging(app);

    getToken(messaging, {
        vapidKey: 'BOFg_GZXkheciuX6MqSjd2vEoUG72BiYOpbP6z8J5kEwZoE7uu0DNGiHYII8HBjfYNM5NpJOQSGMS7Bzr8CQOk8',
        // serviceWorkerRegistration: registration
    }).then((currentToken) => {
        if (currentToken) {
            // send key to server
            console.log(`currentToken: ${currentToken}`);
            socket.send(new OMFCMKey(uuid, currentToken));
        } else {
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    console.log('permission granted');
                }
            });
        }
    });

onMessage(messaging, (msg) => {
    console.log(msg.data);
});