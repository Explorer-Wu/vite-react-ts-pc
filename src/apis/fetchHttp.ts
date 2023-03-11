import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import qs from 'qs';
import { message } from 'antd';
import React, { useReducer, type Dispatch, type PropsWithChildren } from 'react';
import HistoryRule from '@/router/history';
import CookieStorage from '@/utils/storagecookies';
import { getUserToken, formatToken, setToken, removeToken, fetchRefreshToken } from '@/utils/auth';
import { StreamPost, StreamGet, convertRes2Blob } from '@/apis/upDownloadFile';
import { FetchCacheCanceler } from './fetchCacheCancel';
import { AuthStateType, AuthActionType, AuthActionOpts } from '@/storehooks/reducers/types';
import {
	authInitState,
	initStateFn,
	authReducer,
	dispatchAuthMiddleware,
} from '@/storehooks/reducers/auth';
import ApisAuth from './modules/auth';

import type {
	CustomRequestConfig,
	CustomAxiosResponse,
	CustomAxiosError,
	ReqOptsConfig,
} from './types';

const isProd = ['production', 'staging', 'testing'].includes(import.meta.env.MODE);
// const envconf = import.meta.glob('@/envs');
const envBaseUrl = import.meta.env.APP_API_BASE_URL;
console.log('envconf:', import.meta.env);

// 是否开启请求锁。
let fetchLock = true;
// 是否静态提示信息
let $quietMsg = false;

