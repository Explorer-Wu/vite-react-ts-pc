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
// declare module '*.svg';
declare module '*.svg' {
  export function ReactComponent(props: React.SVGProps<SVGSVGElement>): React.ReactElement;
  const url: string;
  export default url;
}

//  declare const REACT_APP_ENV: 'test' | 'dev' | 'uat' | 'prod' | false;
// declare module '*.css';
// declare module '*.less';
// declare module '*.scss';
// declare module '*.sass';
// declare module '*.scss' {
//   const content: Record<string, string>
//   export default content
// }
declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.sass' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.styl' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module 'mockjs';

declare module '*.ts';
declare module '*.tsx';