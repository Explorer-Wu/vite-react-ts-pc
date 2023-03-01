import Axios, {
	type AxiosInstance,
	type AxiosRequestConfig,
	type AxiosResponse,
	type AxiosError,
} from 'axios';
import qs from 'qs';
import { message } from 'antd';
import React, { useReducer, type Dispatch, type PropsWithChildren } from 'react';
import { LinkTo, HrefTo } from '@/router/history';
// import CookieStorage from '@/utils/storagecookies';
import { getUserToken, formatToken, setToken, removeToken } from '@/utils/auth';
import { StreamPost, StreamGet, convertRes2Blob } from '@/apis/upDownloadFile';
import { authInitState, authReducer } from '@/storehooks/reducers/auth';
import type { CustomRequestConfig, CustomAxiosResponse, CustomAxiosError, ReqOptsConfig } from './types';

// const { getCookie, setCookie, delCookie, getSession, setSession, delSession, clearSession } = CookieStorage;

const [authState, authDispatch] = useReducer(authReducer, authInitState);


const envconf = require('@/envconfig');
const isProd = ['production', 'test', 'uat'].includes(process.env.VITE_NODE_ENV as any);

/* 是否正在刷新请求token */
let isRefreshToken = false;
// 是否开启请求锁。
let fetchLock = true;
// 是否静态提示信息
let $quietMsg = false;

// axios实例配置
const configAxios: AxiosRequestConfig = {
	baseURL: isProd ? envconf.baseUrl : process.env.BASE_URL,
	// 是否跨域携带cookie
	withCredentials: true,
	// 请求超时
	timeout: 10 * 1000,
	headers: {
		// 'x-channel': 'PC',
		/**
		 * 'no-store' 客户端完全不缓存响应;
		 * 'must-revalidate' 使用缓存前先校验一遍(注：浏览器的后退前进功能,缓存过期不会revalidate);
		 * ‘no-cache'，并不是指不能用cache，客户端仍会把带有no-cache的响应缓存下来，只不过每次不会直接用缓存，而得先revalidate */
		'Cache-Control': 'no-cache', // 'max-age=86400, must-revalidate' // “再次校验”
		// Expires: 0,
		'accept-language': 'zh-cn,zh',
		// Accept: 'application/json, text/plain, */*',
		// 'Content-Type': 'application/json',
		'X-Requested-With': 'XMLHttpRequest',
	},
	transformRequest: [
		(data: any, headers: any): any => {
			if (!headers.isFormdata || headers['Content-Type'] === 'application/json') {
				headers.post['Content-Type'] = 'application/json';
				headers.put['Content-Type'] = 'application/json';
				headers.patch['Content-Type'] = 'application/json';
				return JSON.stringify(data);
			}
			// 参数序列化
			return qs.stringify(data);
		},
	],
};

// 创建axios实例
const InstanceAxios: AxiosInstance = Axios.create(configAxios);
// const InstanceAxios: CustomAxiosInstance = {
// 	...OrgInstanceAxios,
// 	setToken: (token: string) => {
// 		InstanceAxios.defaults.headers.common.Authorization = token; // defaults.headers['X-Token']
// 		CookieStorage.setSession('user_token', token);
// 	}
// }

// 给实例添加一个setToken方法，用于登录后将最新token动态添加到header，同时将token保存在localStorage中
function getRefreshToken() {
	// instance是当前request.js中已创建的axios实例
	return InstanceAxios.post('/refreshtoken').then(res => res.data);
}

interface ApiCacheType {
	cachMap: Map<any, any>;
	fetchQueue: string[];
	addTask: (...args: any[]) => void;
	deleteTask: (...args: any[]) => void;
	createKey: (config: any) => void;
	deleteCach: (...args: any[]) => void;
	addCach: (...args: any[]) => void;
	updateCach: (res: any) => void;
}

