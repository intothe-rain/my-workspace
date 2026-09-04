import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const exKey = env.EX_API_KEY || ''

  return {
    plugins: [react()],
    server: {
      // 로컬 개발용: /api/traffic 요청을 도로공사 API로 전달 (키 자동 첨부)
      proxy: {
        '/api/word': {
          target: 'https://my-workspace-coral.vercel.app',
          changeOrigin: true,
        },
        '/api/traffic': {
          target: 'https://data.ex.co.kr',
          changeOrigin: true,
          rewrite: (path) => {
            const q = path.includes('?') ? path.split('?')[1] + '&' : ''
            return `/openapi/trafficapi/trafficAll?${q}key=${exKey}&type=json`
          },
        },
      },
    },
  }
})
