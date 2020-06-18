import React, {PureComponent} from 'react';
import router from 'umi/router';
import styles from './index.less';
import {numMulti, config, fNum, fPrice} from 'utils';
import {BizIcon} from 'components';
const {APIV1} = config;

class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
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
  renderChange(v) {
    return (
      <p className={Number(v) >= 0 ? Number(v) === 0 ? `${styles.price} ${styles.eq}` : `${styles.price} ${styles.up}` : `${styles.price} ${styles.down}`}>
        {Number(v) >= 0
          ? Number(v) === 0
            ? '0%'
            : `+${numMulti(Number(v), 100)}%`
          : `${numMulti(Number(v), 100)}%`}
      </p>
    );
  }
  doGo(url) {
    let {isApp} = this.props;
    if (isApp) {
      this.go(`${APIV1}/m/#${url}`);
    } else {
      this.go(url);
    }
  }
  translateToCny(v, r) {
    return '¥' + fPrice(fNum(numMulti(v, r), 3));
  }
  render() {
    let {symbol, data, rate} = this.props;
    const {change, now, span} = data;
    const {ratio} = now;
    symbol = symbol.replace('_usdt', '').toUpperCase();
    const spanLabel = {
      '60': '1分钟',
      '180': '3分钟',
      '300': '5分钟',
      '900': '15分钟',
      '1800': '30分钟',
      '3600': '1小时',
      '7200': '2小时',
      '14400': '4小时',
      '21600': '6小时',
      '43200': '12小时',
      '86400': '24小时'
    };
    return (
      <dl className={styles.quotesContainer}>
        <dt>
          <span className={styles.title}><BizIcon type={symbol}></BizIcon><span className={styles.symbol}>{symbol}</span></span>
          {/* <i>{spanLabel[span]}</i> */}
        </dt>
        <dd
          onClick={() => {
            this.doGo(`/kline/${symbol}_USDT`);
          }}
        >
          <div>
            <p>{symbol}</p>
            <p>现货</p>
            {/* <p>
              价差 <span>{fNum(ratio.spot - 100, 0)}%</span>
            </p> */}
          </div>
          <div>
            <p>${fPrice(now.spot)}</p>
            <p>{this.translateToCny(now.spot, rate)}</p>
          </div>
          <div>{this.renderChange(change.spot)}</div>
        </dd>
        <dd
          onClick={() => {
            this.doGo(`/kline/${symbol}_USDT-THIS_WEEK`);
          }}
        >
          <div>
            <p>{symbol}</p>
            <p>当周</p>
            {/* <p>
              价差 <span>{fNum(ratio.this - 100, 2)}%</span>
            </p> */}
          </div>
          <div>
            <p>${fPrice(now.this)}</p>
            <p>{this.translateToCny(now.this, rate)}</p>
          </div>
          <div>{this.renderChange(change.this)}</div>
        </dd>
        <dd
          onClick={() => {
            this.doGo(`/kline/${symbol}_USDT-NEXT_WEEK`);
          }}
        >
          <div>
            <p>{symbol}</p>
            <p>次周</p>
            {/* <p>
              价差 <span>{fNum(ratio.next - 100, 2)}%</span>
            </p> */}
          </div>
          <div>
            <p>${fPrice(now.next)}</p>
            <p>{this.translateToCny(now.next, rate)}</p>
          </div>
          <div>{this.renderChange(change.next)}</div>
        </dd>
        <dd
          onClick={() => {
            this.doGo(`/kline/${symbol}_USDT-QUARTER`);
          }}
        >
          <div>
            <p>{symbol}</p>
            <p>季度</p>
            {/* <p>
              价差 <span>{fNum(ratio.quarter - 100, 2)}%</span>
            </p> */}
          </div>
          <div>
            <p>${fPrice(now.quarter)}</p>
            <p>{this.translateToCny(now.quarter, rate)}</p>
          </div>
          <div>{this.renderChange(change.quarter)}</div>
        </dd>
      </dl>
    );
  }
}

export default Index;
