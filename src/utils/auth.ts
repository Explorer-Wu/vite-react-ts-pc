import { message } from 'antd';
import { httpFetch } from '@/apis/fetchHttp';
import CookieStorage from './storagecookies';
const { getCookie, setCookie, delCookie, getSession, setSession, delSession, clearSession } =
	CookieStorage;

export interface AuthInfo<T> {
	/** token */
	accessToken: string;
	/** 用于调用刷新accessToken的接口时所需的key */
	refreshKey: string;
	/** refreshKey 的过期时间  */
	expires: T;
}

/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
	return 'Bearer ' + token;
};

// 从sessionStorage中获取token
export function getUserToken(): any {
	// clearCookie('user_token');
	const userToken = getSession('user_token');
	return {
		accessToken: userToken ? userToken : '',
		refreshKey: getCookie('refresh_key'),
	};
}

export function setToken(data: AuthInfo<string | number>) {
	// | Date
	const { accessToken, refreshKey, expires } = data;
	// 如果后端直接设置时间戳，将此处代码改为expires = data.expires，然后把上面的AuthInfo<Date>改成AuthInfo<number>即可
	// let expires = new Date(data.expires).getTime();
	// const cookieString = JSON.stringify({ accessToken, expires });
	// setCookie(tokenKey, cookieString, expires);
	// {
	// 	expires: (expires - Date.now()) / 86400000,
	// });
	delSession('user_token');
	setSession('user_token', accessToken);
	setCookie('refresh_key', {
		refreshKey,
		expires,
	});
}

export function removeToken() {
	delSession('user_token');
	delCookie('refresh_key');
}

export async function fetchRefreshToken(token): Promise<any> {
  try {
    const resData: any = await httpFetch.ajax({
      url: '/auth/refreshToken',
      method: 'post',
      data: {
        token,
      },
    });
    const { code, data: { user_token, refresh_key, expires } } = resData;
    if (code === 'success') {
      // return {
      //   user_token,
      //   refresh_key,
      //   expires
      // };
      
      removeToken();
      user_token && refresh_key && expires && setToken({
        accessToken: user_token,
        refreshKey: refresh_key,
        expires,
      });
    }
  } catch (error: any) {
    message.error(`${error.message || 'token更新失败！'}`);
  }
}