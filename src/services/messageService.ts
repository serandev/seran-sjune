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

// 메시지 추가 (IP는 클라이언트에서 'unknown'으로 설정)
export const addMessage = async (messageData: {
    userId: string;
    content: string;
}): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, 'messages'), {
            ...messageData,
            ipAddress: 'unknown', // 클라이언트에서는 IP 추적 안함
            createdAt: Timestamp.now()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding message:', error);
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
