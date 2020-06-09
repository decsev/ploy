/*
 * @Date: 2020-06-09 17:32:08
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-09 17:56:12
 */ 
import React, {PureComponent} from 'react';
import {BizIcon} from 'components';
import styles from './index.less';

class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { };
    this.delete = this.delete.bind(this);
  }
  delete() {
    const {del} = this.props;
    if (del) {
      del();
    }
    console.log('delete')
  }
  render() {
    const {data} = this.props;
    const {account, apiKey, addDate} = data || {};
    return (
      <div className={styles.apiItem}>
        <div className={styles.okex}>
          <p>账号：{account || '812463158@qq.com'}</p>
          <p>apiKey：{apiKey || 'e7067*****'}</p>
          <p>创建时间：{addDate || '2020/06/20 20:30:59'}</p>
        </div>
        <span className={styles.delete} onClick={this.delete}><BizIcon type="delete"></BizIcon></span>
      </div>
    );
  }
}

export default index;