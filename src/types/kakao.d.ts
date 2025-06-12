declare global {
    interface Window {
        Kakao: {
            init: (key: string) => void;
            isInitialized: () => boolean;
            Auth: {
                login: (options: {
                    success: (authObj: any) => void;
                    fail: (error: any) => void;
                    scope?: string;
                }) => void;
                logout: (callback?: () => void) => void;
            };
            API: {
                request: (options: {
                    url: string;
                    success: (response: any) => void;
                    fail: (error: any) => void;
                }) => void;
            };
        };
    }
}

export {};
