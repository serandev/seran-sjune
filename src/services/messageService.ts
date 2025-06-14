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
import { User } from '../types/api';
import { emailService } from './emailService';

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

export interface CreateMessageData {
    userNickname: string;
    userId: string;
    content: string;
}

// 기본 사용자 정보 (사용자를 찾을 수 없을 때 사용)
const DEFAULT_USER = {
    nickname: '알 수 없는 사용자',
    profileImageUrl: 'https://via.placeholder.com/40?text=?'
};

/**
 * 사용자 정보를 조회하는 함수
 */
const getUserById = async (userId: string): Promise<{ nickname: string; profileImageUrl: string }> => {
    try {
        console.log('Looking for user ID:', userId);

        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);

        console.log('userDoc exists:', userDoc.exists());

        if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            console.log('User data:', userData);

            return {
                nickname: userData.nickname,
                profileImageUrl: userData.profileImageUrl
            };
        } else {
            console.warn(`User document not found for userId: ${userId}`);
            return DEFAULT_USER;
        }
    } catch (error) {
        console.error(`Error fetching user ${userId}:`, error);
        return DEFAULT_USER;
    }
};

/**
 * 메시지 데이터를 MessageWithUser 형태로 변환하는 함수
 */
const convertToMessageWithUser = async (messageDoc: any): Promise<MessageWithUser> => {
    const messageData = messageDoc.data() as Message;
    const user = await getUserById(messageData.userId);

    return {
        id: messageDoc.id,
        userId: messageData.userId,
        content: messageData.content,
        createdAt: messageData.createdAt,
        user
    };
};

/**
 * 메시지 추가 (이메일 알림 포함)
 */
export const addMessage = async (messageData: CreateMessageData): Promise<string> => {
    try {
        // 1. Firestore에 메시지 저장
        const docRef = await addDoc(collection(db, 'messages'), {
            userId: messageData.userId,
            content: messageData.content,
            ipAddress: 'unknown', // 필요시 실제 IP 주소 수집 로직 추가
            createdAt: Timestamp.now()
        });

        console.log('메시지 저장 성공:', docRef.id);

        // 2. 백그라운드에서 이메일 알림 발송
        emailService.sendEmailNotification({
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

/**
 * 메시지 목록 조회 (사용자 정보 포함)
 */
export const getMessages = async (): Promise<MessageWithUser[]> => {
    try {
        const q = query(
            collection(db, 'messages'),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);

        const messagesWithUsers: MessageWithUser[] = [];

        // 각 메시지에 대해 사용자 정보 조회 (순차적으로 처리)
        for (const messageDoc of querySnapshot.docs) {
            const messageWithUser = await convertToMessageWithUser(messageDoc);
            messagesWithUsers.push(messageWithUser);
        }

        return messagesWithUsers;
    } catch (error) {
        console.error('Error getting messages:', error);
        throw error;
    }
};

/**
 * 실시간으로 메시지 감시 (사용자 정보 포함)
 */
export const subscribeToMessages = (callback: (messages: MessageWithUser[]) => void) => {
    const q = query(
        collection(db, 'messages'),
        orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, async (querySnapshot) => {
        try {
            const messagesWithUsers: MessageWithUser[] = [];

            // 각 메시지에 대해 사용자 정보 조회 (순차적으로 처리)
            for (const messageDoc of querySnapshot.docs) {
                try {
                    const messageWithUser = await convertToMessageWithUser(messageDoc);
                    messagesWithUsers.push(messageWithUser);
                } catch (userError) {
                    console.error(`Error processing message ${messageDoc.id}:`, userError);
                    // 에러가 발생한 메시지는 건너뛰고 계속 진행
                }
            }

            callback(messagesWithUsers);
        } catch (error) {
            console.error('Error in message subscription:', error);
            // 에러가 발생해도 빈 배열로 콜백 호출
            callback([]);
        }
    });
};
