/*
 * @Date: 2020-03-09 10:58:41
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-22 16:45:44
 */
import React from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import { } from 'components';
import {Button, Modal, Toast, Flex, NavBar, Icon} from 'antd-mobile';
import {OtcChart} from './components';
import {numAdd, numSub, numMulti, numDiv} from 'utils';
import styles from './otc.less';


const {alert} = Modal;
const namespace = 'data';
@connect(({data, loading}) => ({
  data,
  loading
}))
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      symbolList: ['USDT', 'BTC', 'ETH', 'BCH', 'LTC', 'EOS', 'BSV', 'ETC', 'XRP', 'TRX']
    };
  }
  componentDidMount() {
  }
  componentWillUnmount() {
  }
  go(url) {
    const reg = /^(http:\/\/|https:\/\/).*$/g;
    if (url === '') {
      return;
    }
    if (reg.test(url)) {
      window.location.href = url;
      return false;
    }
    router.push(url);
  }
  render() {
    return <div className={styles.otcContainer}>
      {(this.state.symbolList || []).map((symbol, index) => {
        return <div key={index} id={symbol}><OtcChart symbol={symbol} dispatch={this.props.dispatch} app={this.props.app}></OtcChart></div>
      })}
    </div>

  }
}

export default Index;
