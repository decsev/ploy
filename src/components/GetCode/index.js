/*
 * @Date: 2020-06-17 11:39:14
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-17 16:06:39
 */ 
import React, {PureComponent} from 'react';
import Router from 'umi/router';
import styles from './index.less';
import {config} from 'utils';
const {countdownTime} = config;

class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      times: 0
    };
    this.doFetch = this.doFetch.bind(this);
  }
  doFetch() {
    const {disabled, doFetch} = this.props;
    if (!disabled) {
      doFetch(() => {this.countdown(countdownTime);});
    }
  }
  /**
   * @description 倒计时
   */
  countdown = (t) => {
    if (t === 0) {return false;}
    setTimeout(() => {
      this.setState({
        times: --t
      });
      this.countdown(t);
    }, 1000);
  }
  render() {
    const {disabled} = this.props;
    const {times} = this.state;
    let getCountBtn = <span className={`${disabled ? styles.disabled : null}`} onClick={this.doFetch}>获取验证码</span>;
    if (times) {
      getCountBtn = <span>{times}秒后重新获取</span>;
    }
    return (
      <div className={styles.getCodeWp}>
        {getCountBtn}
      </div>
    );
  }
}

export default index;