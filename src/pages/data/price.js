import React from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import {MyInput, Navigation, MyPicker, Quotes, QuotesSwiper} from 'components';
import {Button, Modal, Toast, NavBar} from 'antd-mobile';
import {Gap, Trade, LongShort, BtcContract} from './components';
import {deepClone, deepGet} from 'utils';

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
      span: localStorage.getItem('dataSpan') || '86400',
      isApp: false
    };
    this.dispatch = this.props.dispatch;
  }
  componentDidMount() {
    const {quotesData, rateData} = this.props.tool;
    if (!quotesData) {
      this.fetchAllPriceBatch(1);
    }
    if (!rateData) {
      this.fetchRate();
    }
    this.timer = setInterval(() => {
      this.fetchAllPriceBatch();
    }, 1000 * 6);
    setTimeout(() => {
      try {
        this.setState({
          isApp: true
        });
      } catch (e) {
        this.setState({
          isApp: false
        });
      }
    }, 500);
  }
  componentWillUnmount() {
    localStorage.setItem('dataSpan', this.state.span);
    clearInterval(this.timer);
  }
  componentDidUpdate() { }

  fetchRate() {
    this.dispatch({
      type: `${namespace}/rate`,
      payload: {}
    });
  }
  fetchAllPriceBatch(showloading) {
    if (showloading) {
      Toast.loading('加载中', 0, null);
    }
    this.dispatch({
      type: `${namespace}/allPriceBatch`,
      payload: {
        symbols: 'btc_usdt,eth_usdt,eos_usdt,bch_usdt,bsv_usdt,etc_usdt,ltc_usdt,xrp_usdt,trx_usdt',
        span: this.state.span
      }
    })
      .then(data => {
        if (showloading) {
          Toast.hide();
        }
      })
      .catch(err => {
        if (showloading) {
          Toast.hide();
        }
      });
  }

  getCnyRate() {
    const {rateData} = this.props.tool;
    let result = 6.8;
    if (rateData) {
      for (let i = 0; i < rateData.length; i++) {
        if (rateData[i].name === 'usd_cny') {
          result = rateData[i].rate;
          break;
        }
      }
    }
    return result;
  }
  render() {
    const rate = this.getCnyRate();

    const {quotesData} = this.props.tool;

    let quotesDataArr = [];
    for (let key in quotesData) {
      quotesDataArr.push({
        symbol: key,
        data: quotesData[key]
      });
    }
    return <div className="inTabContainer">
      <div className="quotesInner">
        {quotesDataArr.map((item, index) => {
          return <Quotes isApp={this.state.isApp} key={index} {...item} rate={rate}></Quotes>;
        })}
      </div>
    </div>
  }
}

export default Index;
