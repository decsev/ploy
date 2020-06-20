/*
 * @Date: 2020-06-02 17:45:33
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-20 16:56:25
 */ 
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import Router from 'umi/router';
import {} from './components';
import {Toast, Tabs} from 'antd-mobile';
import styles from './index.less';

import GapPro from './gapPro.js';
import Ls from './ls.js';
import Cp from './cp.js';
import Explosive from './explosive.js';
import Trade from './trade.js';
import Quotes from './quotes.js';
import Price from './price.js';
import Otc from './otc.js';
import Block from './blocker.js';

const namespace = 'data';
@connect(({data, loading}) => ({
  data,
  loading
}))
class index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      span: localStorage.getItem('dataSpan') || '86400',
      isApp: false,
      left: true,
      right: true
    };
    this.dispatch = this.props.dispatch;
  }
  componentDidMount() {
  }
  componentWillUnmount() {
  
  }
  renderContent(o) {
    const {key} = o;
    let result = null;
    switch (key) {
      case 0:
        result = <Quotes inTab={true}></Quotes>
        break
      case 1:
        result = <GapPro inTab={true}></GapPro>
        break
      case 2:
        result = <Ls inTab={true}></Ls>
        break
      case 3:
        result = <Cp inTab={true}></Cp>
        break;
      case 4:
        result = <Explosive inTab={true}></Explosive>
        break;
      case 5:
        result = <Trade inTab={true}></Trade>
        break;
      case 6:
        result = <Price inTab={true}></Price>
        break;
      case 7:
        result = <Otc inTab={true}></Otc>
        break;
      case 8:
        result = <Block inTab={true}></Block>
        break;
      default:
        break;
    }
    return result;
  }
  render() {
    const tabs = [
      {title: '首页', key: 0, sort: 0},
      {title: '价格', key: 6, sort: 1},
      {title: '价差', key: 1, sort: 2},
      {title: '多空比', key: 2, sort: 3},
      {title: '持仓量', key: 3, sort: 4},
      {title: '爆仓量', key: 4, sort: 5},
      {title: '主力资金', key: 5, sort: 6},
      {title: 'OTC溢价', key: 7, sort: 7},
      {title: '挖矿难度', key: 8, sort: 8}
    ]
    const {location} = this.props;
    const {query} = location;
    const currentTab = Number(query.tabIndex) || 0;
    return (
      <Tabs
        tabBarPosition="top"
        prefixCls="tabTop"
        onChange={(e) => {
          const {sort} = e;
          Router.push({
            pathname: location.pathname,
            query: {
              ...query,
              tabIndex: sort
            }
          })
        }}
        page={currentTab}
        tabs={tabs}
        swipeable={true}
        destroyInactiveTab={true}
        prerenderingSiblingsNumber={0}
        animated={false}
        renderTabBar={props => <Tabs.DefaultTabBar {...props} page={5} />}
        tabBarUnderlineStyle={{border: '0px'}}
        tabBarTextStyle={{fontSize: '14px', padding: '0px'}}
        tabBarBackgroundColor="#1a1c1d"
        tabBarActiveTextColor="#c2c9d1"
        tabBarInactiveTextColor="#868686"
        tabBarTextStyle={{fontSize: '10px'}}
        tabBarUnderlineStyle={{borderWidth: '0px', borderBottom: '0px solid #c2c9d1'}}
      >
        {o => {
          return this.renderContent(o);
        }}
      </Tabs>
    );
  }
}
export default index;


