import type { AxiosResponse, AxiosError } from 'axios';
import { httpFetch } from './fetchHttp';
import { message } from 'antd';
import type { ReqList, ReqOpts, ApiFnMap } from './types';

// export type UserResult = {
//   success: boolean
//   data: {
//     /** 用户名 */
//     username: string
//     /** `token` */
//     accessToken: string
//     /** 用于调用刷新`accessToken`的接口时所需的`token` */
//     refreshToken: string
//     /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
//     expires: Date
//   }
// }

export default function asyncApi(reqs: ReqList[]) {
	const apiFnMap: ApiFnMap = {};
	// this.reqlis.forEach((req: any) => {
	for (let req of reqs) {
		const { name, headers, url, method, usetoken } = req;

		apiFnMap[name] = async (opts: ReqOpts, sucmsg?: string, errmsg?: string) => {
			let queryData = JSON.parse(JSON.stringify(opts));
			console.log('api-opts:', opts);

			if (usetoken) {
				queryData = {
					...queryData,
					usetoken,
				};
			}

			try {
				const { code, data }: any = await httpFetch.ajax({
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

	return apiFnMap;
}
