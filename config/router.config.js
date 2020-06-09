/*
 * @Date: 2020-06-02 17:33:34
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-09 19:19:52
 */ 
export default [
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      {path: '/', component: './index/index', title: '行情'},
      {path: '/trade', component: './trade/index', title: '交易'},
      {path: '/about', component: './index/about', title: '关于我们'},
      {path: '/test', component: './test/index', title: '测试'},
      {path: '/formDemo', component: './formDemo/index', title: '表单demo'},
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {path: '/user', component: './user/index', title: '我的'},
          {path: '/user/api/list', component: './user/api/list', title: 'API管理'},
          {component: '404', title: '页面没找到'}
        ]
      },
      {
        path: '/exception',
        component: '../layouts/ExceptionLayout',
        routes: [
          {path: '/exception/403', title: '无权限', component: './exception/403'},
          {path: '/exception/500', title: '服务器出错了', component: './exception/500'}
        ]
      },
      {component: '404', title: '页面没找到'}
    ]
  }
];
