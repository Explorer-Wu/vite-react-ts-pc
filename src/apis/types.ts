import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// interface CustomAxiosInstance extends AxiosInstance {
// 	setToken: (token: string) => void;
// }
export interface CustomRequestConfig<D = any> extends AxiosRequestConfig {
	usetoken?: boolean;
	// isFormdata: boolean;
	fetchLock?: boolean;
	quiet?: boolean;
	readType?: string;
}
export interface CustomAxiosResponse<T = any, D = any> extends AxiosResponse {
	config: CustomRequestConfig<D>;
	traceId?: any;
}
export interface CustomAxiosError<T = unknown, D = any> extends AxiosError {
	constructor(response?: CustomAxiosResponse<T, D>);
	response?: CustomAxiosResponse<T, D>;
}

export interface ReqOpts {
	paramId?: string;
	params?: any;
	data?: any;
}

export interface ReqOptsConfig extends ReqOpts {
	method: string;
	url: string;
	requestConfig?: AxiosRequestConfig;
	usetoken?: boolean;
	isFormdata?: boolean;
	headers?: any;
};

export interface ReqList {
	name: string;
	url: string;
	method?: string;
	usetoken?: boolean;
	isFormdata?: boolean;
	headers?: any;
}

export interface ApiFnMap {
	[propName: string]: Function | any;
}