import React, { useEffect, useRef, useState } from 'react';
import { addMessage, getMessages, subscribeToMessages, MessageWithUser } from '../services/messageService';
import { api } from '../utils/api';
import { User } from '../types/api';
import { Timestamp } from 'firebase/firestore';
import CustomAlert from './CustomAlert';

// 보안 유틸리티 함수들
const sanitizeInput = (input: string): string => {
    return input
        .replace(/[<>]/g, '') // HTML 태그 제거
        .replace(/javascript:/gi, '') // javascript: 프로토콜 제거
        .replace(/on\w+=/gi, '') // 이벤트 핸들러 제거
        .trim();
};

const isValidMessage = (message: string): { valid: boolean; error?: string } => {
    const sanitized = sanitizeInput(message);

    if (!sanitized || sanitized.length < 2) {
        return { valid: false, error: '메시지는 최소 2글자 이상 입력해주세요.' };
    }

    if (sanitized.length > 500) {
        return { valid: false, error: '메시지는 500글자 이하로 입력해주세요.' };
    }

    // 반복 문자 체크 (같은 문자 10개 이상 연속)
    if (/(.)\1{9,}/.test(sanitized)) {
        return { valid: false, error: '같은 문자를 너무 많이 반복할 수 없습니다.' };
    }

    // 금지 단어 체크 (필요시 추가)
    const forbiddenWords = ['스팸', '광고', '홍보'];
    if (forbiddenWords.some(word => sanitized.includes(word))) {
        return { valid: false, error: '부적절한 내용이 포함되어 있습니다.' };
    }

    return { valid: true };
};

