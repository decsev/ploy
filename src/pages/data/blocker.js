/*
 * @Date: 2020-03-09 10:58:41
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-19 12:22:21
 */
import React from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import { } from 'components';
import {Button, Modal, Toast, Flex, NavBar, Icon} from 'antd-mobile';
import {BlockChart, ProfitabilityChart} from './components';
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
    return <div className="inTabContainer">
      <BlockChart dispatch={this.props.dispatch} app={this.props.app}></BlockChart>
      <ProfitabilityChart dispatch={this.props.dispatch} app={this.props.app}></ProfitabilityChart>
    </div>

  }
}

export default Index;
