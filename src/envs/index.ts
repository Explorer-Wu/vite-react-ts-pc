// interface IConfig {
//   env: string // 开发环境
//   mock?: string // mock数据
//   title: string // 项目title
//   baseUrl?: string // 项目api请求地址
//   authUrl?: string
//   wsUrl?: string
//   $cdn: string // cdn公共资源路径
// }

// 根据环境引入不同配置 process.env.NODE_ENV
// const envconf: IConfig = require('./env.' + process.env.NODE_ENV)
console.log("NODE_ENV:", process.env.NODE_ENV);

module.exports = require(`./env.${process.env.NODE_ENV}`);
