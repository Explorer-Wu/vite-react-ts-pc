// @ts-ignore
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // 和plugin-react-refresh冲突
// import reactJsx from 'vite-react-jsx';
// import reactRefresh from '@vitejs/plugin-react-refresh';

// this plugin is used to fix antd style issue
import vitePluginImp from 'vite-plugin-imp';

// this plugin is used for use svg as react component in vite
import svgrPlugin from 'vite-plugin-svgr';
import Inspect from 'vite-plugin-inspect';
import basicSsl from '@vitejs/plugin-basic-ssl';
// * No declaration file for less-vars-to-js
// import lessToJS from 'less-vars-to-js';
import fs from 'fs';
import path from 'path';

// const appDir = fs.realpathSync(process.cwd());

// const themeVariables = lessToJS(
//   fs.readFileSync(path.resolve(__dirname, './variables.less'), 'utf8')
// );

// https://vitejs.dev/config/
export default defineConfig({
	// root: path.resolve(__dirname, '../'),
	base: './',
	// 环境变量设置所在文件夹路径
	envDir: './env',
  envPrefix: ['VITE_','APP_'],
	plugins: [
		// Inspect(),
		react(), // reactJsx(),
    basicSsl(),
		// reactRefresh(),
		svgrPlugin(),
		vitePluginImp({
			optimize: true,
			libList: [
				{
					libName: 'antd',
					libDirectory: 'es',
					style: name => `antd/es/${name}/style`,
					// style: (name) => {
					//   if (name === "col" || name === "row") {
					//     return "antd/lib/style/index.less";
					//   }
					//   return `antd/es/${name}/style/index.less`;
					// },
				},
			],
		}),
	],
  // define: { 'process': {} },
	css: {
		preprocessorOptions: {
			less: {
				// 支持内联 JavaScript
				javascriptEnabled: true, //注意，这一句是在less对象中，写在外边不起作用
				// modifyVars:{ //在这里进行主题的修改，参考官方配置属性 // modifyVars: themeVariables,
				//   '@primary-color': '#1DA57A',
				// },
			},
			sass: { charset: false },
			scss: {
				charset: false,
				/** 引入var.scss全局预定义变量 */
				additionalData:
					'@import "@/assets/styles/main/normalize.scss";@import "@/assets/styles/main/function.scss";',
			},
		},
		postcss: {
			plugins: [
				{
					postcssPlugin: 'internal:charset-removal',
					AtRule: {
						charset: atRule => {
							if (atRule.name === 'charset') {
								atRule.remove();
							}
						},
					},
				},
			],
		},
		modules: {
			localsConvention: 'camelCase',
		},
	},
	resolve: {
		extensions: [
			'.mjs',
			'.js',
			'.ts',
			'.jsx',
			'.tsx',
			'.json',
			'.css',
			'.scss',
			'.less',
			'.png',
			'.jpg',
			'.jpeg',
			'.gif',
			'.svg',
		], // '.wasm',
		alias: {
			'@': path.resolve(__dirname, './src'), // path.resolve(appDir, './src'),
		},
	},
});
