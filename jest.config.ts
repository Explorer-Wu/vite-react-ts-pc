/*
 * https://jestjs.io/docs/configuration
 */
import type {Config} from 'jest';

const path = require('path');

const config: Config = {
  // 测试根目录
  rootDir: path.resolve(__dirname, './'),
  // Jest 的检索文件的根目录， 类似于webpack的alias配置，可以自行定义多个路径别名
  roots: ["<rootDir>/src/", "<rootDir>/tests/"],
  // 每次测试之后运行的代码，或者环境变量
  setupFilesAfterEnv: ["<rootDir>/tests/jestSetup.ts"],
  // setupFiles: ["<rootDir>/tests/jestSetup.ts"],
  preset: 'ts-jest',
  // 测试环境： node/jsdom，可以使用 js 的注释语法指定 @jest 的测试环境
  testEnvironment: "jsdom",
  // 转换器
  transform: {
    // 将.js后缀的文件使用babel-jest处理
    "^.+\\.(js|jsx)$": "babel-jest", // "@swc/jest",
    "^.+\\.(ts|tsx)$": "ts-jest",
    // "^.+\\.css$": "<rootDir>/tests/config/cssTransform.ts",
    // "^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)": "<rootDir>/tests/config/fileTransform.js",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/tests/config/mediaImgTransform.js",
  },
  // 转换器要忽略的路径(使用正则匹配) 
  // 将不忽略 lodash-es, other-es-lib 这些es库, 从而使babel-jest去处理它们
  transformIgnorePatterns: [
    // "<rootDir>/node_modules/(?!(lodash-es|other-es-lib))",
    // "<rootDir>/node_modules/(?!camelcase)",
    "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$",
    "^.+\\.module\\.(css|less|sass|scss)$",
  ],
  testPathIgnorePatterns: [
    "/node_modules/"
  ],
  // watchPathIgnorePatterns: [ "/node_modules/" ],
  // Stop running tests after `n` failures
  bail: 1,
  verbose: true,
  // 是否应该收集测试覆盖率
  collectCoverage: true,
  // Jest 输出覆盖的目录
  coverageDirectory: "coverage",
  // 从哪里收集测试覆盖率
  collectCoverageFrom: [
    // "src/**/*.{js,jsx,ts,tsx}",
    "tests/**/*.{ts,tsx}", // js,jsx,
    "!src/**/*.d.ts",
    "!types/**/*.d.ts",
    // "!mocks/**",
  ],
  // 正则匹配忽略覆盖收集路径
  coveragePathIgnorePatterns: [
    "/node_modules/",
  ],
  // 指定哪种程序确定代码覆盖率
  // coverageProvider: "v8" || "babel",
  // 模块路径， 一个可选的用来设置 NODE_PATH 环境变量的配置
  // 值为一个用来表示需要模块额外去查找的路径的绝对路径的数组
  // node默认引入模块是去查找node_modules下的模块，这个配置项可以配置一些别的查找路径。
  modulePaths: [ "<rootDir>/src", "<rootDir>/tests" ], // "<rootDir>/node_modules",
  // 模块名映射
  moduleNameMapper: {
    // "^react-native$": "react-native-web",
    "^.+\\.(css|less|sass|scss)$": "identity-obj-proxy",
    // '\\.(css|less)$': 'identity-obj-proxy',
    // Used to dedupe `styled-component` when run `npm link` in development
    // '^styled-components$': '<rootDir>/node_modules/styled-components',
    // Support import ~
    '^~(.*)': "<rootDir>/node_modules/$1",
    '^@/(.*)': "<rootDir>/src/$1",
  },
  // 模块文件扩展
  moduleFileExtensions: [
    "tsx",
    "ts",
    "web.js",
    "js",
    "mjs",
    "cjs",
    "web.ts",
    "web.tsx",
    "json",
    "web.jsx",
    "jsx",
    "node",
  ],
  // 自定义使用的监听文件变化的插件数组
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
  testMatch: [
    "./tests/*.ts?(x)",
    "./tests/**/*.ts?(x)",
    "**/?(*.)+(spec|test|unit).ts?(x)" // 匹配测试文件 [jt]s?(x)
  ],
  resetMocks: true,
  clearMocks: true,
  // All imported modules in your tests should be mocked automatically
  // automock: false,

  // The directory where Jest should store its cached dependency information
  // cacheDirectory: "/private/var/folders/xg/9156vqlj1rzfw092vnc_d3f00000gn/T/jest_dx",

  // jest 指定覆盖率报告者
  // coverageReporters: [
  //   "json",
  //   "text",
  //   "lcov",
  //   "clover"
  // ],

  // 覆盖率最小阀值
  // coverageThreshold: undefined, ["json", "lcov", "text", "clover"]

  // A path to a custom dependency extractor
  // dependencyExtractor: undefined,

  // Make calling deprecated APIs throw helpful error messages
  // errorOnDeprecated: false,

  // The default configuration for fake timers
  // fakeTimers: {
  //   "enableGlobally": false
  // },

  // Force coverage collection from ignored files using an array of glob patterns
  // forceCoverageMatch: [],

  // A path to a module which exports an async function that is triggered once before all test suites
  // globalSetup: undefined,

  // A path to a module which exports an async function that is triggered once after all test suites
  // globalTeardown: undefined,

  // A set of global variables that need to be available in all test environments
  // globals: {},

  // The maximum amount of workers used to run your tests. Can be specified as % or a number. E.g. maxWorkers: 10% will use 10% of your CPU amount + 1 as the maximum worker number. maxWorkers: 2 will use a maximum of 2 workers.
  // maxWorkers: "50%",

  // An array of directory names to be searched recursively up from the requiring module's location
  // moduleDirectories: [
  //   "node_modules"
  // ],

  // An array of regexp pattern strings, matched against all module paths before considered 'visible' to the module loader
  // modulePathIgnorePatterns: [],

  // Activates notifications for test results
  // notify: false,

  // An enum that specifies notification mode. Requires { notify: true }
  // notifyMode: "failure-change",

  // A preset that is used as a base for Jest's configuration
  // preset: undefined,

  // Run tests from one or more projects
  // projects: undefined,

  // Use this configuration option to add custom reporters to Jest
  // reporters: undefined,

  // Reset the module registry before running each individual test
  // resetModules: false,

  // A path to a custom resolver
  // resolver: undefined,

  // Automatically restore mock state and implementation before every test
  // restoreMocks: false,

  // A list of paths to directories that Jest should use to search for files in

  // Allows you to use a custom runner instead of Jest's default test runner
  // runner: "jest-runner",

  // The number of seconds after which a test is considered as slow and reported as such in the results.
  // slowTestThreshold: 5,

  // A list of paths to snapshot serializer modules Jest should use for snapshot testing
  // snapshotSerializers: [],

  // Options that will be passed to the testEnvironment
  // testEnvironmentOptions: {},

  // Adds a location field to test results
  // testLocationInResults: false,

  // The regexp pattern or array of patterns that Jest uses to detect test files
  // testRegex: [],

  // This option allows the use of a custom results processor
  // testResultsProcessor: undefined,

  // This option allows use of a custom test runner
  // testRunner: "jest-circus/runner",

  // An array of regexp pattern strings that are matched against all modules before the module loader will automatically return a mock for them
  // unmockedModulePathPatterns: undefined,

  // Whether to use watchman for file crawling
  // watchman: true,
};

export default config;