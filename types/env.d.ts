/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  // 更多环境变量...
  NODE_ENV: string;
  // 是否mock数据
  VITE_APP_MOCK: boolean;
  // 输出打包路径
  VITE_APP_OUTPUT_DIR: boolean;
  PORT: number;
  // 正式api请求地址
  VITE_APP_API_BASE_URL: string;
  // 权限请求地址
  VITE_APP_API_AURTH_URL: string;
  // Socket推送地址
  VITE_APP_API_WS_URL: string;
  // CDN请求包地址
  VITE_APP_CDN_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}