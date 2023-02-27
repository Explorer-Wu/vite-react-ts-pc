// @ts-ignore
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'; // 和plugin-react-refresh冲突
// import reactJsx from 'vite-react-jsx';
// import reactRefresh from '@vitejs/plugin-react-refresh';

// this plugin is used to fix antd style issue
import vitePluginImp from 'vite-plugin-imp';

import viteBaseConfig from './vite.base.config';
import viteDevConfig from './vite.dev.config';
import viteProdConfig from './vite.prod.config';

const { resolve } = require('./viter/utils/index');

const resolveEnvFn = {
	serve: () => ({ ...viteBaseConfig, ...viteDevConfig }),
	build: () => ({ ...viteBaseConfig, ...viteProdConfig }),
};

/**
 * @command: 'build' | 'serve'
 * @mode: 'production' | 'development'
 */
export default defineConfig((opt: { command: 'build' | 'serve'; mode: string }) => {
	// 根据当前工作目录中的 `mode` 加载 .env 文件
	// 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
	const env = loadEnv(opt.mode, process.cwd(), ''); // prefix
	console.log('process.cwd:', process.cwd(), resolve('./src'));
	return resolveEnvFn[opt.command]();
});
