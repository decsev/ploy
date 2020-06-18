/*
 * @Date: 2020-06-18 17:24:35
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-18 18:22:37
 */ 
import React from 'react';
import {connect} from 'dva';
import Router from 'umi/router';
import {NavBar} from 'components';
import {Tv} from 'components';
import styles from './index.less';
import {changeTitle} from 'utils';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.dispatch = this.props.dispatch;
  }
  componentDidMount() {
    const {match} = this.props;
    const {params} = match;
    const {symbol} = params;
    changeTitle(`${symbol} - 实时价格`);
  }
  componentWillUnmount() {

  }
  componentDidUpdate() {

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
    Router.push(url);
  }
  render() {
    const {match} = this.props;
    const {params} = match;
    const {symbol} = params;
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;
    const tvProps = {
      containerId: 'klineTvContainer',
      symbol,
      interval: 1,
      disabled_features: [
        'header_compare',
        'header_undo_redo',
        'header_screenshot',
        'header_saveload'
      ],
      width, 
      height
    }
    return (
      <React.Fragment>
        {/* <NavBar
          icon="back"
          onLeftClick={() => {
            Router.goBack();       
          }}
        >
          {symbol}
        </NavBar> */}
        <Tv {...tvProps}></Tv>
      </React.Fragment>
    )
  }
}
export default Index;
