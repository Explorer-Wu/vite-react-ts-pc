import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import qs from 'qs';
import CookieStorage from '@/utils/cookiestorage';
import { message } from 'antd';
import { StreamPost, StreamGet, convertRes2Blob } from '@/apis/upDownloadFile';

// import $store from '@/store/index';

interface CustomRequestConfig extends AxiosRequestConfig {
	usetoken?: boolean;
	// isFormdata: boolean;
	fetchLock: boolean;
	quiet?: boolean;
	readType: string;
}

const envconf = require('@/envconfig');
const isProd = ['production', 'test', 'uat'].includes(process.env.NODE_ENV as any);

// 是否开启请求锁。
let fetchLock = true;
// 是否静态提示信息
let $quietMsg = false;

// 创建axios实例
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
const InstanceAxios: AxiosInstance = Axios.create(configAxios);

// 错误状态信息
const errStatusInfo = {
	400: '错误请求',
	401: '未授权，请重新登录',
	403: '拒绝访问',
	404: '请求错误，未找到资源',
	408: '请求超时',
	500: '服务端出错',
	502: '网络错误',
	503: '服务不可用',
	504: '网络超时',
	505: 'http版本不支持该请求',
};

const handleErrorFn = (error, status) => {
	let errMsg = errStatusInfo[status] || `服务连接错误${status}`;
	if (error.response) {
		// const ErrRes = error.response  data
		!isProd && console.log('interceptors.err:', error.response, error.config);
		switch (status) {
			case 401:
				// 返回 401 清除过期token信息并跳转到登录页
				// if ($store.state.auth.authenticated) {
				// 	CookieStorage.clearCookie('user_token');
				// 	console.log('access_del:', CookieStorage.getTokenCookie('user_token'));
				// 	$store.dispatch('auth/check');
				// }
				// errMsg = '用户没有权限访问，或权限被占用，请登录账户！';
				// error.response.msg = errMsg;
				break;
			case 403:
				// if ($store.state.auth.authenticated) {
				// 	$store.dispatch('auth/update');
				// }
				break;
			default:
				error.message = errMsg;
				break;
		}
	}
};

const handleErrMessage = (msg, traceId = '') => {
	const [messageApi] = message.useMessage();
	messageApi.open({
		type: 'error',
		content: `${msg}${traceId}` || '系统错误，稍后再试',
		duration: 5,
	});
};

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
	cachMap: new Map() /** 缓存列表 */,
	fetchQueue: [] /** 请求任务队列 */,
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
			config.headers.expirationTime = void 0;
		}

		// 判断是否需要token，如果存在的话，则每个http header都加上token
		if (config.usetoken) {
			let getToken = CookieStorage.getTokenCookie('user_token'); // localStorage.getItem('user_token');
			getToken && (config.headers.Authorization = `${getToken}`);
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
	response: (response: AxiosResponse) => {
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
			console.log('取消上一个请求');
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

export default function Fetch(options) {
	//自定义配置
	let extraOptions = {
		$quiet: options.$quiet || false, //默认弹出message提示
	};

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
