/*
 * @Date: 2020-06-02 17:45:33
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-18 11:18:50
 */ 
import React, {PureComponent} from 'react';
import Router from 'umi/router';
import {NavBar, BizIcon} from 'components';
import styles from './index.less';

class Index extends PureComponent {
  render() {
    const {route} = this.props;
    return (
      <React.Fragment>
        <div className={`wp ${styles.tradeWp}`}>
          {/* <dl className={styles.profit}>
            <dd>
              <h4>总盈亏</h4>
              <p>1000U</p>
            </dd>
            <dd>
              <h4>当日盈亏</h4>
              <p>1000U</p>
            </dd>
          </dl> */}
          <ul className={styles.toolList}>
            <li>
              <div className={styles.item} onClick={() => {
                Router.push('/strategy/list/1')
              }}>
                <BizIcon type="tradeList"></BizIcon>
                <p>网格交易</p>
              </div>
            </li>
            <li> 
              <div className={styles.item} onClick={() => {
                Router.push('/strategy/list/2')
              }}>
                <BizIcon type="tradeList"></BizIcon>
                <p>套利交易</p>
              </div>
            </li>
          </ul>
        </div>
      </React.Fragment>
    );
  }
}

export default Index;
