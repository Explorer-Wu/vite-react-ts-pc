// @ts-ignore
import { defineConfig } from 'vite';

/** @type {import('vite').UserConfig} */
export default (env) => {
  // const viteEnv = loadEnv(mode, process.cwd(), '');
  console.log('config.dev:', env.APP_API_BASE_URL);

  return defineConfig({
    server: {
      // base: './',
      port: 3606, // 开发服务器端口
      host: true, // 监听所有地址，包括局域网和公网地址
      proxy: (() => {
        const proxyPath = [
          '/api',
          '/mock',
          '/auth',
          // '/socket.io'
        ];
        let proxyConfig = {};
        for (let item of proxyPath) {
          let regExp = new RegExp(`^\${item}`); // ,'g'
          proxyConfig[item] = {
            target: env.APP_API_BASE_URL,
            // logLevel: 'debug', // 查看代理请求的真实地址 
            changeOrigin: true,
            rewrite: path => path.replace(regExp, '/'),
            cookieDomainRewrite: "",
            secure: false,
          };
        }
        // console.log('proxyConfig:', proxyConfig);
        return proxyConfig;
      })(),

      // proxy: {
        // Using the proxy instance
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
      // },
    }
  });
}
