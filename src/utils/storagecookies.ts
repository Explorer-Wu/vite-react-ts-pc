export default {
  stampTime: function(str: any): number {
    let timestamp;
    let str_n = +str.substring(0, str.length - 1);
    if (typeof str === 'string') {
      let str_t = str.substring(str.length - 1, str.length);
      switch(str_t) {
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
      timestamp = str_n * 1000;
    }
    return timestamp;
  },
  setCookie: function (name: string, value: any, time = '1h') {
    let endTime = this.stampTime(time);
    let now = new Date();
    if (typeof time === 'string') {
      now.setTime(now.getTime() + endTime * 1);
    } else {
      now.setTime(endTime);
    }
    console.log('now:', now, time);
    document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + now.toUTCString();
  },
  getCookie: function (name: string) {
    let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
    let arr = document.cookie.match(reg);
    return arr ? decodeURIComponent(arr[2]) : null;
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
  getTokenCookie: function (uname: string, reqhead?: any) {
    let name = uname + '=';
    let decodedCookie;
    if (typeof window === 'undefined') {
      decodedCookie = decodeURIComponent(reqhead.cookie);
    } else {
      decodedCookie = decodeURIComponent(document.cookie);
    }

    const deCookies = decodedCookie.split(';');
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
    // now.setTime(now.getTime() - 1);
    now.setTime(now.getTime() - 1000);
    let cook_name = this.getCookie(name);
    if (cook_name) {
      document.cookie = name + '=' + cook_name + ';expires=' + now.toUTCString();
    }
  },
  // 清除cookie
  clearCookie(name) {
    this.setCookie(name, '', -1);
  },
  checkCookie: function (name) {
    let cookieName = this.getCookie(name);
    if (cookieName) {
      return true;
    }
    return false;
  },
  setSession: function (name: string, value: string) {
    sessionStorage.setItem(name, value);
  },
  getSession: function (name: string) {
    const sessionName = sessionStorage.getItem(name);
    if (sessionName) {
      return decodeURIComponent(sessionName);
    }
    return null;
  },
  delSession: function (name: string) {
    let sessionName = sessionStorage.getItem(name);
    if (sessionName) sessionStorage.removeItem(name);
  },
};
