import axios, { AxiosRequestConfig, Canceler } from 'axios';
import qs from 'qs';

// * 声明一个 Map 用于存储每个请求的标识 和 取消函数
let pendingMap = new Map<string, Canceler>();

/** 判断值是否为某个类型 */
function isTypeFn(val: unknown, type: string) {
	return toString.call(val) === `[object ${type}]`;
}

/** 是否为函数 */
function isFunction<T = Function>(val: unknown): val is T {
	return isTypeFn(val, 'Function');
}

/** 序列化请求等待参数 */
export const getPendingUrlsKey = (config: AxiosRequestConfig) =>
	[config.method, config.url, qs.stringify(config.data), qs.stringify(config.params)].join('&');

export class FetchCacheCanceler {
	/**
	 * @description: 添加请求
	 * @param {Object} config
	 * @return void
	 */
	addPending(config: AxiosRequestConfig) {
		// * 在请求开始前，对之前的请求做检查取消操作
		this.removePending(config);
		const urls = getPendingUrlsKey(config);
		config.cancelToken =
			config.cancelToken ||
			new axios.CancelToken(cancel => {
				if (!pendingMap.has(urls)) {
					// 如果 pending 中不存在当前请求，则添加进去
					pendingMap.set(urls, cancel);
				}
			});
	}

	/**
	 * @description: 移除请求
	 * @param {Object} config
	 */

	removePending(config: AxiosRequestConfig) {
		const urls = getPendingUrlsKey(config);
		if (pendingMap.has(urls)) {
			// 如果在 pending 中存在当前请求标识，需要取消当前请求，并且移除
			const cancel = pendingMap.get(urls);
			cancel && cancel();
			pendingMap.delete(urls);
		}
	}

	/**
	 * @description: 清空所有pending
	 */
	removeAllPending() {
		// pendingMap.forEach(cancel => {
		// 	cancel && isFunction(cancel) && cancel();
		// });
		for (let cancel of pendingMap.values()) {
			cancel && isFunction(cancel) && cancel();
		}
		pendingMap.clear();
	}

	/**
	 * @description: 重置
	 */
	reset(): void {
		pendingMap = new Map<string, Canceler>();
	}
}
