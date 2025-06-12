import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    collection,
    doc,
    getDoc,
    setDoc
} from 'firebase/firestore';

// Firebase 설정 디버깅
console.log('Firebase config check:', {
    apiKey: process.env.FIREBASE_API_KEY ? 'SET' : 'MISSING',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN ? 'SET' : 'MISSING',
    projectId: process.env.FIREBASE_PROJECT_ID ? 'SET' : 'MISSING',
});

// Firebase 설정
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

// Firebase 초기화 확인
let app;
let db;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization failed:', error);
}

interface KakaoTokenRequest {
    kakaoToken: string;
}

interface KakaoUserResponse {
    id: number;
    properties: {
        nickname: string;
        profile_image: string;
    };
}

interface User {
    id?: string;
    nickname: string;
    profileImageUrl: string;
}

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
};

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod === 'POST') {
        try {
            console.log('Auth-kakao function called');

            if (!db) {
                throw new Error('Firebase not initialized');
            }

            if (!event.body) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Request body is required' })
                };
            }

            const { kakaoToken }: KakaoTokenRequest = JSON.parse(event.body);
            console.log('Kakao token received, length:', kakaoToken?.length);

            // 카카오 API로 사용자 정보 조회
            const kakaoResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
                headers: {
                    'Authorization': `Bearer ${kakaoToken}`
                }
            });

            if (!kakaoResponse.ok) {
                console.error('Kakao API error:', kakaoResponse.status, kakaoResponse.statusText);
                throw new Error('Failed to fetch user info from Kakao');
            }

            const kakaoUser: KakaoUserResponse = await kakaoResponse.json();
            console.log('Kakao user info:', { id: kakaoUser.id, nickname: kakaoUser.properties?.nickname });

            const userId = kakaoUser.id.toString();

            // Firebase에서 사용자 확인
            console.log('Checking user in Firebase:', userId);
            const userDocRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userDocRef);

            let user: User;

            if (userDoc.exists()) {
                console.log('Existing user found');
                user = {
                    id: userId,
                    ...userDoc.data()
                } as User;
            } else {
                console.log('Creating new user');
                user = {
                    id: userId,
                    nickname: kakaoUser.properties.nickname,
                    profileImageUrl: kakaoUser.properties.profile_image
                };

                await setDoc(userDocRef, {
                    nickname: user.nickname,
                    profileImageUrl: user.profileImageUrl
                });
                console.log('New user created successfully');
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, user })
            };

        } catch (error) {
            console.error('Error in auth-kakao:', error);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: error instanceof Error ? error.message : 'Authentication failed'
                })
            };
        }
    }

    return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' })
    };
};
