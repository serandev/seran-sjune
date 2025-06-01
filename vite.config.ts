import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // `production` 모드일 경우 GitHub Pages용 base 경로 설정
  // const isProd = mode === 'production';

  return {
    // base: isProd ? '/sb1-5tb6c3gu/' : '/',   // ✔️ 배포 시 base 경로 설정
    base: '/',
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
