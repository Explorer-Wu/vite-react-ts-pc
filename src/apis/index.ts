import Fetch from './fetch';
import { message } from 'antd';

interface ApiConfig {
	[propName: string]: Function | any;
}

interface ReqOpts {
	paramId?: string;
	params?: any;
	data?: any;
}

interface ReqLis {
	name: string;
	url: string;
	method?: string;
	usetoken?: boolean;
	isFormdata?: boolean;
	headers?: any;
}

export default class Api {
	reqlis: ReqLis[];
	constructor(lis) {
		this.reqlis = lis;
	}

	asyncRequest() {
		const ApisConfig: ApiConfig = {};
		// this.reqlis.forEach((req: any) => {
		for (let req of this.reqlis) {
			const { name, headers, url, method, isFormdata, usetoken } = req;

			ApisConfig[name] = async (opts: ReqOpts, sucmsg: string, errmsg: string) => {
				let queryData = {};
				console.log('api-opts:', opts);
				// fetchLock: false
				if (opts?.params) {
					queryData = {
						params: {
							...opts.params,
						},
					};
				} else if (opts?.data) {
					// delete删除请求(参数可以放在url上, 也可以和post一样放在请求体中)
					queryData = { data: opts.data };
				}

				if (usetoken) {
					queryData = {
						...queryData,
						usetoken,
					};
				}

				if (isFormdata) {
					queryData = {
						...queryData,
						isFormdata,
					};
				}

				try {
					const { code, data } = await Fetch({
						method: method || 'get',
						// url: (opts && opts.paramId) ? (url + opts.paramId) : url,
						url: opts?.paramId ? url + opts.paramId : url,
						headers: (headers as any) || {},
						...queryData,
					});
					if (code === 'success') {
						if (sucmsg) {
							message.success(sucmsg);
						}
						return data;
					}
				} catch (error: any) {
					message.error(`${error.message ? `${error.message},` : undefined}${errmsg}`);
					return false;
				}
			};
		}

		return ApisConfig;
	}
}
