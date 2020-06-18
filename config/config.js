/*
 * @Date: 2020-06-02 17:45:33
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-18 18:11:14
 */ 
// https://umijs.org/config/
import path from 'path';
import pageRoutes from './router.config';
import theme from '../src/theme';

export default {
  // add for transfer to umi
  plugins: [
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        fastClick: true,
        dynamicImport: {
          loadingComponent: './components/PageLoading/index',
          webpackChunkName: true
        },
        title: {
          defaultTitle: 'tokenwin'
        },
        dll: false,
        hd: false,
        routes: {
          exclude: []
        },
        hardSource: false
      }
    ]
  ],
  disableCSSModules: false,
  // 路由配置
  routes: pageRoutes,
  // Theme for antd-mobile
  // https://github.com/ant-design/ant-design-mobile/blob/master/components/style/themes/default.less
  theme: {
    'brand-primary': theme.primaryColor
  },
  lessLoaderOptions: {
    javascriptEnabled: true
  },
  cssnano: {
    mergeRules: false
  },
  targets: {
    android: 5,
    ios: 7,
    chrome: 58,
    ie: 9
  },
  outputPath: './dist',
  hash: true,
  proxy: {
    '/api': {
      target: 'https://tokenwin.one/',
      changeOrigin: true,
      pathRewrite: {'^/api': ''}
    }
  },
  alias: {
    '@': path.resolve(__dirname, '../src'),
    components: path.resolve(__dirname, '../src/components'),
    utils: path.resolve(__dirname, '../src/utils'),
    config: path.resolve(__dirname, '../src/utils/config'),
    services: path.resolve(__dirname, '../src/services'),
    models: path.resolve(__dirname, '../src/models'),
    assets: path.resolve(__dirname, '../src/assets')
  },
  extraPostCSSPlugins: [
    require('postcss-px-to-viewport')({
      viewportWidth: 750, // 视窗的宽度，对应的是我们设计稿的宽度，一般是750
      viewportHeight: 1334, // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
      unitPrecision: 3, // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
      viewportUnit: 'vw', // 指定需要转换成的视窗单位，建议使用vw
      // selectorBlackList: ['.ignore', '.hairlines', '.ant-', '.am-', '.tvContainer'], // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
      minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
      mediaQuery: false // 允许在媒体查询中转换`px`
    })
  ]
};
