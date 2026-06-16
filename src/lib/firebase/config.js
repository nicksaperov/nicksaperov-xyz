import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCK2nTz6xHoaYPRUmUyFXpu7-l9u1Hilug",
    authDomain: "nicksaperov-portfolio-2026.firebaseapp.com",
    projectId: "nicksaperov-portfolio-2026",
    storageBucket: "nicksaperov-portfolio-2026.firebasestorage.app",
    messagingSenderId: "769848303631",
    appId: "1:769848303631:web:d58ca6fef3b687b520c37a"
};

// Initialize Firebase securely to prevent multiple instances during hot reloads
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };