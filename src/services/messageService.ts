import {
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    query,
    orderBy,
    Timestamp,
    onSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import emailjs from '@emailjs/browser';

export interface User {
    id?: string;
    nickname: string;
    profileImageUrl: string;
}

export interface Message {
    id?: string;
    userId: string;
    content: string;
    ipAddress: string;
    createdAt: Timestamp;
}

export interface MessageWithUser {
    id: string;
    userId: string;
    content: string;
    createdAt: Timestamp;
    user: {
        nickname: string;
        profileImageUrl: string;
    };
}

// 1. EmailJS 설치 필요
// npm install @emailjs/browser


// EmailJS 초기화 (환경변수로 관리 권장)
const EMAILJS_SERVICE_ID = 'serandev';
const EMAILJS_TEMPLATE_ID = 'template_n1ljggs';
const EMAILJS_PUBLIC_KEY = 'ka2sSAy8mlzQd8IuG';

// 이메일 알림 발송 함수
const sendEmailNotification = async (messageData: {
    userNickname: string;
    userId: string;
    content: string;
    messageId: string;
}) => {
    try {
        const templateParams = {
            title: '세란 선준 웨딩 알림',
            name: messageData.userNickname,
            message: messageData.content,
            site_url: window.location.origin
        };

        await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams,
            EMAILJS_PUBLIC_KEY
        );
    } catch (error) {
        console.error('이메일 발송 실패:', error);
    }
};

// 메시지 추가 (이메일 알림 포함)
export const addMessage = async (messageData: {
    userNickname: string;
    userId: string;
    content: string;
}): Promise<string> => {
    try {
        // 1. Firestore에 메시지 저장
        const docRef = await addDoc(collection(db, 'messages'), {
            ...messageData,
            ipAddress: 'unknown',
            createdAt: Timestamp.now()
        });

        console.log('메시지 저장 성공:', docRef.id);

        // 2. 이메일 알림 발송 (비동기로 실행, 실패해도 메시지 저장에 영향 없음)
        sendEmailNotification({
            ...messageData,
            messageId: docRef.id
        }).catch(error => {
            console.error('이메일 알림 발송 중 오류:', error);
        });

        return docRef.id;
    } catch (error) {
        console.error('Error adding message:', error);
        throw error;
    }
};

// 사용 예시
export const handleMessageSubmit = async (userNickname: string, userId: string, content: string) => {
    try {
        const messageId = await addMessage({ userNickname, userId, content });
        console.log('메시지가 성공적으로 저장되었습니다:', messageId);
        // 이메일은 백그라운드에서 발송됨
        return messageId;
    } catch (error) {
        console.error('메시지 저장 실패:', error);
        throw error;
    }
};

// 메시지 목록 조회 (사용자 정보 포함)
export const getMessages = async (): Promise<MessageWithUser[]> => {
    try {
        const q = query(
            collection(db, 'messages'),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);

        const messagesWithUsers: MessageWithUser[] = [];

        // 각 메시지에 대해 사용자 정보 조회
        for (const messageDoc of querySnapshot.docs) {
            const messageData = messageDoc.data() as Message;

            try {
                console.log('Looking for user ID:', messageData.userId);

                // 사용자 정보 조회
                const userDocRef = doc(db, 'users', messageData.userId);
                const userDoc = await getDoc(userDocRef);

                console.log('userDoc exists:', userDoc.exists());

                if (userDoc.exists()) {
                    const userData = userDoc.data() as User;
                    console.log('User data:', userData);

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
                } else {
                    console.warn(`User document not found for userId: ${messageData.userId}`);
                    // 사용자 정보가 없는 경우 기본값으로 메시지 표시
                    messagesWithUsers.push({
                        id: messageDoc.id,
                        userId: messageData.userId,
                        content: messageData.content,
                        createdAt: messageData.createdAt,
                        user: {
                            nickname: '알 수 없는 사용자',
                            profileImageUrl: 'https://via.placeholder.com/40?text=?'
                        }
                    });
                }
            } catch (userError) {
                console.error(`Error fetching user ${messageData.userId}:`, userError);
                // 에러 발생 시에도 기본값으로 메시지 표시
                messagesWithUsers.push({
                    id: messageDoc.id,
                    userId: messageData.userId,
                    content: messageData.content,
                    createdAt: messageData.createdAt,
                    user: {
                        nickname: '알 수 없는 사용자',
                        profileImageUrl: 'https://via.placeholder.com/40?text=?'
                    }
                });
            }
        }

        return messagesWithUsers;
    } catch (error) {
        console.error('Error getting messages:', error);
        throw error;
    }
};

// 실시간으로 메시지 감시 (사용자 정보 포함)
export const subscribeToMessages = (callback: (messages: MessageWithUser[]) => void) => {
    const q = query(
        collection(db, 'messages'),
        orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, async (querySnapshot) => {
        const messagesWithUsers: MessageWithUser[] = [];

        // 각 메시지에 대해 사용자 정보 조회
        for (const messageDoc of querySnapshot.docs) {
            const messageData = messageDoc.data() as Message;

            try {
                // 사용자 정보 조회
                const userDocRef = doc(db, 'users', messageData.userId);
                const userDoc = await getDoc(userDocRef);

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
                } else {
                    console.warn(`User not found for userId: ${messageData.userId}`);
                }
            } catch (userError) {
                console.error(`Error fetching user data for ${messageData.userId}:`, userError);
            }
        }

        callback(messagesWithUsers);
    });
};
