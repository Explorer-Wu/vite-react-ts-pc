// @ts-ignore
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // 和plugin-react-refresh冲突
// import reactJsx from 'vite-react-jsx';
// import reactRefresh from '@vitejs/plugin-react-refresh';

// import fs from 'fs';
import path from 'path';

// const themeVariables = lessToJS(
//   fs.readFileSync(path.resolve(__dirname, './variables.less'), 'utf8')
// );

/** @type {import('vite').UserConfig} */
export default (env) => {
  return defineConfig({
    // base: 'http://192.168.0.108:8081', // https://xxx.com/
    build: {
      sourcemap: true,
      manifest: true,
      minify: false,
      commonjsOptions: {
        include: /node_modules|envconfig/,
      },
      //指定输出路径
      outDir: `./dist/dist_${env.NODE_ENV}`,
      // 指定生成静态资源的存放路径
      assetsDir: 'static/',
      // rollupOptions: {
      //   output: {
      //     chunkFileNames: 'static/js1/[name]-[hash].js',
      //     entryFileNames: 'static/js2/[name]-[hash].js',
      //     assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
      //   },
      //   brotliSize: false, // 不统计
      //   target: 'esnext', 
      //   minify: 'esbuild' // 混淆器，terser构建后文件体积更小
      // }
    },
    preview: {
      port: 8081, // 预览服务器端口
      host: true, // 监听所有地址，包括局域网和公网地址
      strictPort: true, // 端口被占用时，抛出错误
    },
  });
}
