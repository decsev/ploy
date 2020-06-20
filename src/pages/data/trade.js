/*
 * @Date: 2020-03-09 10:58:41
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-19 18:25:27
 */
import React from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import {MyPicker} from 'components';
import {Button, Modal, Toast, Flex, NavBar, Icon} from 'antd-mobile';
import {TradeSummary, TradeChart} from './components';
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
    this.state = {};
  }
  componentDidMount() { }
  updateSummary() {
    this.refs.tradeSummary.doFetch();
  }
  render() {
    const {inTab} = this.props;
    if (!inTab) {
      return (
        <div className="page-container page-container-three">
          <div className="page-innerContainer">
            <div className="header-title">
              <NavBar
                icon={<Icon type="left" />}
                onLeftClick={() => {
                  this.props.history.go(-1);
                }}
              >
                合约主力资金
              </NavBar>
            </div>
            <div className="scroll-container">
              <div className="main-container" style={{minHeight: '100%'}}>
                <div className="cpContainer">
                  <TradeSummary ref="tradeSummary" dispatch={this.props.dispatch}></TradeSummary>
                  <TradeChart
                    dispatch={this.props.dispatch}
                    app={this.props.app}
                    updateSummary={() => {
                      this.updateSummary();
                    }}
                  ></TradeChart>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <div className="inTabContainer">
      <TradeSummary ref="tradeSummary" dispatch={this.props.dispatch}></TradeSummary>
      <TradeChart
        dispatch={this.props.dispatch}
        app={this.props.app}
        updateSummary={() => {
          this.updateSummary();
        }}
      ></TradeChart>
    </div>
  }
}

export default Index;
