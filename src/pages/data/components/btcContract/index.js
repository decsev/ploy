/*
 * @Date: 2020-01-15 12:30:45
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-20 15:50:32
 */
import React, {PureComponent} from 'react';
import router from 'umi/router';
import {Row, Col, Icon} from 'antd-mobile';
import {config, deepGet, fNum, yiwanNum} from 'utils';
import './index.less';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  render() {
    const {explosive, openInterest, futurePosition} = this.props;
    const {buy, sell} = futurePosition || {};
    return (
      <div className="btcContractContainer">
        <div className="title">
          <span>BTC合约</span>
          <span>数据:BitMEX,OKEx,Huobi</span>
          <span
            className="icon iconfont icon-more"
            onClick={() => {
              router.replace({
                pathname: '/data',
                query: {
                  tabIndex: 3
                }
              })
            }}
          ></span>
        </div>
        <dl className="content">
          <dd>
            <h4>
              <span>持仓量($)</span>
              <span
                className="icon iconfont icon-iccaretright"
                onClick={() => {
                  router.replace({
                    pathname: '/data',
                    query: {
                      tabIndex: 3
                    }
                  })
                }}
              ></span>
            </h4>
            <h5>{yiwanNum(openInterest.now)}</h5>
            <p>
              <span>24H最高持仓</span>
              <span>{yiwanNum(openInterest.max)}</span>
            </p>
            <p>
              <span>24H最低持仓</span>
              <span>{yiwanNum(openInterest.min)}</span>
            </p>
          </dd>

          <dd>
            <h4>
              <span>24H爆仓量($)</span>
              <span
                className="icon iconfont icon-iccaretright"
                onClick={() => {
                  // router.push('/explosive');
                  router.replace({
                    pathname: '/home',
                    query: {
                      tabIndex: 4
                    }
                  })
                }}
              ></span>
            </h4>
            {explosive.max.type === 'close_short' && 
              <h5 className="down">{yiwanNum(explosive.max.amount)}(空单)</h5>
            }
            {explosive.max.type === 'close_long' && 
              <h5 className="up">{yiwanNum(explosive.max.amount)}(多单)</h5>
            }
            <p>
              <span>1H内总爆仓</span>
              <span>{yiwanNum(explosive.hour)}</span>
            </p>
            <p>
              <span>24H内总爆仓</span>
              <span>{yiwanNum(explosive.day)}</span>
            </p>
          </dd>
        </dl>

        {buy && sell && 
          <div className="ratioContainer">
            <div className="title">
              <span>OKEx精英账户</span>
            </div>
            <div className="ratio">
              <div className="long fl" style={{width: fNum(buy * 100, 2) + '%'}}>
                多 {fNum(buy * 100, 2)}%
              </div>
              <div className="short fl" style={{width: fNum(sell * 100, 2) + '%'}}>
                空 {fNum(sell * 100, 2)}%
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default Index;
