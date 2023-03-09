/// <reference types="vite-plugin-svgr/client" />

/**
 * @filename global.d.ts
 * @description 全局ts声明
 */

import 'react';

declare module 'react' {
  interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
    jsx?: boolean;
    global?: boolean;
  }
}

declare module 'slash2';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';

//client.d.ts 有声明模块 '*.svg'、'*.css'、'*.scss'、'*.sass'、'*.less'、'*.styl'等;

//  declare const REACT_APP_ENV: 'test' | 'dev' | 'uat' | 'prod' | false;

declare module 'mockjs';

declare module '*.ts';
declare module '*.tsx';