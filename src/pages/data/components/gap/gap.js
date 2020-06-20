/*
 * @Date: 2020-01-15 12:30:45
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-20 11:13:20
 */
import React, {PureComponent} from 'react';
import router from 'umi/router';
import {Row, Col, Icon} from 'antd-mobile';
import {BizIcon} from 'components';
import {config, deepGet} from 'utils';
import styles from './gap.less';

class gap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      span: 10,
      data: []
    };
  }
  componentDidMount() {
    this.doFetch();
    this.gapTimes = setInterval(() => {
      this.doFetch();
    }, this.state.span * 1000);
  }
  componentWillUnmount() {
    this.gapTimes && clearInterval(this.gapTimes);
  }
  /**
   * @description: 获取价差
   * @param {type}
   * @return:
   */

  doFetch() {
    const {dispatch, namespace} = this.props;
    dispatch({
      type: `${namespace}/gaplist`,
      payload: {
        ex: 'OKEX'
      }
    }).then(res => {
      this.formateGapData(deepGet(res, 'payload.data'));
    });
  }
  formateGapData(data) {
    if (data) {
      //   Object.keys(data).forEach(symbol => {
      //     data[symbol] = data[symbol].sort((a, b) => {
      //       return Math.abs(b.val) - Math.abs(a.val);
      //     });
      //   });
      //只取季度和现货价差
      let temp = [];
      Object.keys(data).forEach(symbol => {
        data[symbol].forEach((item, index) => {
          if (item.key === 'QS') {
            item.symbol = symbol;
            temp.push(item);
          }
        });
      });
      //   temp = temp.sort((a, b) => {
      //     return Math.abs(b.val) - Math.abs(a.val);
      //   });
      this.setState({
        data: temp
      });
    }
  }
  render() {
    if (this.state.data.length > 0) {
      return (
        <div className={styles.gapContainer}>
          <div className={styles.title}>
            <span>价差</span>
            <span
              className={styles.icon}
              onClick={() => {
                router.replace({
                  pathname: '/data',
                  query: {
                    tabIndex: 1
                  }
                })
              }}
            ><BizIcon type="more"></BizIcon></span>
          </div>
          <ul>
            {(this.state.data || []).map((item, index) => {
              //console.log(item);
              if (index < 3) {
                return (
                  <li
                    key={index}
                    onClick={() => {
                      router.push(`/viewGap/${item.symbol.toUpperCase()}_${item.key}`);
                    }}
                  >
                    <p>{item.symbol.toUpperCase()}</p>
                    <p className={item.val >= 0 ? 'up' : 'down'}>{item.val}</p>
                    <p>{item.key}</p>
                  </li>
                );
              }

              return null;
            })}
          </ul>
        </div>
      );
    }
    return null;
  }
}

export default gap;
