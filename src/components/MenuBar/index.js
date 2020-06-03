/*
 * @Author: Jan-superman 
 * @Date: 2018-10-09 15:37:17 
 * @Last Modified by: superman
 * @Last Modified time: 2018-12-24 23:26:50
 */

import React, {PureComponent} from 'react';
import {TabBar} from 'antd-mobile';
import Router from 'umi/router';
import PropTypes from 'prop-types';
import BizIcon from '../BizIcon';
import theme from '@/theme';

const tabBarData = [
  {
    title: '行情',
    icon: 'market',
    selectedIcon: 'market',
    link: '/'
  },
  {
    title: '交易',
    icon: 'trade',
    selectedIcon: 'trade',
    link: '/trade'
  },
  {
    title: '我的',
    icon: 'user',
    selectedIcon: 'user',
    link: '/user'
  }
];

class MenuBar extends PureComponent {
  render() {
    const {isMenubar, children, pathname} = this.props;
    return (
      <TabBar hidden={isMenubar} tintColor={theme.primaryColor} barTintColor="#000" unselectedTintColor="#ccc">
        {tabBarData.map(({title, icon, selectedIcon, link}) => 
          <TabBar.Item
            key={link}
            title={title}
            icon={<BizIcon type={icon} />}
            selectedIcon={<BizIcon type={selectedIcon} />}
            selected={pathname === link}
            onPress={() => Router.push(`${link}`)}
          >
            {/* 匹配到的children路由进行渲染 */}
            {children.props.location.pathname === link && children}
          </TabBar.Item>
        )}
      </TabBar>
    );
  }
}

MenuBar.defaultProps = {
  isMenubar: false,
  children: null,
  pathname: '/'
};

MenuBar.propTypes = {
  isMenubar: PropTypes.bool,
  children: PropTypes.node,
  pathname: PropTypes.string
};

export default MenuBar;
