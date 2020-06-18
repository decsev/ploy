/*
 * @Date: 2020-06-02 17:45:33
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-15 16:37:34
 */ 
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {ScrollWrap, LinkItem} from 'components';
import styles from './index.less';
const namespace = 'user';

@connect(({user, loading}) => ({
  user,
  loading
}))
class index extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 

    };
    this.dispatch = this.props.dispatch;
    this.clientHeight = window.document.body.clientHeight;
    this.fetchInfo = this.fetchInfo.bind(this);
    this.logout = this.logout.bind(this);
  }
  componentDidMount() {
    this.fetchInfo();
  }
  fetchInfo() {
    this.dispatch({
      type: `${namespace}/info`,
      payload: {}
    })
  }
  logout() {
    this.dispatch({
      type: `${namespace}/logout`,
      payload: {}
    }).then((res) => {
      localStorage.removeItem('_t');
      localStorage.removeItem('_n');
      localStorage.removeItem('vip');
      localStorage.removeItem('level');
      localStorage.removeItem('phone');
      window.location.href = '/';
    })
  }
  render() {
    const {user} = this.props;
    const {userInfo} = user;
    const {phone, nickname} = userInfo;
    console.log('user', user)
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
                {(phone || '').replace(/^(\d{3})(\d{4})(\d{4})$/, '$1****$3')}
              </p>
              <p className={styles.nickName}>
                {nickname}
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
          link="/user/info"
          icon="userInfo"
          title="个人资料"
          iconClassName="userInfo"
        ></LinkItem>
        <LinkItem
          link="/user/changePw"
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
        <div className={styles.logout}>
          <span onClick={this.logout}>退出登录</span>
        </div>
      </div>
    );
  }
}

export default index;