// axios实例配置
const axiosConfig: AxiosRequestConfig = {
	baseURL: isProd ? envBaseUrl : import.meta.env.BASE_URL,
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
		// withCredentials: false, // default
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

const fetchCacheCanceler = new FetchCacheCanceler();

// 错误状态信息
const errStatusInfo = {
	302: '接口重定向了',
	400: '错误请求', // '参数不正确！'
	401: '未授权，或者登录已经超时，请先登录', // 指示身份验证是必需的，没有提供身份验证或身份验证失败。 如果请求已经包含授权凭据（过期了），那么401状态码表示不接受这些凭据。
	403: '拒绝访问，没有权限操作', // 指示尽管请求有效，但服务器拒绝响应它。 与401状态码不同，提供身份验证不会改变结果。
	404: '请求出错，未找到资源',
	405: '请求方法未允许',
	408: '请求超时',
	409: '系统已存在相同数据',
	500: '服务端出错',
	501: '服务未实现',
	502: '网络错误',
	503: '服务不可用',
	504: '网络超时', // '服务暂时无法访问，请稍后再试！'
	505: 'http版本不支持该请求',
};
const doneErrStatusMap = http =>
	new Map([
		[
			401,
			response => {
				// const authErrCodes: any = {
				//   40101: '登录失效，需要重新登录', // token 失效
				//   40102: '登录权限过期，请重新登录', // token 过期
				//   40103: '账户未绑定角色，请联系管理员绑定角色',
				//   40104: '该用户未注册，请联系管理员注册用户',
				//   40105: 'code 无法获取对应第三方平台用户',
				//   40106: '该账户未关联手机，请联系管理员做关联',
				//   40107: '账号已无效',
				//   40108: '账号未找到',
				// }
				const { HrefTo } = HistoryRule();
				const [authState, authDispatch] = useReducer(authReducer, authInitState, initStateFn);
				const authMiddleDispatch = dispatchAuthMiddleware(authDispatch);

				if (response.headers.authorization) {
					const { config, code } = response;
					return new Promise(resolve => {
						if (!http.isRefreshToken) {
							http.isRefreshToken = true;

							try {
								// fetchRefreshToken(getUserToken().accessToken);
								authMiddleDispatch({
									type: AuthActionType.AuthUpdate,
									payload: {
										authed: true,
									},
								});

								const { token } = authState;

								// 已经刷新了token，将所有队列中的请求进行重试
								http.requests.forEach(cb => cb(token));
								// http.requests.forEach(cb => cb(getUserToken().accessToken));
								http.requests = [];

								// 重试当前请求并返回promise
								resolve(http.retryOrigRequest(config) as any);
							} catch (err) {
								console.error('refreshtoken error =>', err);
								// window.location.href = '/';
								// 返回 401 清除过期token信息并跳转到登录页
								HrefTo('/auth/login');
							}

							http.isRefreshToken = false;
						}
						resolve(http.axiosInstance(config) as any);
					});
				}

				// 返回 401 清除过期token信息并跳转到登录页
				return HrefTo('/auth/login');
			},
		],
		[
			403,
			response => {
				if (response.headers.authorization) {
					// getRefreshToken();
					// $store.dispatch('auth/update');
				}
			},
		],
	]);

const handleErrorFn = (error, status, http) => {
	let errMsg = errStatusInfo[status] || `服务连接出错${status}`;
	if (error.response) {
		// const ErrRes = error.response  data
		!isProd && console.log('interceptors.err:', error.response, error.config);
		// error.response.msg = errMsg + '，请检查网络或联系管理员！';
		doneErrStatusMap(http).get(status)!(error.response);
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

class HttpFetch {
	constructor() {
		this.interceptorsRequest();
		this.interceptorsResponse();
	}

	/** token过期后，暂存待执行的请求 */
	private static requests = [] as any[];
	/** 是否正在刷新请求token, 防止重复刷新 */
	private static isRefreshToken = false;
	/** 保存当前Axios实例对象 */
	private static axiosInstance: AxiosInstance = Axios.create(axiosConfig);
	/** 重连原始请求 */
	private static retryOrigRequest(config: AxiosRequestConfig) {
		return new Promise(resolve => {
			HttpFetch.requests.push((token: string) => {
				config.headers!['Authorization'] = formatToken(token);
				resolve(config);
			});
		});
	}

	/** 请求拦截器 */
	private interceptorsRequest() {
		// 设置请求拦截器
		HttpFetch.axiosInstance.interceptors.request.use(
			<T extends CustomRequestConfig>(
				config: T,
			): CustomRequestConfig | Promise<CustomRequestConfig> => {
				// NProgress.start();

				/** 请求白名单，放置一些不需要token的接口（通过设置请求白名单，防止token过期后再请求造成的死循环问题） */
				const whiteList = ['/refreshToken', '/auth/login'];
				if (whiteList.some(v => config.url!.indexOf(v) > -1)) {
					return config;
				}

				// 是否静态提示响应信息
				$quietMsg = config.quiet ? config.quiet : false;
				// 请求锁
				fetchLock = config.fetchLock !== undefined ? config.fetchLock : true;

				if (fetchLock) {
					fetchCacheCanceler.addPending(config);
				}

				// 判断是否需要token，如果存在的话，则每个http header都加上token
				if (config.usetoken) {
					let getTokenKey = getUserToken(); // localStorage.getItem('user_token');
					getTokenKey.accessToken &&
						config.headers &&
						(config.headers['Authorization'] = formatToken(getTokenKey.accessToken));
					Reflect.deleteProperty(config, 'usetoken');
				}

				// 处理请求之前的配置
				console.log('interceptors_config:', config);
				return config;
			},
			(error: AxiosError) => {
				// 请求错误处理
				console.log('request_err:', error);
				return Promise.reject(error);
			},
		);
	}

	/** 响应拦截器 */
	private interceptorsResponse() {
		// 设置响应拦截器
		HttpFetch.axiosInstance.interceptors.response.use(
			(response: CustomAxiosResponse) => {
				// NProgress.done();
				// return response.data;

				const { status, headers, config, data } = response || {};
				// responseLock(response.config);
				if (fetchLock) {
					// ApiCache.deleteTask(config, false);
					// ApiCache.updateCach(response);
					fetchCacheCanceler.removePending(response.config);
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
				// if (data.code === 4013) {
				// }

				if (status && status !== 200) {
					// 追踪错误信息
					!$quietMsg && handleErrMessage(data.message, data.traceId);
					return Promise.reject(new Error(data.message || '系统错误，稍后再试'));
				}

				//处理响应数据
				!isProd && console.log('interceptors.res:', data);

				return response;
			},
			(error: CustomAxiosError) => {
				// NProgress.done();

				// let errMsg, timeOut = null;
				const {
					response: { status, traceId },
				} = error;

				console.log('interceptors-err:', error);
				if (Axios.isCancel(error)) {
					// 中断promise链接
					return new Promise(() => null);
				}

				if (error && error.response && status) {
					handleErrorFn(error, status, HttpFetch);
				}
				// 追踪错误信息
				!$quietMsg && handleErrMessage(error.message, traceId);

				// 处理响应失败
				return Promise.reject(error);
			},
		);
	} /** 通用请求工具函数 */

	public ajax<T>(opts: ReqOptsConfig): Promise<T> {
		const { headers, url, method, isFormdata, usetoken, params, data } = opts;

		const config = {
			method: method || 'get',
			// url: (opts && opts.paramId) ? (url + opts.paramId) : url,
			url: opts?.paramId ? opts.url + opts.paramId : url,
			headers: (headers as any) || {},
			isFormdata,
			usetoken,
			params,
			data,
			// ...requestConfig,
		} as AxiosRequestConfig;

		return new Promise((resolve, reject) =>
			HttpFetch.axiosInstance(config)
				.then(response => {
					const { status, data } = response;
					const success = status === 200 ? true : false;
					if (!success && typeof window !== 'undefined') {
						throw '系统错误或找不到window对象！';
					}
					resolve(data);
				})
				.catch(error => {
					reject(error);
				}),
		);
	}
}

export const httpFetch = new HttpFetch();
