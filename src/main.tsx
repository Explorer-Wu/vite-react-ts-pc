/*--- React 18 使用 core-js 兼容性处理 ---*/
// import "core-js";
// import "regenerator-runtime";
// import "core-js/es";
// import 'core-js/es/map';
// import 'core-js/es/set';
// import 'core-js/es/promise';
// import "react-app-polyfill/ie9";
// import "react-app-polyfill/stable";
import React from 'react';
import { createRoot } from 'react-dom/client';
// import * as ReactDOM from "react-dom";
/*-- 使用 raf 的 package 增添 requestAnimationFrame 的 shim --*/
// import "raf/polyfill";

import App from './App';
import '@/assets/styles/antd-custom.less';
import '@/assets/styles/main/base.scss';
import '@/assets/styles/components/general.scss';
import '@/assets/css/app.scss';

// if (module && module.hot) {
//   module.hot.accept();
// }

/**
 * 使用 React 18 新API 并发模式写法进行dom render：
 * ReactDOM.createRoot(root).render(jsx) ———— 自动批量更新
 *
 * legacy 旧模式: ReactDOM.render(jsx, root)
 */

const Root = createRoot(document.getElementById('root')! as HTMLElement);
Root.render(<App />);
// Root.render(
// 	<React.StrictMode>
// 		<App />
// 	</React.StrictMode>,
// );
