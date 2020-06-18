/*
 * @Date: 2020-06-09 17:32:08
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-16 18:20:43
 */ 
import React, {PureComponent} from 'react';
import Router from 'umi/router';
import {BizIcon} from 'components';
import styles from './index.less';

class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { };
    this.delete = this.delete.bind(this);
  }
  delete(event) {
    const {del, data} = this.props;
    const {id} = data;
    if (del) {
      del(id);
    }
    event.stopPropagation();
  }
  render() {
    const {data} = this.props;
    const {exchange, account, access_id, create_time, id} = data || {};
    return (
      <div className={styles.apiItem} onClick={() => {
        Router.push(`/user/api/edit/${id}`)
      }}>
        <div className={styles.okex}>
          <p>{exchange}</p>
          <p>账号：{account}</p>
          <p>apiKey：{access_id.replace(/^(.{5})(.*)$/, '$1*****')}</p>
          <p>创建时间：{create_time}</p>
        </div>
        <span className={styles.delete} onClick={this.delete}><BizIcon type="delete"></BizIcon></span>
      </div>
    );
  }
}

export default index;