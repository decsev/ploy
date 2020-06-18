/*
 * @Date: 2020-06-10 11:17:55
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-10 11:20:54
 */ 
import React, {PureComponent} from 'react';
import styles from './index.less';

class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { };
  }
  render() {
    return (
      <div className={styles.infoWp}>
        <h4>实盘交易的API需要交易权限</h4>
        <p>获取API步骤：1登录交易所--2资产管理的API--3创建API</p>
      </div>
    );
  }
}

export default index;