import { Timestamp } from 'firebase/firestore';

export interface User {
    id?: string;
    nickname: string;
    profileImageUrl: string;
}

export interface Message {
    id?: string;
    userId: string;
    content: string;
    ipAddress: string; // 내부적으로만 사용, UI에 노출 안됨
    createdAt: Timestamp;
}

// UI에서 사용할 메시지 타입 (사용자 정보 포함)
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

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
