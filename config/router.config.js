/*
 * @Date: 2020-06-02 17:33:34
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-03 15:58:58
 */ 
export default [
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      {path: '/', component: './index/index', title: '行情'},
      {path: '/trade', component: './trade/index', title: '交易'},
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {path: '/user', component: './user/index', title: '我的'}
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
