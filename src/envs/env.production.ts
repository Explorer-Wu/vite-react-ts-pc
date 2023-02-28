// 生产环境
module.exports = {
	env: 'production',
	mock: true,
	title: '生产',
	outputDir: 'dist/dist_build',
	baseUrl: 'http://192.168.0.108:8081', // 正式api请求地址 'https://xxx.com.cn',
	authUrl: 'http://192.168.0.108:3602',
	wsUrl: 'ws://127.0.0.1:3603',
	$cdn: 'https://example.cn',
};
