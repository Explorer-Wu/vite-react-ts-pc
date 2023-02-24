import type { Dispatch } from 'react';

export type AuthStateType = {
	type?: string;
	pending?: boolean;
	authed?: boolean;
	token?: string;
	user?: object | null;
};

export enum AuthActionType {
	AuthCheck = 'CHECK',
	AuthLogout = 'LOGOUT',
	AuthLogin = 'LOGIN',
	AuthUpdate = 'UPDATE',
}

export type ActionPayload = {
	authed?: boolean;
	/** token */
	accessToken?: string;
	/** 用于调用刷新accessToken的接口时所需的key */
	refreshKey?: string;
	/** refreshKey 的过期时间  */
	expires?: string | number;
	userInfo?: object | null;
	// request: object;
};
export type AuthActionWithout = {
	type: AuthActionType.AuthCheck | AuthActionType.AuthLogout; // 'CHECK' | 'LOGIN' | 'LOGOUT' | 'UPDATE';
};
export type AuthActionWith = {
	type: AuthActionType.AuthLogin | AuthActionType.AuthUpdate;
	payload: ActionPayload;
};
export type AuthActionOpts = {
	// AuthActionWithout | AuthActionWith;
	type: AuthActionType;
	payload: ActionPayload;
};

// export type Dispatch;
export type Dispatcher = Dispatch<Partial<AuthActionOpts>>; // Dispatch<AuthActionOpts<string | number>>; (action: storyTableAction) => any;
/**
 * Partial<T> 是ts自身提供一种类型，作用是将传入的接口属性全部变为可选的
 * GlobalReducer 接口
 */
export type AuthContextProps = {
	authState: AuthStateType;
	authDispatch: Dispatcher;
};
