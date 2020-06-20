/*
 * @Date: 2020-06-02 17:45:33
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-19 11:43:05
 */ 
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Quotes} from './components';
import {Toast} from 'antd-mobile';
import styles from './index.less';

const namespace = 'market';
@connect(({market, loading}) => ({
  market,
  loading
}))
class index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      span: 86400
    };
    this.dispatch = this.props.dispatch;
    this.fetchAllPriceBatch = this.fetchAllPriceBatch.bind(this); // 行情数据
    this.fetchRate = this.fetchRate.bind(this); // 汇率
  }
  componentDidMount() {
    const {market} = this.props;
    const {quotesData, rateData} = market;
    if (!quotesData) {
      Toast.loading('加载中', 0, null, true);
      this.fetchAllPriceBatch();
    }
    if (!rateData) {
      this.fetchRate();
    }
    this.timer = setInterval(() => {
      this.fetchAllPriceBatch();
    }, 1000 * 6);
  }
  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
  }
  fetchAllPriceBatch() {
    this.dispatch({
      type: `${namespace}/allPriceBatch`,
      payload: {
        symbols: 'btc_usdt,eth_usdt,eos_usdt,bch_usdt,bsv_usdt,etc_usdt,ltc_usdt,xrp_usdt,trx_usdt',
        span: this.state.span
      }
    }).then((res) => {
      Toast.hide();
    })
  }
  fetchRate() {
    this.dispatch({
      type: `${namespace}/rate`,
      payload: {}
    });
  }

  getCnyRate() {
    const {market} = this.props;
    const {rateData} = market;
    let result = 7;
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
    const {market} = this.props;
    const {quotesData} = market;
    let quotesDataArr = [];
    for (let key in quotesData) {
      quotesDataArr.push({
        symbol: key,
        data: quotesData[key]
      });
    }
    
    return (
      <div className={styles.marketWp}>
        <div className={styles.quotesInner}>
          {quotesDataArr.map((item, index) => {
            return <Quotes isApp={this.state.isApp} key={index} {...item} rate={rate}></Quotes>;
          })}
        </div>
      </div>
    );
  }
}

export default index;


