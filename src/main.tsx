import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

declare global {
    interface Window {
        Kakao: any;
    }
}

const initKakao = () => {
    const kakaoKey = import.meta.env.VITE_KAKAO_APP_KEY;

    if (!kakaoKey) {
        console.error('VITE_KAKAO_APP_KEY가 설정되지 않았습니다.');
        return;
    }

    const checkKakaoSDK = () => {
        if (window.Kakao) {
            if (!window.Kakao.isInitialized()) {
                window.Kakao.init(kakaoKey);
                console.log('Kakao SDK initialized:', window.Kakao.isInitialized());
            } else {
                console.log('Kakao SDK already initialized');
            }
        } else {
            console.log('Kakao SDK not loaded yet, retrying...');
            setTimeout(checkKakaoSDK, 100);
        }
    };

    checkKakaoSDK();
};

// 페이지 로드 완료 후 초기화
window.addEventListener('load', initKakao);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
);