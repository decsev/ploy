import React, {PureComponent} from 'react';
import router from 'umi/router';
import {MyPicker} from 'components';
import {config, deepGet, fNum, deepClone, wanNum, getObjFromArray} from 'utils';
import styles from './ratio.less'
import * as echarts from 'echarts';

const okTimeList = [
  {value: '5m', label: '5分钟'},
  {value: '1h', label: '1小时'},
  {value: '1d', label: '1天'}
]
// 1h, 4h, 12h, 1day
const huobiTimeList = [
  {value: '5m', label: '5分钟'},
  {value: '15m', label: '15分钟'},
  {value: '30m', label: '30分钟'},
  {value: '60m', label: '1小时'},
  {value: '4h', label: '4小时'},
  {value: '1d', label: '1天'}
]
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exhcangeList: [
        {label: 'okex', value: 'okex'},
        {label: 'huobi', value: 'huobi'}
      ],
      timeType: okTimeList[2].value,
      from: null,
      to: null,
      exchange: 'okex',
      ratios: [], // 人数比
      timestamps: [], // 时间
      prices: [], // 价格
      timeList: deepClone(okTimeList)
    };
    this.dispatch = this.props.dispatch;
  }
  componentDidMount() {
    this.myChart = echarts.init(document.getElementById(`echartId_${this.props.symbol}`));
    this.doFetch();
  }
  timeTypeChange(e) {
    this.setState({
      timeType: e,
      from: null,
      to: null
    }, () => {
      this.doFetch();
    })
  }
  exchangeChange(val) {
    let timeList = okTimeList;
    if (val === 'huobi') {
      timeList = huobiTimeList;
    }
    this.setState({
      exchange: val,
      timeList,
      timeType: timeList[2].value
    }, () => {
      this.doFetch();
    })
  }
  doFetch() {
    const {symbol, namespace} = this.props;
    const {timeType, from, to, exchange} = this.state;
    // 获取数据
    this.dispatch({
      type: `${namespace}/longShortPositionRatio`,
      payload: {
        symbol,
        type: timeType,
        from: from ? new Date(from).getTime() / 1000 : null,
        to: to ? new Date(to).getTime() / 1000 : null,
        exchange
      }
    }).then((data) => {
      this.setState({
        ...data
      }, () => {
        this.doDraw();
      })
    })
  }
  doDraw() {
    const {ratios, timestamps, prices, timeType} = this.state;
    const {symbol} = this.props;
    if ((timestamps || []).length > 0) {
      this.myChart.hideLoading();
      let legend = ['合约多空人数比', '现货价格'];
      const xAxis = timestamps.map((item) => {
        return new Date(item * 1000).format('MM/dd hh:mm');
      })
      let option = {
        textStyle: {
          color: '#5b5f6a'
        },
        backgroundColor: '#212425',
        label: {
          textStyle: {
            color: 'rgba(255, 255, 255, 0.3)'
          }
        },
        labelLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)'
          }
        },
        animation: false,
        color: ['#617eca', '#02b302', '#37a2da'],
        legend: {
          data: legend,
          top: 20,
          selected: {
            [legend[0]]: true,
            [legend[1]]: true
          },
          show: true,
          textStyle: {
            color: '#c2c9d1'
          }
        },

        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          backgroundColor: 'rgba(245, 245, 245, 0.8)',
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          textStyle: {
            color: '#000'
          }
          // position: function(pos, params, el, elRect, size) {
          //   var obj = {top: 10};
          //   obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 100;
          //   return obj;
          // }
          // extraCssText: 'width: 170px'
        },
        axisPointer: {
          link: {xAxisIndex: 'all'},
          label: {
            backgroundColor: '#777'
          }
        },
        toolbox: {
          show: false,
          feature: {
            mark: {show: false},
            dataZoom: {show: true},
            dataView: {show: true, readOnly: false},
            magicType: {show: false, type: ['line', 'bar', 'k']},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        dataZoom: [
          {
            type: 'slider',
            show: false,
            xAxisIndex: [0],
            bottom: 0,
            start: 0,
            end: 100
          }
        ],
        grid: {
          left: 50,
          right: 50,
          bottom: 40,
          top: 50
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            axisTick: {show: false},
            splitLine: {show: false},
            axisLine: {show: false},
            data: xAxis,
            axisLabel: {
              formatter: function(data) {
                if (timeType === '1d' || timeType === '1day') {
                  return new Date(data).format('MM-dd');
                }
                return new Date(data).format('MM/dd hh:mm');
              }
            },
            axisPointer: {
              z: 100
            }
          }],
        yAxis: [
          {
            type: 'value',
            //name: legend[0], // 人数比
            scale: true,
            boundaryGap: ['20%', '20%'],
            position: 'left',
            axisTick: {show: false},
            splitLine: {
              show: false,
              lineStyle: {
                type: 'dashed'
              }
            },
            splitArea: {
              show: true,
              areaStyle: {
                color: ['#eeeeee', '#d0d0d0'],
                opacity: 0.5
              }
            },
            axisLabel: {
              formatter: function(data) {
                return wanNum(data, 2);
              }
            },
            axisLine: {
              show: false
            }
          },
          {
            type: 'value',
            //name: legend[1], // 价格
            scale: true,
            boundaryGap: ['20%', '20%'],
            position: 'right',
            axisTick: {show: false},
            splitLine: {
              show: false,
              lineStyle: {
                type: 'dashed'
              }
            },
            axisLabel: {
              formatter: function(data) {
                return wanNum(data, 2);
              }
            },
            axisLine: {
              show: false
            }
          }

        ],
        series: [
          {
            name: legend[0],
            type: 'line',
            data: ratios,
            yAxisIndex: 0,
            // areaStyle: {
            //   color: '#cce9ff'
            // },
            lineStyle: {
              width: 2
            },
            symbol: 'none',
            smooth: true
          },
          {
            name: legend[1],
            type: 'line',
            data: prices,
            yAxisIndex: 1,
            lineStyle: {
              width: 2
            },
            symbol: 'none',
            smooth: true
          }
        ]
      };
      this.myChart.setOption(option, true);
    } else {
      this.myChart.showLoading('default', {
        text: '暂无数据',
        color: '#0070cc',
        textColor: '#8a8e91',
        maskColor: 'rgba(0, 0, 0, 0.1)'
      }
      );
    }
  }
  render() {
    let w = parseInt(document.body.clientWidth * 1 - 25);
    let h = parseInt(w * 0.7);
    const {symbol} = this.props;
    const {from, to} = this.state;

    const myPickerPorps = {
      data: this.state.exhcangeList,
      cols: 1,
      value: [this.state.exchange],
      title: '选择交易所',
      extra: '选择交易所',
      onOk: v => {
        if (v[0] !== this.state.exchange) {
          this.setState(
            {
              exchange: v[0]
            }, () => {
              this.exchangeChange(v[0])
            });
        }
      },
      CustomChildren: props => {
        return (
          <span onClick={props.onClick}>
            {symbol} {this.state.exchange === 'huobi' && <span>大户</span>}<span className="text-blue">{this.state.exchange}<i className="icon iconfont icon-downSmall"></i></span>
          </span>
        );
      }
    };

    const myPickerTimePorps = {
      data: this.state.timeList,
      cols: 1,
      value: [this.state.timeType],
      title: '选择时间',
      extra: '选择时间',
      key: this.state.timeType,
      onOk: v => {
        if (v[0] !== this.state.timeType) {
          this.setState(
            {
              timeType: v[0]
            }, () => {
              this.timeTypeChange(v[0]);
            });
        }
      },
      CustomChildren: props => {
        return (
          <span className="text-blue" onClick={props.onClick}>{getObjFromArray(this.state.timeList, 'value', this.state.timeType).label}<i className="icon iconfont icon-downSmall"></i></span>
        );
      }
    };

    return (
      <div className={styles.volumeContainer} id="volumeContainer">
        <div className={styles.title}>
          <div className={styles.left}>
            <MyPicker {...myPickerPorps}></MyPicker>
          </div>
          <div className={styles.right}>
            <MyPicker {...myPickerTimePorps}></MyPicker>
          </div>
        </div>
        <div className={styles.content}>
          <div id={`echartId_${this.props.symbol}`} style={{width: `${w}px`, height: `${h}px`, margin: '0 auto'}}></div>
        </div>
      </div>
    );
  }
}

export default Index;