const ApiCache: ApiCacheType = {
	/** 缓存列表 */
	cachMap: new Map(),
	/** 请求任务队列 */
	fetchQueue: [],
	/** 新增任务 */
	addTask(config, cancelToken) {
		this.fetchQueue.push({ original: `${config.url}&${config.method}`, cancelToken });
	},
	/** 删除任务 */
	deleteTask(config, start, cancelToken) {
		let cancel = false;
		for (let i in this.fetchQueue) {
			if (this.fetchQueue[i]['original'] === `${config.url}&${config.method}`) {
				this.fetchQueue[i].cancelToken(`cancel ${config.url}`);
				this.fetchQueue.splice(i, 1);
				cancel = true;
				break;
			}
		}
		if (!cancel && start) {
			this.deleteCach(config, cancelToken);
		}
	},
	/** 创建key */
	createKey(config) {
		let str = '';
		config.url && (str += config.url);
		if (config.method) {
			str += ',method:' + config.method;
			if (config.method === 'get' || config.params) {
				str += ',data:' + qs.stringify(config.params) + '';
			} else {
				str += ',data:' + config.data;
			}
		}
		return str;
	},
	/** 删除缓存 */
	deleteCach(config, cancelToken) {
		let cachMap = this.cachMap;
		const key = this.createKey(config),
			now = new Date().getTime();
		let cach = cachMap.get(key) || {};
		if (cach && cach.expirationTime && now <= cach.deadline && cach.data) {
			cach.cach = true;
			cancelToken(cach.data);
		}
	},
	/** 新增缓存 */
	addCach(config, cancel) {
		const key = this.createKey(config),
			expirationTime = config.headers.expirationTime || 0;
		if (expirationTime) {
			this.cachMap.set(key, {
				expirationTime,
				deadline: new Date().getTime() + expirationTime,
				data: '',
				cancel,
			});
		}
	},
	/** 更新缓存 */
	updateCach(res) {
		if (!res || !res.config) {
			return;
		}
		const key = this.createKey(res.config);

		const oldVal = this.cachMap.get(key);
		if (!oldVal) {
			return;
		}

		this.cachMap.set(key, {
			expirationTime: oldVal.expirationTime,
			deadline: oldVal.deadline,
			data: res,
		});
	},
};

// 错误状态信息
const errStatusInfo = {
	400: '错误请求',
	401: '未授权，请重新登录',
	403: '拒绝访问',
	404: '请求出错，未找到资源',
	408: '请求超时',
	500: '服务端出错',
	501: '服务未实现',
	502: '网络错误',
	503: '服务不可用',
	504: '网络超时',
	505: 'http版本不支持该请求',
};

const doneErrStatusMap = new Map([
	[
		401,
		response => {
			if (response.headers.authorization) {
				// $store.state.auth.authenticated
				// delSession('user_token');
				removeToken();
			}
			// 返回 401 清除过期token信息并跳转到登录页
			HrefTo('/auth/login');
		},
	],
	[
		403,
		response => {
			if (response.headers.authorization) {
				// $store.state.auth.authenticated
				// delSession('user_token');
				getRefreshToken();
				// $store.dispatch('auth/update');
			}
		},
	],
]);

const handleErrorFn = (error, status) => {
	let errMsg = errStatusInfo[status] || `服务连接出错${status}`;
	if (error.response) {
		// const ErrRes = error.response  data
		!isProd && console.log('interceptors.err:', error.response, error.config);
		// error.response.msg = errMsg + '，请检查网络或联系管理员！';
		doneErrStatusMap.get(status)!(error.response);
	}
	error.message = errMsg + '，请检查网络或联系管理员！';
};

const handleErrMessage = (msg, traceId = '') => {
	const [messageApi] = message.useMessage();
	messageApi.open({
		type: 'error',
		content: `${msg}${traceId}` || '系统错误，稍后再试',
		duration: 5,
	});
};

