import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    query,
    orderBy,
    Timestamp
} from 'firebase/firestore';

// Firebase 설정
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface Message {
    id?: string;
    userId: string;
    content: string;
    ipAddress: string;
    createdAt: any;
}

interface User {
    id?: string;
    nickname: string;
    profileImageUrl: string;
}

interface MessageWithUser {
    id: string;
    userId: string;
    content: string;
    createdAt: any;
    user: {
        nickname: string;
        profileImageUrl: string;
    };
}

interface CreateMessageRequest {
    userId: string;
    content: string;
}

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
};

// IP 주소 추출 함수
const getClientIP = (event: HandlerEvent): string => {
    return event.headers['x-forwarded-for']?.split(',')[0] ||
        event.headers['x-real-ip'] ||
        'unknown';
};

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod === 'GET') {
        try {
            // 메시지 목록 조회 (최신순)
            const messagesQuery = query(
                collection(db, 'messages'),
                orderBy('createdAt', 'desc')
            );
            const messagesSnapshot = await getDocs(messagesQuery);

            const messagesWithUsers: MessageWithUser[] = [];

            // 각 메시지에 대해 사용자 정보 조회
            for (const messageDoc of messagesSnapshot.docs) {
                const messageData = messageDoc.data() as Message;

                // 사용자 정보 조회
                const userDoc = await getDoc(doc(db, 'users', messageData.userId));

                if (userDoc.exists()) {
                    const userData = userDoc.data() as User;

                    messagesWithUsers.push({
                        id: messageDoc.id,
                        userId: messageData.userId,
                        content: messageData.content,
                        createdAt: messageData.createdAt,
                        user: {
                            nickname: userData.nickname,
                            profileImageUrl: userData.profileImageUrl
                        }
                    });
                }
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(messagesWithUsers)
            };
        } catch (error) {
            console.error('Error fetching messages:', error);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: error instanceof Error ? error.message : 'Failed to fetch messages'
                })
            };
        }
    }

    if (event.httpMethod === 'POST') {
        try {
            if (!event.body) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Request body is required' })
                };
            }

            const { userId, content }: CreateMessageRequest = JSON.parse(event.body);

            if (!content || content.trim().length === 0) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Content is required' })
                };
            }

            if (!userId) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'User ID is required' })
                };
            }

            // 사용자 존재 확인
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (!userDoc.exists()) {
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({ error: 'User not found' })
                };
            }

            const userData = userDoc.data() as User;
            const clientIP = getClientIP(event);

            // 메시지 저장
            const messageData: Omit<Message, 'id'> = {
                userId,
                content: content.trim(),
                ipAddress: clientIP,
                createdAt: Timestamp.now()
            };

            const docRef = await addDoc(collection(db, 'messages'), messageData);

            // 생성된 메시지를 사용자 정보와 함께 반환
            const newMessageWithUser: MessageWithUser = {
                id: docRef.id,
                userId,
                content: content.trim(),
                createdAt: messageData.createdAt,
                user: {
                    nickname: userData.nickname,
                    profileImageUrl: userData.profileImageUrl
                }
            };

            return {
                statusCode: 201,
                headers,
                body: JSON.stringify(newMessageWithUser)
            };

        } catch (error) {
            console.error('Error creating message:', error);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: error instanceof Error ? error.message : 'Failed to create message'
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
