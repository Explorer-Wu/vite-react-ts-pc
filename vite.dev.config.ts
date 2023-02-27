// @ts-ignore
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // 和plugin-react-refresh冲突

// https://vitejs.dev/config/
export default defineConfig({
	// base: './',
	server: {
		port: 3606,
		proxy: {
			'/api': {
				target: 'http://172.0.0.1:8080',
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api/, ''),
			},
			// with RegEx
			// '^/fallback/.*': {
			//   target: 'http://jsonplaceholder.typicode.com',
			//   changeOrigin: true,
			//   rewrite: (path) => path.replace(/^\/fallback/, '')
			// },
			// // Using the proxy instance
			// '/api': {
			//   target: 'http://jsonplaceholder.typicode.com',
			//   changeOrigin: true,
			//   configure: (proxy, options) => {
			//     // proxy will be an instance of 'http-proxy'
			//   }
			// },
			// // Proxying websockets or socket.io
			// '/socket.io': {
			//   target: 'ws://localhost:3000',
			//   ws: true
			// }
		},
	},
});
