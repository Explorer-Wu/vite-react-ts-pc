import asyncApi from '../api';
import type { ApiFnMap } from '../types';

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

const ApisAuth: ApiFnMap = asyncApi(ApiAuthOpts);

export default ApisAuth;
