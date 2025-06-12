import { User } from '../types/api';

// Vite에서 개발/프로덕션 환경 구분
const API_BASE_URL = import.meta.env.MODE === 'development'
    ? 'http://localhost:8888/.netlify/functions'
    : '/.netlify/functions';  // /api 대신 직접 경로 사용

console.log('Current mode:', import.meta.env.MODE);
console.log('API_BASE_URL:', API_BASE_URL);

class ApiClient {
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;
        console.log('Requesting:', url); // 디버깅용

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        console.log('Response status:', response.status); // 디버깅용

        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }

        return response.json();
    }

    async kakaoLogin(kakaoToken: string): Promise<{ success: boolean; user: User }> {
        return this.request<{ success: boolean; user: User }>('/auth-kakao', {
            method: 'POST',
            body: JSON.stringify({ kakaoToken }),
        });
    }
}

export const api = new ApiClient();
