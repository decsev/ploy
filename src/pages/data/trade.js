/*
 * @Date: 2020-03-09 10:58:41
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-22 16:28:33
 */
import React from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import {MyPicker} from 'components';
import {Button, Modal, Toast, Flex, NavBar, Icon} from 'antd-mobile';
import {TradeSummary, TradeChart} from './components';
import {numAdd, numSub, numMulti, numDiv} from 'utils';
import styles from './trade.less';

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
    return <div className="inTabContainer">
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
  }
}

export default Index;
