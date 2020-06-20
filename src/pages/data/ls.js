/*
 * @Date: 2020-03-09 10:58:41
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-19 12:28:58
 */
import React from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import { } from 'components';
import {Button, Modal, Toast, Flex, NavBar, Icon} from 'antd-mobile';
import {Ratio} from './components';
import {numAdd, numSub, numMulti, numDiv} from 'utils';


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
      symbolList: ['BTC', 'ETH', 'BCH', 'LTC', 'EOS', 'BSV', 'ETC', 'XRP', 'TRX']
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
    const {inTab} = this.props;
    if (!inTab) {
      return (
        <div className="page-container page-container-three">
          <div className="page-innerContainer">
            {!inTab && <div className="header-title">
              <NavBar
                icon={<Icon type="left" />}
                onLeftClick={() => {
                  this.props.history.go(-1);
                }}
              >合约多空人数比</NavBar>
            </div>}
            <div className="scroll-container">
              <div className="main-container" style={{minHeight: '100%'}}>
                {(this.state.symbolList || []).map((symbol, index) => {
                  return <div key={index} id={symbol}><Ratio symbol={symbol} dispatch={this.props.dispatch} app={this.props.app}></Ratio></div>
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <div className="inTabContainer">
      {(this.state.symbolList || []).map((symbol, index) => {
        return <div key={index} id={symbol}><Ratio symbol={symbol} dispatch={this.props.dispatch} app={this.props.app}></Ratio></div>
      })}
    </div>

  }
}

export default Index;
