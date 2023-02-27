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
// * No declaration file for less-vars-to-js
import lessToJS from 'less-vars-to-js';
// import fs from 'fs';
import path from 'path';

// const themeVariables = lessToJS(
//   fs.readFileSync(path.resolve(__dirname, './variables.less'), 'utf8')
// );

// https://vitejs.dev/config/
export default defineConfig({
	base: 'http://192.168.0.108:8081', // https://xxx.com/
	// envDir: './env',
	build: {
		minify: false,
		commonjsOptions: {
			include: /node_modules|envconfig/,
		},
	},
});