// 请求拦截配置
const InterceptorsRequest = {
	config: <T extends CustomRequestConfig>(
		config: T,
	): CustomRequestConfig | Promise<CustomRequestConfig> => {
		// 是否静态提示响应信息
		$quietMsg = config.quiet ? config.quiet : false;
		// 请求锁
		fetchLock = config.fetchLock !== undefined ? config.fetchLock : true;

		if (fetchLock) {
			config.cancelToken = new Axios.CancelToken(c => {
				ApiCache.deleteTask(config, true, c);
				ApiCache.addTask(config, c);
				ApiCache.addCach(config, c);
			});
			// config.headers && (config.headers.expirationTime = void 0);
		}

		// 判断是否需要token，如果存在的话，则每个http header都加上token
		if (config.usetoken) {
			let getTokenKey = getUserToken(); // localStorage.getItem('user_token');
			getTokenKey.accessToken &&
				config.headers &&
				(config.headers.Authorization = formatToken(getTokenKey.accessToken));
			Reflect.deleteProperty(config, 'usetoken');
		}

		// 处理请求之前的配置
		console.log('interceptors_config:', config);
		return config;
	},
	error: err => {
		// 请求错误处理
		console.log('request_err:', err);
		return Promise.reject(err);
	},
};

// 响应拦截配置
const InterceptorsResponse = {
	response: (response: CustomAxiosResponse) => {
		const { status, headers, config, data } = response || {};
		// responseLock(response.config);
		if (fetchLock) {
			ApiCache.deleteTask(config, false);
			ApiCache.updateCach(response);
		}

		// 处理字节流
		if (headers && headers['content-type'] === 'application/octet-stream') {
			if (config.method === 'post') {
				StreamPost(config);
			} else if (config.method === 'get') {
				if (config.readType === 'dowload') {
					convertRes2Blob(response);
				} else {
					// StreamGet(config);
					convertRes2Blob(response, 'read');
				}
				// return response;
			}
			return false;
		}

		// 后端约定当4013时表示token过期了，要求刷新token
		if (data.code === 4013) {
			if (!isRefreshToken) {
				isRefreshToken = true;
				return getRefreshToken()
					.then(res => {
						const { user_token, refresh_key, expires } = res.data;
						setToken({
							accessToken: user_token,
							refreshKey: refresh_key,
							expires,
						});
						// 已经刷新了token，将所有队列中的请求进行重试
						// requests.forEach(cb => cb(token));
						ApiCache.updateCach(response);
						return InstanceAxios(config);
					})
					.catch(res => {
						console.error('refreshtoken error =>', res);
						window.location.href = '/';
					})
					.finally(() => {
						isRefreshToken = false;
					});

				// $store.dispatch('auth/update');
			} else {
				// 正在刷新token，将返回一个未执行resolve的promise
				return new Promise(resolve => {
					// 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
					// requests.push(token => {
					// 	config.baseURL = '';
					// 	config.headers['X-Token'] = token;
					// 	resolve(InstanceAxios(config));
					// });
					ApiCache.updateCach(response);
					resolve(InstanceAxios(config));
				});
			}
		}

		if (status && status !== 200) {
			// 追踪错误信息
			!$quietMsg && handleErrMessage(data.message, data.traceId);
			return Promise.reject(new Error(data.message || '系统错误，稍后再试'));
		}

		//处理响应数据
		!isProd && console.log('interceptors.res:', data);

		return response;
	},
	error: error => {
		// let errMsg, timeOut = null;
		const {
			response: { status },
		} = error;

		console.log('interceptors-err:', error);
		if (Axios.isCancel(error)) {
			// 中断promise链接
			return new Promise(() => null);
		}

		if (error && error.response && status) {
			handleErrorFn(error, status);
		}
		// 追踪错误信息
		!$quietMsg && handleErrMessage(error.message, error.traceId);

		// 处理响应失败
		return Promise.reject(error);
		// return Promise.reject(error.response.data || error.message);
	},
};

// 设置请求拦截器
InstanceAxios.interceptors.request.use(InterceptorsRequest.config, InterceptorsRequest.error);

// 设置响应拦截器
InstanceAxios.interceptors.response.use(InterceptorsResponse.response, InterceptorsResponse.error);

export default function Fetch(options: CustomRequestConfig) {
	return InstanceAxios(options)
		.then(response => {
			const { status, data } = response;
			const success = status === 200 ? true : false;
			if (!success && typeof window !== 'undefined') {
				throw '系统错误或找不到window对象！'; // message.error(error +', 请求失败！');
			}

			return Promise.resolve({
				...data,
			});
		})
		.catch(error => {
			return Promise.reject(error);
		});
}
