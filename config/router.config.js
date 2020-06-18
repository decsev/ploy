/*
 * @Date: 2020-06-02 17:33:34
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-18 17:23:52
 */ 
export default [
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      // {path: '/', component: './index/index', title: '行情'},
      {path: '/about', component: './index/about', title: '关于我们'},
      {path: '/reg', component: './index/reg', title: '手机号注册'},
      {path: '/login', component: './index/login', title: '手机号登录'},
      {path: '/findPw', component: './index/findPw', title: '找回密码'}, // step1
      {path: '/findPw/:token', component: './index/findPw', title: '找回密码'}, // step2
      {path: '/test', component: './test/index', title: '测试'},
      {path: '/formDemo', component: './formDemo/index', title: '表单demo'},
      {path: '/kline/:symbol', component: './index/kline', title: 'k线'},
      {
        path: '/market',
        component: '../layouts/BasicLayout',
        routes: [
          {path: '/market', component: './market/index', title: '行情'}
        ]
      },
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {path: '/user', component: './user/index', title: '我的'},
          {path: '/user/api/list', component: './user/api/list', title: 'API管理'},
          {path: '/user/api/add', component: './user/api/add', title: '添加API'},
          {path: '/user/api/edit/:id', component: './user/api/add', title: '编辑API'},
          {path: '/user/info', component: './user/info', title: '个人信息'},
          {path: '/user/changePw', component: './user/changePw', title: '修改密码'},
          {component: '404', title: '页面没找到'}
        ]
      },
      {
        path: '/strategy',
        component: '../layouts/UserLayout',
        routes: [
          {path: '/strategy', component: './strategy/index', title: '交易'},
          {path: '/strategy/list/:type', component: './strategy/list', title: '策略列表'},
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
