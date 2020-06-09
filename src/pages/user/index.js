/*
 * @Date: 2020-06-02 17:45:33
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-09 19:25:59
 */ 
import React, {PureComponent} from 'react';
import {ScrollWrap, LinkItem} from 'components';
import styles from './index.less';

class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { 

    };
    this.clientHeight = window.document.body.clientHeight;
  }
  render() {
    return (
      <div className={styles.userWp}>
        <div className={styles.header}>
          <h6 className={styles.appName}>BitWin</h6>
          <dl>
            <dt className={styles.logo}>
              <img src="/image/logo.png"></img>
            </dt>
            <dd>
              <p className={styles.phone}>
              13538831277
              </p>
              <p className={styles.nickName}>
              币圈老韭菜
              </p>
            </dd>
          </dl>
        </div>
        <LinkItem
          link="/user/api/list"
          icon="api"
          title="交易所API"
          iconClassName="api"
          isLast
        ></LinkItem>

        <LinkItem
          link="/test"
          icon="userInfo"
          title="个人资料"
          iconClassName="userInfo"
        ></LinkItem>
        <LinkItem
          link="/test"
          icon="pw"
          title="修改密码"
          iconClassName="pw"
        ></LinkItem>
        <LinkItem
          link="/about"
          icon="about"
          title="关于我们"
          iconClassName="about"
          isLast
        ></LinkItem>
      </div>
    );
  }
}

export default index;