const MessageSection: React.FC = () => {
    const commentContainerRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<MessageWithUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [loggingIn, setLoggingIn] = useState(false);
    const [lastMessageTime, setLastMessageTime] = useState<number>(0);

    // 알림 상태
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

    // 예쁜 알림 표시 함수
    const showAlert = (message: string, type: 'success' | 'error' | 'warning') => {
        setAlert({ message, type });
    };

    // 스팸 방지: 마지막 메시지 후 30초 대기
    const SPAM_PROTECTION_DELAY = 30000; // 30초

    // 저장된 로그인 상태 확인
    const checkStoredAuth = () => {
        try {
            const storedData = localStorage.getItem('kakao_login_data');
            if (!storedData) {
                setAuthLoading(false);
                return;
            }

            const loginData = JSON.parse(storedData);
            const currentTime = Date.now();

            // 12시간이 지났는지 확인
            if (currentTime - loginData.timestamp > 12 * 60 * 60 * 1000) {
                localStorage.removeItem('kakao_login_data');
                setUser(null);
            } else {
                setUser(loginData.user);
                // 마지막 메시지 시간도 복원
                const lastTime = localStorage.getItem('last_message_time');
                if (lastTime) {
                    setLastMessageTime(parseInt(lastTime));
                }
            }
        } catch (error) {
            console.error('Failed to check stored auth:', error);
            localStorage.removeItem('kakao_login_data');
            setUser(null);
        } finally {
            setAuthLoading(false);
        }
    };

    // 컴포넌트 마운트 시 로그인 상태 확인 및 메시지 로드
    useEffect(() => {
        checkStoredAuth();

        const loadMessages = async () => {
            try {
                const messageList = await getMessages();
                setMessages(messageList);
            } catch (error) {
                console.error('Failed to load messages:', error);
            } finally {
                setLoading(false);
            }
        };

        loadMessages();

        // 실시간 메시지 구독
        const unsubscribe = subscribeToMessages((updatedMessages) => {
            setMessages(updatedMessages);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // 카카오 로그인
    const handleKakaoLogin = () => {
        if (!window.Kakao) {
            showAlert('카카오 SDK가 로드되지 않았습니다.', 'error');
            return;
        }

        setLoggingIn(true);
        window.Kakao.Auth.login({
            success: async (authObj: any) => {
                try {
                    const result = await api.kakaoLogin(authObj.access_token);

                    // 로그인 성공 시 로컬 스토리지에 저장 (1시간 유지)
                    const loginData = {
                        user: result.user,
                        timestamp: Date.now()
                    };
                    localStorage.setItem('kakao_login_data', JSON.stringify(loginData));

                    setUser(result.user);
                    showAlert('로그인이 완료되었습니다! 🎉', 'success');
                } catch (error) {
                    console.error('Login failed:', error);
                    showAlert('로그인에 실패했습니다. 다시 시도해주세요.', 'error');
                } finally {
                    setLoggingIn(false);
                }
            },
            fail: (err: any) => {
                console.error('Kakao login failed:', err);
                showAlert('카카오 로그인에 실패했습니다.', 'error');
                setLoggingIn(false);
            }
        });
    };

    // 로그아웃
    const handleLogout = () => {
        localStorage.removeItem('kakao_login_data');
        localStorage.removeItem('last_message_time');
        setUser(null);
        setLastMessageTime(0);
    };

    // 메시지 작성
    const handleSubmitMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            showAlert('로그인이 필요합니다.', 'warning');
            return;
        }

        // 스팸 방지 체크
        const currentTime = Date.now();
        if (currentTime - lastMessageTime < SPAM_PROTECTION_DELAY) {
            const remainingTime = Math.ceil((SPAM_PROTECTION_DELAY - (currentTime - lastMessageTime)) / 1000);
            showAlert(`너무 빠르게 메시지를 보내고 있습니다. ${remainingTime}초 후에 다시 시도해주세요.`, 'warning');
            return;
        }

        // 입력 검증
        const validation = isValidMessage(newMessage);
        if (!validation.valid) {
            showAlert(validation.error!, 'error');
            return;
        }

        const sanitizedMessage = sanitizeInput(newMessage);

        setSubmitting(true);
        try {
            await addMessage({
                userNickname: user.nickname,
                userId: user.id!,
                content: sanitizedMessage
            });

            setNewMessage('');
            setLastMessageTime(currentTime);
            localStorage.setItem('last_message_time', currentTime.toString());

            // 성공 메시지
            showAlert('축하 메시지가 성공적으로 전송되었습니다! 💝', 'success');
        } catch (error) {
            console.error('Failed to submit message:', error);
            showAlert('메시지를 남기는 데 실패했습니다. 다시 시도해주세요.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    // 날짜 포맷팅
    const formatDate = (timestamp: Timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // 스팸 방지 타이머 표시
    const getRemainingTime = () => {
        const currentTime = Date.now();
        const remaining = SPAM_PROTECTION_DELAY - (currentTime - lastMessageTime);
        return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
    };

    // 인증 로딩 중일 때
    if (authLoading) {
        return (
            <section className="p-6 mt-16 max-w-2xl mx-auto">
                <div className="flex justify-center items-center h-24">
                    <p className="text-lg text-gray-500 animate-pulse">로그인 상태를 확인하는 중...</p>
                </div>
            </section>
        );
    }

    const remainingTime = getRemainingTime();

    return (
        <>
            {/* 예쁜 알림 표시 */}
            {alert && (
                <CustomAlert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}

            <section ref={commentContainerRef} className="p-6 mt-16 max-w-2xl mx-auto">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="font-orbit text-3xl md:text-4xl text-primary mb-12">
                        축하 인삿말 전하기
                    </h2>
                </div>

                {/* 로그인 섹션 */}
                {!user ? (
                    <div className="mb-8 text-center">
                        <button
                            onClick={handleKakaoLogin}
                            disabled={loggingIn}
                            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loggingIn ? '로그인 중...' : '카카오톡으로 로그인'}
                        </button>
                        <p className="text-sm text-gray-500 mt-2">
                            축하 메시지를 남기려면 로그인이 필요해요
                        </p>
                    </div>
                ) : (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                src={user.profileImageUrl}
                                alt={user.nickname}
                                className="w-10 h-10 rounded-full"
                            />
                            <span className="font-medium">{user.nickname}</span>
                        </div>
                    </div>
                )}

                {/* 메시지 작성 폼 */}
                {user && (
                    <form onSubmit={handleSubmitMessage} className="mb-8">
                    <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="따뜻한 축하 메시지를 남겨주세요..."
                        className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        rows={4}
                        maxLength={500}
                    />
                        <div className="flex justify-between items-center mt-3">
                            <div className="text-sm text-gray-500">
                                <span>{newMessage.length}/500</span>
                            </div>
                            <button
                                type="submit"
                                disabled={submitting || !newMessage.trim() || remainingTime > 0}
                                className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? '작성 중...' : '작성하기'}
                            </button>
                        </div>
                    </form>
                )}

                {/* 메시지 목록 */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center items-center h-24">
                            <p className="text-lg text-gray-500 animate-pulse">메시지를 불러오는 중...</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">아직 축하 메시지가 없습니다.</p>
                            <p className="text-gray-400 text-sm mt-1">첫 번째 축하 메시지를 남겨주세요! 💝</p>
                        </div>
                    ) : (
                        messages.map((message) => (
                            <div key={message.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <img
                                        src={message.user.profileImageUrl}
                                        alt={message.user.nickname}
                                        className="w-8 h-8 rounded-full flex-shrink-0"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-gray-900">
                                            {message.user.nickname}
                                        </span>
                                            <span className="text-xs text-gray-500">
                                            {formatDate(message.createdAt)}
                                        </span>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {message.content}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* 메시지 개수 표시 */}
                {messages.length > 0 && (
                    <div className="text-center mt-6 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            총 <span className="font-medium text-primary">{messages.length}</span>개의 축하 메시지
                        </p>
                    </div>
                )}
            </section>
        </>
    );
};

export default MessageSection;
