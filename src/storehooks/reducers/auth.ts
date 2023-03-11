import { useReducer, type Dispatch } from 'react';
import Axios from 'axios';
import ApisAuth from '@/apis/modules/auth';
import HistoryRule from '@/router/history';
// import CookieStorage from '@/utils/storagecookies';
import { getUserToken, formatToken, setToken, removeToken } from '@/utils/auth';
import { AuthStateType, AuthActionType, AuthActionOpts, Dispatcher } from './types';

const authInitState: AuthStateType = {
	pending: true,
	authed: !getUserToken() ? false : true,
	token: getUserToken().accessToken,
	user: {
		id: null,
		name: '',
	},
};

function initStateFn(initVal): AuthStateType {
	return { ...initVal };
}

async function fetchDataFn(payload, errorReturn = undefined) {
	try {
		let fetchData = await payload;
		console.log('fetchData:', fetchData);
		return fetchData;
	} catch (error) {
		console.log(error);
		if (errorReturn !== undefined) {
			return errorReturn;
		} else {
			throw error;
		}
	}
}

async function fetchReducer(state, action) {
	const newData = await action.payload;
	if (action.type) {
		// console.log("action-fetch:", action.type, newData)
		return { ...state, ...newData };
	} else {
		return state;
	}
}

// function extraReducer({ reducer, initVal, initFn }) {
//   // const [state, dispatch] = useReducer(reducer, initVal, initFn);
//   return useReducer(reducer, initVal, initFn);
// }

function dispatchAuthMiddleware(next: Dispatch<AuthActionOpts>): Dispatcher {
	return async (action: AuthActionOpts) => {
		switch (action.type) {
			case 'UPDATE':
				const { user_token, refresh_key, expires } = await ApisAuth.refreshToken({
					data: {
						token: getUserToken().accessToken,
					},
				});
				const { type, payload } = action;
				next({
					type,
					payload: {
						...payload,
						// authed: authed !== undefined ? authed : state.authed,
						authed: !getUserToken().accessToken ? false : true,
						accessToken: user_token,
						refreshKey: refresh_key,
						expires,
					},
				});

				// LinkTo(0);
				break;

			default:
				next(action);
		}
	};
}

function authReducer(state: AuthStateType, action?: AuthActionOpts): AuthStateType {
	const { authed, accessToken, refreshKey, expires, userInfo } = action.payload;
	const { LinkTo, HrefTo } = HistoryRule();

	switch (action.type) {
		case AuthActionType.AuthCheck:
			// if (!authed) HrefTo('/auth/login');
			// else LinkTo(0);
			return { ...state, type: action.type, authed: !!getUserToken() };

		case AuthActionType.AuthLogin:
			// if (router.currentRoute.value.query.redirect) {
			//   router.push(router.currentRoute.value.query.redirect);
			// } else {
			//   router.push('/views/checkorders');
			// }

			if (!!getUserToken()) {
				removeToken();
				accessToken &&
					refreshKey &&
					expires &&
					setToken({
						accessToken,
						refreshKey,
						expires,
					});
			}
			Axios.defaults.headers.common.Authorization = formatToken(accessToken);
			return {
				...state,
				pending: false,
				authed: authed! && !!getUserToken(),
				token: accessToken,
				user: userInfo,
			};

		case AuthActionType.AuthLogout:
			removeToken();
			Axios.defaults.headers.common.Authorization = '';
			// router.push('/login');
			return initStateFn(action.payload);

		case AuthActionType.AuthUpdate:
			if (!action.payload.authed && action.payload.authed !== undefined) {
				removeToken();
				Axios.defaults.headers.common.Authorization = '';
			} else {
				accessToken &&
					refreshKey &&
					expires &&
					(Axios.defaults.headers.common.Authorization = formatToken(accessToken)) &&
					setToken({
						accessToken,
						refreshKey,
						expires,
					});
			}

			return {
				...state,
				type: action.type,
				pending: false,
				// authed: authed !== undefined ? authed : state.authed,
				authed: !getUserToken().accessToken ? false : true,
				token: getUserToken().accessToken,
			};

		default:
			return state;
	}
}

export { authInitState, initStateFn, authReducer, dispatchAuthMiddleware, fetchReducer };
