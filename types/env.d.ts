/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string,
  // 更多环境变量...
  VITE_BASE_URL: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}