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
      // 构建后是否生成 source map 文件
      sourcemap: true,
      //当设置为 true，构建后将会生成 manifest.json 文件
      manifest: true,
      /** 
       * 指定使用混淆器: boolean | 'terser' | 'esbuild'
       * 设置为 false 可以禁用最小化混淆
       */ 
      minify: "terser", //terser 构建后文件体积更小
      //传递给 Terser 的更多 minify 选项。
      // terserOptions: {
      // },
      //浏览器兼容性  "esnext"|"modules"
      target: "modules",
      //指定输出路径
      outDir: `./dist/dist_${env.VITE_NODE_ENV}`,
      // 指定生成静态资源的存放路径
      assetsDir: 'static/',
      //启用/禁用 CSS 代码拆分
      cssCodeSplit: true,
      
      // 小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 0 可以完全禁用此项
      assetsInlineLimit: 4096,
      /** 构建为库
       * 如果你指定了 build.lib，那么 build.assetsInlineLimit 将被忽略
       * 无论文件大小或是否为 Git LFS 占位符，资源都会被内联。
       * */
      // lib: {
      // },
      //自定义底层的 Rollup 打包配置
      // rollupOptions: {
      //   output: {
      //     chunkFileNames: 'static/js1/[name]-[hash].js',
      //     entryFileNames: 'static/js2/[name]-[hash].js',
      //     assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
      //   },
      //   brotliSize: false, // 不统计
      //   target: 'esnext', 
      //   minify: 'esbuild' // 混淆器，terser构建后文件体积更小
      // },
      
      // @rollup/plugin-commonjs 插件的选项
      commonjsOptions: {
        include: [/node_modules/], // /jest_transform/,
      },
      // 设置为 false 来禁用将构建后的文件写入磁盘
      write: true,
      //默认情况下，若 outDir 在 root 目录下，则 Vite 会在构建时清空该目录。
      emptyOutDir: true,
      // 启用/禁用 gzip 压缩大小报告。压缩大型输出文件可能会很慢，因此禁用该功能可能会提高大型项目的构建性能
      reportCompressedSize: true,
      //chunk 大小警告的限制
      chunkSizeWarningLimit: 500
    },
    preview: {
      port: 8081, // 预览服务器端口
      host: true, // 监听所有地址，包括局域网和公网地址
      strictPort: true, // 端口被占用时，抛出错误
    },
  });
}
