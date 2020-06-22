import React, {PureComponent} from 'react';
import router from 'umi/router';
import {MyPicker} from 'components';
import {config, deepGet, fNum, deepClone, wanNum, getObjFromArray} from 'utils';

import styles from './volume.less'
import * as echarts from 'echarts';

const namespace = 'data';
const okTimeList = [
  {value: '5m', label: '5分钟'},
  {value: '1h', label: '1小时'},
  {value: '1d', label: '1天'}
]
// 1h, 4h, 12h, 1day
const huobiTimeList = [
  {value: '1h', label: '1小时'},
  {value: '4h', label: '4小时'},
  {value: '12h', label: '12小时'},
  {value: '1d', label: '1天'}
]
class volume extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      exhcangeList: [
        {label: 'okex', value: 'okex'}, 
        {label: 'huobi', value: 'huobi'}
      ],
      timeType: '1d',
      from: null,
      to: null,
      exchange: 'okex',
      open_interests: [], // 持仓量
      volumes: [], // 成交量 以张为计量
      amounts: [], // 成交量 以个为计量
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
      timeType: '1d'
    }, () => {
      this.doFetch();
    })
  }
  doFetch() {
    const {symbol} = this.props;
    const {timeType, from, to, exchange} = this.state;
    // 获取数据
    this.dispatch({
      type: `${namespace}/openInterestVolume`,
      payload: {
        symbol,
        type: timeType,
        from: from ? new Date(from).getTime() / 1000 : null,
        to: to ? new Date(to).getTime() / 1000 : null,
        exchange,
        open_interests: [], // 持仓量
        volumes: [], // 成交量
        timestamps: [], // 时间
        prices: [] // 价格
      }
    }).then((data) => {
      console.log('data', data)
      this.setState({
        ...data
      }, () => {
        this.doDraw();
      })
    })
  }
  doDraw() {
    const {unit} = this.props;
    const {open_interests, volumes, timestamps, prices, timeType, amounts} = this.state;

    let w = parseInt(document.body.clientWidth * 1);
    let h = parseInt(w * 0.7);

    if ((timestamps || []).length > 0) {
      this.myChart.hideLoading();
      let legend = ['持仓量', '交易量', '现货价格'];
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
            [legend[1]]: true,
            [legend[2]]: true
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
          },
          formatter: function(params) {
            let result = '';
            params.forEach(function(item, index) {
              result += item.marker + ' ' + item.seriesName + ' : ' + wanNum(item.value) + (item.seriesName === '交易量' || item.seriesName === '持仓量' ? ' ' + (unit ? '张' : '个') + '</br>' : '</br>');
            });
            return result;
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
            xAxisIndex: [0, 1],
            bottom: 0,
            start: 0,
            end: 100
          }
        ],
        grid: [
          {
            left: 60,
            right: 60,
            height: h * 360 / 600,
            backgroundColor: 'rgb(185, 42, 42)'
          },
          {
            left: 60,
            right: 60,
            top: h * 435 / 600,
            height: h * 110 / 600
          }
        ],
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            axisLine: {show: false},
            axisTick: {show: false},
            splitLine: {show: false},
            axisLabel: {show: false},
            data: xAxis,
            gridIndex: 0,
            axisPointer: {
              z: 100
            }
          },
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
            gridIndex: 1
          }
        
        ],
        yAxis: [
          {
            type: 'value',
            //name: legend[0], // 持仓量
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
                return wanNum(data, 0);
              }
            },
            axisLine: {
              show: false
            },
            gridIndex: 0
          },
          {
            type: 'value',
            // name: legend[1], // 交易量
            scale: true,
            boundaryGap: false,
            position: 'left',
            splitLineNumber: 20,
            min: function(value) {
              return value.min * 0.9;
            },
            max: function(value) {
              return value.max * 1.1;
            },
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
                color: ['#dedede', '#dedede'],
                opacity: 0.5
              }
            },
            axisLabel: {
              show: false,
              formatter: function(data) {
                return wanNum(data, 0);
              }
            },
            axisLine: {
              show: false
            },
            gridIndex: 1
          },
          {
            type: 'value',
            //name: legend[2], // 价格
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
            },
            gridIndex: 0
          }
        
        ],
        series: [
          {
            name: legend[0],
            type: 'line',
            data: unit ? open_interests : amounts,
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
            type: 'bar',
            data: volumes,
            xAxisIndex: 1,
            yAxisIndex: 1,
            lineStyle: {
              width: 2
            },
            symbol: 'none',
            smooth: true
          },
          {
            name: legend[2],
            type: 'line',
            data: prices,
            yAxisIndex: 2,
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
    const myDateProps = {
      startValue: from,
      endValue: to,
      handleChange: (startValue, endValue) => {
        // to Do 获取数据
        this.setState({
          from: startValue,
          to: endValue
        }, () => {
          if (startValue && endValue) {
            this.doFetch();
          }
        })
      }
    }

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
          <span onClick={props.onClick}>{symbol}<span className="text-blue">{this.state.exchange}<i className="icon iconfont icon-downSmall"></i></span>
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
      <div className={styles.volumeContainer}>
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

export default volume;