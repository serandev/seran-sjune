import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// 프론트엔드 Firebase 설정 (VITE_ 접두사 필요)
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// 설정 확인 로그
console.log('Frontend Firebase config check:', {
    apiKey: firebaseConfig.apiKey ? 'SET' : 'MISSING',
    authDomain: firebaseConfig.authDomain ? 'SET' : 'MISSING',
    projectId: firebaseConfig.projectId ? 'SET' : 'MISSING',
});

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firestore 데이터베이스
export const db = getFirestore(app);

console.log('Frontend Firebase initialized successfully');