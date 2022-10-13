importScripts('https://www.gstatic.com/firebasejs/9.11.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.11.0/firebase-messaging-compat.js');

const firebaseApp = firebase.initializeApp({
	apiKey: 'AIzaSyCipMIrB4eZOTg4kX88Ke_uFynZwDVhomM',
	authDomain: 'ddr-queue.firebaseapp.com',
	databaseURL: 'https://ddr-queue-default-rtdb.firebaseio.com',
	projectId: 'ddr-queue',
	storageBucket: 'ddr-queue.appspot.com',
	messagingSenderId: '189054218363',
	appId: '1:189054218363:web:faa115905d02613e7972de',
	measurementId: 'G-SW71XGW0M4'
});

const messaging = firebase.messaging(firebaseApp);