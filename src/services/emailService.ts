import emailjs from '@emailjs/browser';

const EMAILJS_CONFIG = {
    SERVICE_ID: import.meta.env.REACT_APP_EMAILJS_SERVICE_ID || 'serandev',
    TEMPLATE_ID: import.meta.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'template_n1ljggs',
    PUBLIC_KEY: import.meta.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'ka2sSAy8mlzQd8IuG'
};

export interface EmailNotificationData {
    userNickname: string;
    userId: string;
    content: string;
    messageId: string;
}

class EmailService {
    /**
     * 메시지 알림 이메일 발송
     */
    async sendEmailNotification(data: EmailNotificationData): Promise<void> {
        try {
            const templateParams = {
                title: '세란 선준 웨딩 알림',
                name: data.userNickname,
                message: data.content,
                site_url: window.location.origin,
                message_id: data.messageId,
                timestamp: new Date().toLocaleString('ko-KR')
            };

            await emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_ID,
                templateParams,
                EMAILJS_CONFIG.PUBLIC_KEY
            );

            console.log('이메일 알림이 성공적으로 발송되었습니다.');
        } catch (error) {
            console.error('이메일 발송 실패:', error);
            throw error;
        }
    }

    /**
     * EmailJS 서비스 초기화 상태 확인
     */
    isConfigured(): boolean {
        return !!(
            EMAILJS_CONFIG.SERVICE_ID &&
            EMAILJS_CONFIG.TEMPLATE_ID &&
            EMAILJS_CONFIG.PUBLIC_KEY
        );
    }

    /**
     * 이메일 서비스 설정 정보 반환 (디버깅용)
     */
    getConfig() {
        return {
            serviceId: EMAILJS_CONFIG.SERVICE_ID ? '설정됨' : '미설정',
            templateId: EMAILJS_CONFIG.TEMPLATE_ID ? '설정됨' : '미설정',
            publicKey: EMAILJS_CONFIG.PUBLIC_KEY ? '설정됨' : '미설정'
        };
    }
}

// 싱글톤 인스턴스 생성
export const emailService = new EmailService();
