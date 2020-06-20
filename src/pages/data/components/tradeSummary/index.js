import React, { PureComponent } from 'react';
import router from 'umi/router';
import { Row, Col, Icon} from 'antd-mobile';
import {MyPicker} from 'components';
import { config, deepGet, deepClone, yiwanNum } from 'utils';

import './index.scss'

const namespace = 'tool';

class index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    };
    this.dispatch = this.props.dispatch;
  }
  componentDidMount() {
    this.doFetch();
  }
  doFetch() {
    // 获取数据
    this.dispatch({
      type: `${namespace}/tradesummary`,
      payload: {}
    }).then((data) => {
      if (data) {
        let list = [];
        Object.keys(data || {}).forEach((symbol) => {
          data[symbol].symbol = symbol;
          list.push(data[symbol]);
        })
        this.setState({
          list: list || []
        })
      }
    })
  }
  render() {
    const list = this.state.list || [];
    const content = <div>
      <p>单位时间内，大单主动性买盘的成交量（taker吃挂单买入），与大单主动性卖盘的成交量（taker吃挂单卖出）之差，为主力净流入资金。<br></br>统计OK火币交割合约和永续合约的主力大单资金：BTC单笔 12万U,其他币种单笔6万U。
      </p>
    </div>;
    if (list.length > 0) {
      return (
        <div className="summary">
          <table>
            <tbody>
              <tr><th>币种</th><th>1小时</th><th>3小时</th><th>8小时</th><th>24小时</th><th>48小时</th><th>7天</th></tr>
              {list.map((item, index) => {
                return <tr key={index}>
                  <td>{item.symbol}</td>
                  <td className={`${item['1h'] >= 0 ? "green" : "red"}`}>{yiwanNum(item['1h'])}</td>
                  <td className={`${item['3h'] >= 0 ? "green" : "red"}`}>{yiwanNum(item['3h'])}</td>
                  <td className={`${item['8h'] >= 0 ? "green" : "red"}`}>{yiwanNum(item['8h'])}</td>
                  <td className={`${item['24h'] >= 0 ? "green" : "red"}`}>{yiwanNum(item['24h'])}</td>
                  <td className={`${item['48h'] >= 0 ? "green" : "red"}`}>{yiwanNum(item['48h'])}</td>
                  <td className={`${item['7d'] >= 0 ? "green" : "red"}`}>{yiwanNum(item['7d'])}</td>
                </tr>
              })}
            </tbody>
          </table>
        </div>
      );
    } 
    return null;
  }
}

export default index;