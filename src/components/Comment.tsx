import React, { useEffect, useRef, useState } from 'react';
import { addMessage, getMessages, subscribeToMessages, MessageWithUser } from '../services/messageService';
import { api } from '../utils/api';
import { User } from '../types/api';
import { Timestamp } from 'firebase/firestore';

const Comment: React.FC = () => {
    const commentContainerRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<MessageWithUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // 컴포넌트 마운트 시 메시지 로드
    useEffect(() => {
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
            alert('카카오 SDK가 로드되지 않았습니다.');
            return;
        }

        window.Kakao.Auth.login({
            success: async (authObj: any) => {
                try {
                    const result = await api.kakaoLogin(authObj.access_token);
                    setUser(result.user);
                } catch (error) {
                    console.error('Login failed:', error);
                    alert('로그인에 실패했습니다.');
                }
            },
            fail: (err: any) => {
                console.error('Kakao login failed:', err);
                alert('카카오 로그인에 실패했습니다.');
            }
        });
    };

    // 메시지 작성
    const handleSubmitMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            alert('로그인이 필요합니다.');
            return;
        }

        if (!newMessage.trim()) {
            alert('메시지를 입력해주세요.');
            return;
        }

        setSubmitting(true);
        try {
            await addMessage({
                userId: user.id!,
                content: newMessage.trim()
            });
            setNewMessage('');
            // 실시간 구독으로 자동 업데이트됨
        } catch (error) {
            console.error('Failed to submit message:', error);
            alert('메시지 전송에 실패했습니다.');
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

    return (
        <section ref={commentContainerRef} className="p-6 mt-16 max-w-2xl mx-auto">
            <div className="container mx-auto px-4 text-center">
                <h2 className="font-orbit text-3xl md:text-4xl text-primary mb-12">
                    축하 인삿말 전하기
                </h2>
            </div>

            {/* 로그인 섹션 */}
            {!user && (
                <div className="mb-8 text-center">
                    <button
                        onClick={handleKakaoLogin}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
                    >
                        카카오톡으로 로그인
                    </button>
                    <p className="text-sm text-gray-500 mt-2">
                        축하 메시지를 남기려면 로그인이 필요해요
                    </p>
                </div>
            )}

            {/* 사용자 정보 */}
            {user && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg flex items-center gap-3">
                    <img
                        src={user.profileImageUrl}
                        alt={user.nickname}
                        className="w-10 h-10 rounded-full"
                    />
                    <span className="font-medium">{user.nickname}님으로 로그인됨</span>
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
                        <span className="text-sm text-gray-500">
                            {newMessage.length}/500
                        </span>
                        <button
                            type="submit"
                            disabled={submitting || !newMessage.trim()}
                            className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? '전송 중...' : '메시지 전송'}
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
    );
};

export default Comment;