import Fetch from './fetch';
import { message } from 'antd';
import type { ReqList, ReqOpts, ApiFnMap } from './types';

export default class Api {
	reqlist: ReqList[];
	constructor(reqs) {
		this.reqlist = reqs;
	}

	asyncRequest() {
		const apiFnMap: ApiFnMap = {};
		// this.reqlis.forEach((req: any) => {
		for (let req of this.reqlist) {
			const { name, headers, url, method, isFormdata, usetoken } = req;

			apiFnMap[name] = async (opts: ReqOpts, sucmsg: string, errmsg: string) => {
        let queryData = JSON.parse(JSON.stringify(opts));
			  console.log('api-opts:', opts);

				// // fetchLock: false
				// if (opts?.params) {
				// 	queryData = {
				// 		params: {
				// 			...opts.params,
				// 		},
				// 	};
				// } else if (opts?.data) {
				// 	// delete删除请求(参数可以放在url上, 也可以和post一样放在请求体中)
				// 	queryData = { data: opts.data };
				// }

				// if (isFormdata) {
				// 	queryData = {
				// 		...queryData,
				// 		isFormdata,
				// 	};
				// }

        if (usetoken) {
          queryData = {
            ...queryData,
            usetoken,
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

		return apiFnMap;
	}
}
