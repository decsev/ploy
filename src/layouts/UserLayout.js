/*
 * @Date: 2020-06-02 17:33:34
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-18 11:12:49
 */

import React, {PureComponent} from 'react';
import MenuBar from '@/components/MenuBar';
import NProgress from 'nprogress';
import withRouter from 'umi/withRouter';
import {connect} from 'dva';
import {randomId} from 'utils';
import '@/layouts/nprogress.less';

NProgress.configure({showSpinner: false});

// 底部有bar菜单
const BarRoutes = [
  '/strategy', 
  '/market', 
  '/user'
];
let currHref = '';

class UserLayout extends PureComponent {
  componentDidMount() {
    const localStorageRegnumber = localStorage.getItem('_n');
    const localStorageToken = localStorage.getItem('_t');
    if (!localStorageRegnumber || !localStorageToken) {
      window.location.href = `/login?t=${randomId()}`
    }
  }
  render() {
    const {children, location, loading} = this.props;
    const {href} = window.location; // 浏览器地址栏中地址
    if (currHref !== href) {
      // currHref 和 href 不一致时说明进行了页面跳转
      NProgress.start(); // 页面开始加载时调用 start 方法
      if (!loading.global) {
        // loading.global 为 false 时表示加载完毕
        NProgress.done(); // 页面请求完毕时调用 done 方法
        currHref = href; // 将新页面的 href 值赋值给 currHref
      }
    }

    if (BarRoutes.indexOf(location.pathname) < 0) {
      return <div>{children}</div>;
    }
    const localStorageRegnumber = localStorage.getItem('_n');
    const localStorageToken = localStorage.getItem('_t');
    if (!localStorageRegnumber || !localStorageToken) {
      return null;
    }
    return (
      <div className="layout">
        <MenuBar pathname={location.pathname}>{children}</MenuBar>
      </div>
    );
  }
}

export default withRouter(connect(({app, loading}) => ({app, loading}))(UserLayout));
