import asyncApi, { type ApiFn } from '../api';

const ApiAuthOpts = [
	{
		name: 'login', // 登录
		url: '/auth/login',
		method: 'post',
	},
	{
		name: 'logout', // 登出
		url: '/auth/logout',
		method: 'post',
	},
	{
		name: 'refreshToken', // 更新token
		url: '/auth/refreshToken',
		method: 'post',
	},
];

const ApisAuth: ApiFn = asyncApi(ApiAuthOpts);

export default ApisAuth;
