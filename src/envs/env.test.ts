module.exports = {
	env: 'test',
	mock: true,
	title: '测试',
	outputDir: 'dist/dist_sit',
	baseUrl: 'http://192.168.0.108:8081', // 测试项目地址
	devUrl: 'http://localhost:3601', // 本地api请求地址, 注意：如果使用了代理，请设置成'/'
	authUrl: 'http://192.168.0.108:3602',
	wsUrl: 'ws://127.0.0.1:3603',
	$cdn: 'https://example.cn',
};
