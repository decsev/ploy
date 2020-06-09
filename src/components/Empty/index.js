/*
 * @Date: 2020-06-02 17:52:41
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-09 16:48:18
 */ 
import React, {PureComponent} from 'react';
import {BizIcon} from 'components';
import Router from 'umi/router';
import styles from './index.less';

class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { };
  }
  render() {
    return (
      <div className={styles.empty}>
        {this.props.icon && <div className={styles.emptyIcon}><BizIcon type={this.props.icon}></BizIcon></div>}
        <div>{this.props.title || '暂无数据'}</div>
        <div className={styles.emptyMore}>{this.props.children}</div>
      </div>
    );
  }
}

export default index;
