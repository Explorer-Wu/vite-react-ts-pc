export default {
	stampTime: (str: string | number): number => {
		let timestamp;
		if (typeof str === 'string') {
			let str_n = +str.substring(0, str.length - 1);
			let str_t = str.substring(str.length - 1, str.length);
			switch (str_t) {
				case 's':
					timestamp = str_n * 1000;
					break;
				case 'h':
					timestamp = str_n * 60 * 60 * 1000;
					break;
				case 'd':
					timestamp = str_n * 24 * 60 * 60 * 1000;
					break;
				case 'm':
					timestamp = str_n * 30 * 24 * 60 * 60 * 1000;
					break;
				case 'y':
					timestamp = str_n * 365 * 24 * 60 * 60 * 1000;
					break;
				default:
					timestamp = str_n * 60 * 60 * 1000;
			}
		} else {
			timestamp = str * 1000;
		}
		return timestamp;
	},
	// function getCookie(cname){
	//     var name = cname + "=";
	//     var ca = document.cookie.split(';');
	//     for(var i=0; i<ca.length; i++) {
	//         var c = ca[i].trim();
	//         if (c.indexOf(name)===0) { return c.substring(name.length,c.length); }
	//     }
	//     return "";
	// }

	// 获取cookie
	getCookie: function (name: string) {
		let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
		let arr = document.cookie.match(reg);
		// return arr ? decodeURIComponent(arr[2]) : null;
		try {
			if (arr && arr.length >= 3) return JSON.parse(decodeURIComponent(arr[2] as string));
			return null;
		} catch (error) {
			return null;
		}
	},
	// 设置cookie
	setCookie: function (name: string, value: any, time: string | number = '1h') {
		let now = new Date();
		let endTime = this.stampTime(time);
		if (typeof time === 'string') {
			now.setTime(now.getTime() + endTime * 1);
		} else {
			now.setTime(endTime);
		}
		// console.log("now:", now, time);
		document.cookie =
			name + '=' + encodeURIComponent(JSON.stringify(value)) + ';expires=' + now.toUTCString();
	},
	getTokenCookie: function (uname: string, reqhead?: any) {
		let name = uname + '=';
		let decodedCookie;
		if (typeof window === 'undefined') {
			decodedCookie = decodeURIComponent(reqhead.cookie);
		} else {
			decodedCookie = decodeURIComponent(document.cookie);
		}

		let deCookies = decodedCookie.split(';');
		for (let i = 0; i < deCookies.length; i++) {
			let c = deCookies[i];
			while (c.charAt(0) === ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) === 0) {
				return c.substring(name.length, c.length);
			}
		}
		return null;
	},
	// 删除cookie
	delCookie: function (name: string) {
		let now = new Date();
		now.setTime(now.getTime() - 10000);
		var cook_name = this.getCookie(name);
		if (cook_name) {
			// debugger
			document.cookie = name + '=' + cook_name + ';expires=' + now.toUTCString();
		}
	},
	// 清除cookie
	clearCookie: function (name: string) {
		this.setCookie(name, '', -1);
	},
	// 核查cookie
	checkCookie: function (name: string) {
		let cookieName = this.getCookie(name);
		if (cookieName) {
			return true;
		}
		return false;
		// let user = this.getCookie('username');
		// if (user !== '') {
		// 	alert('欢迎 ' + user + ' 再次访问');
		// } else {
		// 	user = prompt("请输入你的名字: ','");
		// 	if (user !== '' && user !== null) {
		// 		this.setCookie('username', user, 30);
		// 	}
		// }
	},

	// 获取localStorage
	getLocalStorage: (name: string) => {
		const value = window.localStorage.getItem(name);
		try {
			if (value) return JSON.parse(decodeURIComponent(value) as string);
		} catch (error) {
			return value;
		}
	},
	// 存储localStorage
	setLocalStorage: function (name: string, value: any) {
		window.localStorage.setItem(name, encodeURIComponent(JSON.stringify(value)));
	},
	// 移除sessionStorage
	delLocalStorage: function (name: string) {
		window.localStorage.removeItem(name);
	},
	// 清除所有localStorage
	clearLocalStorage: function () {
		window.localStorage.clear();
	},
	// 获取sessionStorage
	getSession: function (name: string) {
		let value = window.sessionStorage.getItem(name);
		try {
			if (value) return JSON.parse(decodeURIComponent(value) as string);
			return null;
		} catch (error) {
			return value;
		}
	},
	// 存储sessionStorage
	setSession: function (name: string, value: any) {
		window.sessionStorage.setItem(name, encodeURIComponent(JSON.stringify(value)));
	},
	// 移除sessionStorage
	delSession: function (name: string) {
		let value = window.sessionStorage.getItem(name);
		if (value !== null && value !== undefined) window.sessionStorage.removeItem(name);
	},
	// 清除所有sessionStorage
	clearSession: function () {
		window.sessionStorage.clear();
	},
};
