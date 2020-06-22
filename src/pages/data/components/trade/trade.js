/*
 * @Date: 2020-01-16 11:05:30
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-22 17:16:51
 */
import React, {PureComponent} from 'react';
import router from 'umi/router';
import {Row, Col, Icon} from 'antd-mobile';
import {MyPicker, BizIcon} from 'components';
import {config, deepGet, deepClone, yiwanNum} from 'utils';
import './trade.less';
import * as echarts from 'echarts';

class trade extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pickerValue: '1h',
      symbol: [],
      data: {}
    };
  }
  componentDidMount() {
    this.doFetch();
    this.myChart = echarts.init(document.getElementById('echart'));
  }
  doFetch() {
    const {dispatch, namespace} = this.props;
    dispatch({
      type: `${namespace}/tradesummary`,
      payload: {}
    }).then(res => {
      if (res) {
        this.setState(
          {
            symbol: Object.keys(res),
            data: res
          },
          () => {
            this.doDraw();
          }
        );
      }
    });
  }
  doDraw() {
    const {pickerValue, symbol, data} = this.state;
    let mydata = [];
    symbol.forEach(item => {
      mydata.push(Math.abs(data[item][pickerValue]));
    });
    let addVal = 0;
    const option = {
      tooltip: {
        show: false,
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      toolbox: {
        show: false,
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        left: 0,
        right: 0,
        top: 20,
        bottom: 20
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        axisTick: {show: false},
        splitLine: {show: false},
        axisLine: {show: false},
        data: symbol,
        axisLabel: {
          interval: 0,
          textStyle: {fontSize: '10', color: '#5b5f6a'}
        }
      },
      yAxis: {
        type: 'value',
        axisTick: {show: false},
        splitLine: {show: false},
        axisLine: {show: false},
        axisLabel: {
          formatter: '{value} W'
        },
        axisPointer: {
          snap: true
        },
        show: false
      },
      series: [
        {
          type: 'bar',
          smooth: true,
          data: mydata,
          itemStyle: {
            normal: {
              color: function(param) {
                if (data[param.name][pickerValue] >= 0) {
                  return '#3a9555';
                } 
                return '#bf504f';
                
              },
              label: {
                show: true,
                position: 'top',
                textStyle: {fontSize: '10'},
                formatter: function(param) {
                  return yiwanNum(data[param.name][pickerValue]);
                }
              }
            }
          }
        }
      ]
    };
    this.myChart.setOption(option, true);
  }
  render() {
    const data = [
      {
        label: '1h',
        value: '1h'
      },
      {
        label: '3h',
        value: '3h'
      },
      {
        label: '8h',
        value: '8h'
      },
      {
        label: '24h',
        value: '24h'
      },
      {
        label: '48h',
        value: '48h'
      },
      {
        label: '7d',
        value: '7d'
      }
    ];
    const myPickerPorps = {
      data: data,
      cols: 1,
      value: [this.state.pickerValue],
      title: '选择时间周期',
      extra: '选择时间周期',
      onOk: v => {
        if (v[0] !== this.state.pickerValue) {
          this.setState(
            {
              pickerValue: v[0]
            },
            () => {
              this.doFetch();
            }
          );
        }
      },
      CustomChildren: props => {
        return (
          <span onClick={props.onClick} className="contractTitle">
            合约主力净流入
            <span className="text-blue">
              {this.state.pickerValue}
              <i className="icon iconfont icon-downSmall"></i>
            </span>
          </span>
        );
      }
    };
    let w = parseInt(document.body.clientWidth * 1 - 50);
    return (
      <div className="tradeContainer">
        <div className="title">
          <span className="changePeriod">
            <MyPicker {...myPickerPorps}></MyPicker>
          </span>

          <span
            className="icon"
            onClick={() => {
              router.replace({
                pathname: '/data',
                query: {
                  tabIndex: 4
                }
              })
            }}
          ><BizIcon type="more"></BizIcon></span>
        </div>
        <div id={'echart'} style={{width: `${w}px`, height: 100 + 'px'}}></div>
      </div>
    );
  }
}

export default trade;
