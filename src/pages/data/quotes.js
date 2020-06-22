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
    const {quotesData, rateData, usdtusdData} = this.props.data;
    if (!quotesData) {
      Toast.loading('加载中', 0, null, true);
      this.fetchAllPriceBatch();
    }
    if (!usdtusdData) {
      this.fetchUsdtusd();
    }
    if (!rateData) {
      this.fetchRate();
    }
    this.timer = setInterval(() => {
      this.fetchAllPriceBatch();
      this.fetchUsdtusd();
    }, 1000 * 6);
    // btc合约、多空比数据
    this.fetchContractdata();
  }
  componentWillUnmount() {
    localStorage.setItem('dataSpan', this.state.span);
    clearInterval(this.timer);
  }
  componentDidUpdate() { }
  fetchContractdata() {
    this.dispatch({
      type: `${namespace}/contractdataSummary`,
      payload: {}
    });
  }
  fetchRate() {
    this.dispatch({
      type: `${namespace}/rate`,
      payload: {}
    });
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
  fetchUsdtusd() {
    this.dispatch({
      type: `${namespace}/usdtusd`,
      payload: {}
    });
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
  getCnyRate() {
    const {rateData} = this.props.data;
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
    const season = [
      {
        label: '1分钟',
        value: '60'
      },
      {
        label: '3分钟',
        value: '180'
      },
      {
        label: '5分钟',
        value: '300'
      },
      {
        label: '15分钟',
        value: '900'
      },
      {
        label: '30分钟',
        value: '1800'
      },
      {
        label: '1小时',
        value: '3600'
      },
      {
        label: '2小时',
        value: '7200'
      },
      {
        label: '4小时',
        value: '14400'
      },
      {
        label: '6小时',
        value: '21600'
      },
      {
        label: '12小时',
        value: '43200'
      },
      {
        label: '24小时',
        value: '86400'
      }
    ];
    const myPickerPorps = {
      data: season,
      cols: 1,
      value: [this.state.span],
      title: '选择涨跌幅计算周期',
      extra: '请选择涨跌幅计算周期',
      onOk: v => {
        if (v[0] !== this.state.span) {
          this.setState(
            {
              span: v[0]
            },
            this.fetchAllPriceBatch
          );
          localStorage.setItem('dataSpan', v[0]);
        }
      },
      CustomChildren: props => {
        return (
          <span onClick={props.onClick} className="right">
            <i className="iconfont icon-Setup"></i>
          </span>
        );
      }
    };
    const {quotesData, usdtusdData, contractdata} = this.props.data;
    let bannerData = null;
    if (quotesData && usdtusdData) {
      const {
        btc_usdt,
        eth_usdt,
        eos_usdt,
        bch_usdt,
        bsv_usdt,
        etc_usdt,
        ltc_usdt,
        xrp_usdt,
        trx_usdt
      } = quotesData;
      bannerData = [
        [
          {k: 'USDT/USD', v: usdtusdData, r: usdtusdData - 1, icon: 'icon-USDT'},
          {k: 'BTC/USDT', v: btc_usdt.now.spot, r: btc_usdt.change.spot, icon: 'icon-BTC'},
          {k: 'ETH/USDT', v: eth_usdt.now.spot, r: eth_usdt.change.spot, icon: 'icon-ETH'}
        ],
        [
          {k: 'EOS/USDT', v: eos_usdt.now.spot, r: eos_usdt.change.spot, icon: 'icon-EOS'},
          {k: 'BCH/USDT', v: bch_usdt.now.spot, r: bch_usdt.change.spot, icon: 'icon-BCH'},
          {k: 'BSV/USDT', v: bsv_usdt.now.spot, r: bsv_usdt.change.spot, icon: 'icon-BSV'}
        ],
        [
          {k: 'LTC/USDT', v: etc_usdt.now.spot, r: etc_usdt.change.spot, icon: 'icon-LTC'},
          {k: 'ETC/USDT', v: ltc_usdt.now.spot, r: ltc_usdt.change.spot, icon: 'icon-ETC'},
          {k: 'XRP/USDT', v: xrp_usdt.now.spot, r: xrp_usdt.change.spot, icon: 'icon-XRP'}
        ],
        [{k: 'TRX/USDT', v: trx_usdt.now.spot, r: trx_usdt.change.spot, icon: 'icon-TRX'}]
      ];
    }
    let quotesDataArr = [];
    for (let key in quotesData) {
      quotesDataArr.push({
        symbol: key,
        data: quotesData[key]
      });
    }
    // console.log('quotesDataArr', quotesDataArr);
    const swiperProps = {
      containerClassName: 'quotesBanner',
      swiperPro: {
        direction: 'horizontal', // vertical, horizontal
        loop: false, // false, true
        autoplay: false
      },
      needPagination: false, // false, true
      swiperSlides: null,
      bannerData: bannerData,
      isApp: this.state.isApp
    };

    const gapProps = {
      namespace,
      dispatch: this.dispatch
      
    };
    const tradeProps = {
      namespace,
      dispatch: this.dispatch
    };
    return <div className="inTabContainer">
      {!!bannerData && <QuotesSwiper {...swiperProps}></QuotesSwiper>}

      {/* <Gap {...gapProps}></Gap> */}

      {contractdata && 
        <LongShort longShortData={deepGet(contractdata, 'long_short')}></LongShort>
      }

      {contractdata && 
        <BtcContract
          explosive={deepGet(contractdata, 'explosive')}
          openInterest={deepGet(contractdata, 'open_interest')}
          futurePosition={deepGet(contractdata, 'future_position')}
        ></BtcContract>
      }

      <Trade {...tradeProps}></Trade>

      {/* <div className="quotesInner">
        {quotesDataArr.map((item, index) => {
          return <Quotes isApp={this.state.isApp} key={index} {...item} rate={rate}></Quotes>;
        })}
      </div> */}
    </div>
  }
}

export default Index;
