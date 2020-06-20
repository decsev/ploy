import React from 'react';
import {connect} from 'dva';
// import BScroll from 'better-scroll';
import router from 'umi/router';
import {MyPicker} from 'components';
import {Button, Modal, Toast, Flex, NavBar, Icon} from 'antd-mobile';
import {Row, Col, Table} from 'antd';
import {TradeSummary, TradeChart} from './components';
// import 'antd-mobile/dist/antd-mobile.css';
// import './explosive.scss';
import {
  numAdd,
  numSub,
  numMulti,
  numDiv,
  deepClone,
  getObjFromArray,
  fNum,
  yiwanNum,
  fPrice,
  changeTitle
} from 'utils';
import * as echarts from 'echarts';

const {alert} = Modal;
const namespace = 'tool';

const timeList = [
  {value: '1h', label: '1小时'},
  {value: '3h', label: '3小时'},
  {value: '8h', label: '8小时'},
  {value: '24h', label: '24小时'},
  {value: '48h', label: '48小时'},
  {value: '7d', label: '7天'}
];

const spanList = [
  {value: '1m', label: '1分钟'},
  {value: '5m', label: '5分钟'},
  {value: '15m', label: '15分钟'},
  {value: '30m', label: '30分钟'}
];

const priceLen = {
  BTC: 0,
  ETH: 0,
  BCH: 0,
  BSV: 0,
  LTC: 0,
  EOS: 2,
  ETC: 2,
  XRP: 4,
  TRX: 4
};

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeType: timeList[0].value,
      timeList: deepClone(timeList),
      spanList: deepClone(spanList),
      span: '1m',
      symbolList: ['BTC', 'ETH', 'BCH', 'LTC', 'EOS', 'BSV', 'ETC', 'XRP', 'TRX'],
      symbol: 'BTC',
      timestamps: [],
      prices: [],
      close_longs: [],
      close_shorts: [],
      detail: null,
      orders: null,
      long: null,
      short: null,
      sum: null,
      volumes: [],
      refreshSpan: 6, //自动刷新时间：6秒
      drawNum: 0
    };
    this.dispatch = this.props.dispatch;
  }
  componentDidMount() {
    this.myChart = echarts.init(document.getElementById('echartId'));
    this.setTitle();
    this.doFetch();
    this.doInterval();
  }
  componentWillUnmount() { }
  setTitle() {
    let title = `${this.state.symbol} 爆仓量-TokenWin`;
    changeTitle(title);
    if (window.parent.setTopTitle) {
      window.parent.setTopTitle(title);
    }
  }
  timeTypeChange(e) {
    this.setState(
      {
        timeType: e
      },
      () => {
        this.doFetch();
        // setTimeout(() => {
        //   this.props.updateSummary();
        // }, 2000);
      }
    );
  }
  refreshSpanChange(value) {
    console.log('refreshSpanChange', value);
    this.state.refreshSpan = value;
    // this.setState({
    //   refreshSpan: value
    // });
    this.doFetch();
    this.doInterval();
  }
  doInterval() {
    clearInterval(this.refreshTimer);
    this.refreshTimer = setInterval(() => {
      console.log('refreshSpan:', this.state.refreshSpan);
      this.doFetch();
    }, this.state.refreshSpan * 1000);
  }
  changeSelectSymbol(symbol) {
    this.setState(
      {
        symbol
      },
      () => {
        this.setTitle();
        this.doFetch();
        // setTimeout(() => {
        //   this.props.updateSummary();
        // }, 2000);
      }
    );
  }
  doFetch() {
    const {timeType, symbol, span} = this.state;
    // 获取数据
    this.dispatch({
      type: `${namespace}/explosive`,
      payload: {
        symbol,
        type: timeType,
        span
      }
    }).then(data => {
      if (data) {
        const {summary, list, detail, orders} = data || {};
        const {
          timestamps,
          prices,
          okex_quarter,
          huobi_quarter,
          close_longs,
          close_shorts,
          volumes
        } = list || {};
        const {long, short} = summary || {};
        // const {longNum, shortNum, longVolume, shortVolume, total} = detail;
        const sum = {};
        (Object.keys(long) || []).forEach(key => {
          sum[key] = (long[key] || 0) + (short[key] || 0);
        });
        this.setState(
          {
            timestamps: timestamps || [],
            prices: prices || [],
            okex_quarter: okex_quarter || [],
            huobi_quarter: huobi_quarter || [],
            close_longs: close_longs || [],
            close_shorts: close_shorts || [],
            detail: detail || {},
            orders: orders || [],
            long: long || {},
            short: short || {},
            sum: sum || {},
            volumes: volumes || []
          },
          () => {
            this.doDraw();
          }
        );
      }
    });
  }
  doDraw() {
    let w = parseInt(document.body.clientWidth * 1);
    let h = parseInt(w * 0.7);
    let {
      timestamps,
      prices,
      okex_quarter,
      huobi_quarter,
      close_longs,
      close_shorts,
      symbol,
      volumes
    } = this.state;

    if ((timestamps || []).length > 0) {
      let inVolume = [];
      let outVolume = [];
      (volumes || []).forEach(item => {
        if (item >= 0) {
          inVolume.push(item);
        } else {
          inVolume.push(0);
        }
        if (item <= 0) {
          outVolume.push(item);
        } else {
          outVolume.push(0);
        }
      });

      let intervalVal = 5;
      intervalVal = parseInt(timestamps.length / 15);
      this.myChart.hideLoading();
      let legend = [
        '多头爆仓额',
        '空头爆仓额',
        '合约指数',
        'OKEx季度',
        'Huobi季度',
        '主力净流入',
        '主力净流出'
      ];
      const xAxis = timestamps.map(item => {
        return new Date(item * 1000).format('MM/dd hh:mm');
      });
      close_shorts = close_shorts.map(item => {
        return -item;
      });
      let option = {
        backgroundColor: '#fff',
        animation: false,
        // color: ['#14b143', '#ef232a', '#295b51'],
        color: ['green', 'red', '#295b51', '#4c8eaf', '#cf805f', '#4c8eaf', '#cf805f'],
        legend: {
          data: legend,
          top: 10,
          show: true,
          selected: {
            [legend[0]]: true, //多头爆仓额
            [legend[1]]: true, //空头爆仓额
            [legend[2]]: true, //合约指数
            [legend[3]]: false, //OKEx季度价格
            [legend[4]]: false, //Huobi季度价格
            [legend[5]]: true, //主力净流入
            [legend[6]]: true //主力净流出
          }
        },

        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              // formatter: function (data) {
              //   //时间
              //   if (data.axisDimension === 'x') return data.value;
              //   else {
              //     if (data.axisIndex == 0) return yiwanNum(Math.abs(data.value));
              //     else return data.value.toFixed(priceLen[symbol]);
              //   }
              // },
            }
          },
          formatter: function(params) {
            var result = '';
            (params || []).forEach(function(item) {
              if (item.value) {
                result +=
                  item.marker + item.seriesName + ' : ' + yiwanNum(Math.abs(item.value)) + '</br>';
              }
            });
            return result;
          },
          backgroundColor: 'rgba(245, 245, 245, 0.8)',
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          textStyle: {
            color: '#000'
          }
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
            dataZoom: {show: true, title: {zoom: '', back: ''}, yAxisIndex: 'none'},
            dataView: {show: false, readOnly: false},
            magicType: {show: false, type: ['line', 'bar', 'k']},
            restore: {show: true, title: ' '},
            saveAsImage: {show: false}
          }
        },
        dataZoom: [
          {
            type: 'slider',
            show: false,
            xAxisIndex: [0, 1],
            bottom: 0
          }
          // {
          //   type: 'inside',
          //   xAxisIndex: [0, 1]
          // }
        ],
        // grid: {
        //   left: 60,
        //   right: 60
        // },
        grid: [
          {
            top: 100,
            left: 60,
            right: 60,
            height: h * 280 / 600,
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
              // interval: intervalVal,
              formatter: function(data) {
                return new Date(data).format('MM/dd hh:mm');
              }
            },
            gridIndex: 1
          }
        ],
        yAxis: [
          {
            type: 'value',
            //name: legend[0],
            scale: true,
            boundaryGap: ['10%', '10%'],
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
                return yiwanNum(Math.abs(data), 2);
              }
            },
            axisLine: {
              show: false
            },
            gridIndex: 0
          },
          {
            type: 'value',
            //name: legend[1], // 价格
            scale: true,
            boundaryGap: ['10%', '10%'],
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
                return yiwanNum(data, 2);
              }
            },
            axisLine: {
              show: false
            },
            gridIndex: 0
          },
          {
            type: 'value',
            //name: legend[0],
            scale: true,
            boundaryGap: ['10%', '10%'],
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
              show: false,
              formatter: function(data) {
                return yiwanNum(Math.abs(data), 2);
              }
            },
            axisLine: {
              show: false
            },
            gridIndex: 1
          }
        ],
        series: [
          {
            name: legend[0],
            type: 'bar',
            data: close_longs,
            yAxisIndex: 0,
            // areaStyle: {
            //   color: '#cce9ff'
            // },
            lineStyle: {
              width: 2
            },
            symbol: 'none',
            smooth: true,
            markLine: {
              symbol: ['none', 'none'], //去掉箭头
              itemStyle: {
                normal: {
                  lineStyle: {
                    type: 'solid',
                    color: {
                      //设置渐变
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [
                        {
                          offset: 0,
                          color: '#666' // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: '#666' // 100% 处的颜色
                        }
                      ],
                      global: false // 缺省为 false
                    }
                  },
                  label: {
                    show: false,
                    position: 'left'
                  }
                }
              },
              data: [
                {
                  yAxis: 0
                }
              ]
            },
            barGap: '-100%'
          },
          {
            name: legend[1],
            type: 'bar',
            data: close_shorts,
            yAxisIndex: 0,
            // areaStyle: {
            //   color: '#cce9ff'
            // },
            lineStyle: {
              width: 2
            },
            symbol: 'none',
            smooth: true,
            markLine: {
              symbol: ['none', 'none'], //去掉箭头
              itemStyle: {
                normal: {
                  lineStyle: {
                    type: 'solid',
                    color: {
                      //设置渐变
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [
                        {
                          offset: 0,
                          color: '#666' // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: '#666' // 100% 处的颜色
                        }
                      ],
                      global: false // 缺省为 false
                    }
                  },
                  label: {
                    show: false,
                    position: 'left'
                  }
                }
              },
              data: [
                {
                  yAxis: 0
                }
              ]
            },
            barGap: '-100%'
          },
          {
            name: legend[2],
            type: 'line',
            data: prices,
            yAxisIndex: 1,
            lineStyle: {
              width: 2
            },
            symbol: 'none',
            smooth: true
          },
          {
            name: legend[3],
            type: 'line',
            data: okex_quarter,
            yAxisIndex: 1,
            lineStyle: {
              width: 2
            },
            symbol: 'none',
            smooth: true
          },
          {
            name: legend[4],
            type: 'line',
            data: huobi_quarter,
            yAxisIndex: 1,
            lineStyle: {
              width: 2
            },
            symbol: 'none',
            smooth: true
          },
          {
            name: legend[5],
            type: 'bar',
            data: inVolume,
            yAxisIndex: 2,
            xAxisIndex: 1,
            lineStyle: {
              width: 2
            },
            symbol: 'none',
            smooth: true,
            markLine: {
              symbol: ['none', 'none'], //去掉箭头
              itemStyle: {
                normal: {
                  lineStyle: {
                    type: 'solid',
                    color: {
                      //设置渐变
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [
                        {
                          offset: 0,
                          color: '#666' // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: '#666' // 100% 处的颜色
                        }
                      ],
                      global: false // 缺省为 false
                    }
                  },
                  label: {
                    show: false,
                    position: 'left'
                  }
                }
              },
              data: [
                {
                  yAxis: 0
                }
              ]
            },
            barGap: '-100%'
          },
          {
            name: legend[6],
            type: 'bar',
            data: outVolume,
            yAxisIndex: 2,
            xAxisIndex: 1,
            lineStyle: {
              width: 2
            },
            symbol: 'none',
            smooth: true,
            markLine: {
              symbol: ['none', 'none'], //去掉箭头
              itemStyle: {
                normal: {
                  lineStyle: {
                    type: 'solid',
                    color: {
                      //设置渐变
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [
                        {
                          offset: 0,
                          color: '#666' // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: '#666' // 100% 处的颜色
                        }
                      ],
                      global: false // 缺省为 false
                    }
                  },
                  label: {
                    show: false,
                    position: 'left'
                  }
                }
              },
              data: [
                {
                  yAxis: 0
                }
              ]
            },
            barGap: '-100%'
          }
        ]
      };

      if (this.state.drawNum) {
        let selected = this.myChart.getOption().legend[0].selected;
        //console.log(this.myChart.getOption());
        //console.log(selected);
        option.legend.selected = selected;
      }

      this.myChart.setOption(option, true);
    } else {
      this.myChart.showLoading('default', {
        text: '暂无数据',
        color: '#0070cc',
        textColor: '#8a8e91',
        maskColor: 'rgba(0, 0, 0, 0.1)'
      });
    }

    this.setState({drawNum: ++this.state.drawNum});
  }
  exSpanChange(val) {
    this.setState(
      {
        span: val
      },
      () => {
        this.doFetch();
      }
    );
  }
  render() {
    let w = parseInt(document.body.clientWidth * 1);
    let h = parseInt(w * 0.7);
    const columns = [
      {
        title: '时间',
        dataIndex: 'timestamp',
        key: 'timestamp',
        sorter: (a, b) => {
          return a.timestamp - b.timestamp;
        },
        defaultSortOrder: 'descend',
        render: (p, o) => {
          return new Date(p * 1000).format('yyyy-MM-dd hh:mm:ss');
        }
      },
      {
        title: '平台',
        dataIndex: 'exchange',
        key: 'exchange',
        sorter: (a, b) => {
          return a.exchange.localeCompare(b.exchange);
        },
        render: (p, o) => {
          const map = new Map([
            ['swap', '永续'],
            ['quarter', '季度'],
            ['this_week', '当周'],
            ['next_week', '次周']
          ]);
          return p + ' ' + map.get(o.contract.toLowerCase());
        }
      },
      {
        title: '方向',
        dataIndex: 'type',
        key: 'type',
        sorter: (a, b) => {
          return a.side.localeCompare(b.side);
        },
        render: (p, o) => {
          if (p === 'close_short') {
            return <span className="red">平空</span>;
          }
          if (p === 'close_long') {
            return <span className="green">平多</span>;
          }
        }
      },
      {
        title: '价格($)',
        dataIndex: 'price',
        key: 'price',
        render: (p, o) => {
          if (p) {
            return fPrice(p);
          }
        }
      },
      {
        title: '成交额(U)',
        dataIndex: 'volume',
        key: 'volume',
        render: (p, o) => {
          if (p) {
            const {type} = o;
            if (type === 'close_short') {
              return <span className="red">{yiwanNum(p)}</span>;
            }
            if (type === 'close_long') {
              return <span className="green">{yiwanNum(p)}</span>;
            }
          }
        }
      }
    ];
    const {detail, orders, long, short, sum} = this.state;
    const {longNum, shortNum, longVolume, shortVolume, total} = detail || {};
    const timeTypeName = (getObjFromArray(timeList, 'value', this.state.timeType) || {}).name;
    const buyPercent = fNum(longVolume * 100 / (longVolume + shortVolume), 1) || 0;
    const sellPercent = fNum(shortVolume * 100 / (longVolume + shortVolume), 1) || 0;

    const myPickerTimePorps = {
      data: this.state.spanList,
      cols: 1,
      value: [this.state.span],
      title: '选择颗粒度',
      extra: '选择颗粒度',
      key: this.state.span,
      onOk: v => {
        if (v[0] !== this.state.span) {
          this.setState(
            {
              span: v[0]
            },
            () => {
              this.exSpanChange(v[0]);
            }
          );
        }
      },
      CustomChildren: props => {
        return (
          <span onClick={props.onClick}>
            <b>
              <span>
                颗粒度:{getObjFromArray(this.state.spanList, 'value', this.state.span).label}
                <i className="icon iconfont icon-xiasanjiaoxing"></i>
              </span>
            </b>
          </span>
        );
      }
    };

    const myPickerTimePorps1 = {
      data: this.state.timeList,
      cols: 1,
      value: [this.state.timeType],
      title: '选择时间周期',
      extra: '选择时间周期',
      key: this.state.timeType,
      onOk: v => {
        if (v[0] !== this.state.timeType) {
          this.setState(
            {
              timeType: v[0]
            },
            () => {
              this.timeTypeChange(v[0]);
            }
          );
        }
      },
      CustomChildren: props => {
        return (
          <span onClick={props.onClick}>
            <b>
              <span>
                时间周期:{getObjFromArray(this.state.timeList, 'value', this.state.timeType).label}
                <i className="icon iconfont icon-xiasanjiaoxing"></i>
              </span>
            </b>
          </span>
        );
      }
    };
    const {inTab} = this.props;
    if (!inTab) {
      return (
        <div className="page-container page-container-three">
          <div className="page-innerContainer">
            <div className="header-title">
              <NavBar
                icon={<Icon type="left" />}
                onLeftClick={() => {
                  this.props.history.go(-1);
                }}
              >
                爆仓量
              </NavBar>
            </div>
            <div className="scroll-container">
              <div className="main-container" style={{minHeight: '100%'}}>
                <div className="cpContainer">
                  <div className="summary">
                    <div className="title">{this.state.symbol}合约爆仓数据(U)</div>
                    <div className="cpTitle">
                      <Row>
                        <Col span={24}>
                          <ul>
                            {(this.state.symbolList || []).map((item, index) => {
                              return (
                                <li
                                  className={this.state.symbol === item ? 'selected' : null}
                                  onClick={() => {
                                    this.changeSelectSymbol(item);
                                  }}
                                >
                                  {item}
                                </li>
                              );
                            })}
                          </ul>
                        </Col>
                        {/* <Col span={6}><p className="tips">数据统计自OKex、 火币</p></Col> */}
                      </Row>
                    </div>
                    <div className="tableContent">
                      <table>
                        <tbody>
                          <tr>
                            <th>#</th>
                            <th>15分钟</th>
                            <th>1小时</th>
                            <th>3小时</th>
                            <th>8小时</th>
                            <th>24小时</th>
                            <th>48小时</th>
                            <th>7天</th>
                          </tr>
                          {long && 
                            <tr>
                              <td className="firstTd">多头爆仓额</td>
                              {(Object.keys(long) || []).map((key, index) => {
                                return (
                                  <td key={index}>
                                    <span className="green">{yiwanNum(long[key])}</span>
                                  </td>
                                );
                              })}
                            </tr>
                          }
                          {short && 
                            <tr>
                              <td className="firstTd">空头爆仓额</td>
                              {(Object.keys(short) || []).map((key, index) => {
                                return (
                                  <td key={index}>
                                    <span className="red">{yiwanNum(short[key])}</span>
                                  </td>
                                );
                              })}
                            </tr>
                          }
                          {sum && 
                            <tr>
                              <td className="firstTd">小计</td>
                              {(Object.keys(sum) || []).map((key, index) => {
                                return (
                                  <td key={index}>
                                    <span className="grey">{yiwanNum(sum[key])}</span>
                                  </td>
                                );
                              })}
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                    <p className="tips">数据统计自BitMEX、OKEx、火币</p>
                  </div>

                  <div className="title">
                    <Row gutter={[12, 12]}>
                      <Col span={12}>
                        <span style={{float: 'left'}}>
                          <MyPicker {...myPickerTimePorps}></MyPicker>
                          {/* &emsp;颗粒度:&emsp; */}
                          {/* <Select value={this.state.span} onChange={(e) => {
                        this.exSpanChange(e)
                      }} style={{width: 120}}>
                        {(this.state.spanList || []).map((o) => {
                          return <Option value={o.value}>{o.name}</Option>
                        })}
                      </Select> */}
                        </span>
                      </Col>
                      <Col span={12} style={{textAlign: 'right'}}>
                        <span style={{float: 'right'}}>
                          <MyPicker {...myPickerTimePorps1}></MyPicker>
                          {/* &emsp;时间周期:&emsp; */}
                          {/* <Radio.Group value={this.state.timeType} onChange={(e) => {
                        this.timeTypeChange(e);
                      }}>
                        {(this.state.timeList || []).map((item) => {
                          return <Radio.Button value={item.value}>{item.name}</Radio.Button>
                        })}
                      </Radio.Group> */}
                        </span>
                      </Col>
                    </Row>
                  </div>
                  <div className="content">
                    <div
                      id="echartId"
                      style={{width: `${w}px`, height: `${h}px`, margin: '0 auto'}}
                    ></div>
                  </div>

                  <div className="mainContainer">
                    <div className="infoContainer">
                      <Row gutter={[12, 12]}>
                        <Col span={24}>
                          <dl className="infoMain">
                            <dt>
                              <div className="left">
                                <span>{yiwanNum(longVolume)}</span>
                                <p>多头爆仓 {buyPercent}%</p>
                              </div>
                              <div className="right">
                                <span>{yiwanNum(shortVolume)}</span>
                                <p>{sellPercent}% 空头爆仓</p>
                              </div>
                            </dt>
                            <dd>
                              <div className="chart">
                                <div className="z" style={{width: `${buyPercent}%`}}></div>
                                <div className="r" style={{width: `${sellPercent}%`}}></div>
                              </div>
                            </dd>
                            <dd>
                              {(this.state.timestamps || []).length && 
                                <p className="time">
                                  {new Date(this.state.timestamps[0] * 1000).format('MM/dd hh:mm')} ~{' '}
                                  {new Date(
                                    this.state.timestamps[this.state.timestamps.length - 1] * 1000
                                  ).format('MM/dd hh:mm')}
                                </p>
                              }
                            </dd>
                          </dl>
                          <div>
                            <p className="info">
                              近{timeTypeName}一共有<span className="buy">{yiwanNum(longNum)}</span>
                              个多头爆仓单，<span className="sell">{yiwanNum(shortNum)}</span>
                              个空头爆仓单
                            </p>
                            <p className="sumInfo">
                              爆仓总金额 <span>{yiwanNum(total)}</span> USDT
                            </p>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>

                  {orders && 
                    <div className="list">
                      <Table
                        size="small"
                        bordered={true}
                        dataSource={orders}
                        columns={columns}
                        scroll={{x: true, y: false}}
                        pagination={{pageSize: 30}}
                      ></Table>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <div className="inTabContainer">
      <div className="cpContainer">
        <div className="summary">
          <div className="title">{this.state.symbol}合约爆仓数据(U)</div>
          <div className="cpTitle">
            <Row>
              <Col span={24}>
                <ul>
                  {(this.state.symbolList || []).map((item, index) => {
                    return (
                      <li
                        className={this.state.symbol === item ? 'selected' : null}
                        onClick={() => {
                          this.changeSelectSymbol(item);
                        }}
                      >
                        {item}
                      </li>
                    );
                  })}
                </ul>
              </Col>
              {/* <Col span={6}><p className="tips">数据统计自OKex、 火币</p></Col> */}
            </Row>
          </div>
          <div className="tableContent">
            <table>
              <tbody>
                <tr>
                  <th>#</th>
                  <th>15分钟</th>
                  <th>1小时</th>
                  <th>3小时</th>
                  <th>8小时</th>
                  <th>24小时</th>
                  <th>48小时</th>
                  <th>7天</th>
                </tr>
                {long && 
                  <tr>
                    <td className="firstTd">多头爆仓额</td>
                    {(Object.keys(long) || []).map((key, index) => {
                      return (
                        <td key={index}>
                          <span className="green">{yiwanNum(long[key])}</span>
                        </td>
                      );
                    })}
                  </tr>
                }
                {short && 
                  <tr>
                    <td className="firstTd">空头爆仓额</td>
                    {(Object.keys(short) || []).map((key, index) => {
                      return (
                        <td key={index}>
                          <span className="red">{yiwanNum(short[key])}</span>
                        </td>
                      );
                    })}
                  </tr>
                }
                {sum && 
                  <tr>
                    <td className="firstTd">小计</td>
                    {(Object.keys(sum) || []).map((key, index) => {
                      return (
                        <td key={index}>
                          <span className="grey">{yiwanNum(sum[key])}</span>
                        </td>
                      );
                    })}
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <p className="tips">数据统计自BitMEX、OKEx、火币</p>
        </div>

        <div className="title">
          <Row gutter={[12, 12]}>
            <Col span={12}>
              <span style={{float: 'left'}}>
                <MyPicker {...myPickerTimePorps}></MyPicker>
                {/* &emsp;颗粒度:&emsp; */}
                {/* <Select value={this.state.span} onChange={(e) => {
                        this.exSpanChange(e)
                      }} style={{width: 120}}>
                        {(this.state.spanList || []).map((o) => {
                          return <Option value={o.value}>{o.name}</Option>
                        })}
                      </Select> */}
              </span>
            </Col>
            <Col span={12} style={{textAlign: 'right'}}>
              <span style={{float: 'right'}}>
                <MyPicker {...myPickerTimePorps1}></MyPicker>
                {/* &emsp;时间周期:&emsp; */}
                {/* <Radio.Group value={this.state.timeType} onChange={(e) => {
                        this.timeTypeChange(e);
                      }}>
                        {(this.state.timeList || []).map((item) => {
                          return <Radio.Button value={item.value}>{item.name}</Radio.Button>
                        })}
                      </Radio.Group> */}
              </span>
            </Col>
          </Row>
        </div>
        <div className="content">
          <div
            id="echartId"
            style={{width: `${w}px`, height: `${h}px`, margin: '0 auto'}}
          ></div>
        </div>

        <div className="mainContainer">
          <div className="infoContainer">
            <Row gutter={[12, 12]}>
              <Col span={24}>
                <dl className="infoMain">
                  <dt>
                    <div className="left">
                      <span>{yiwanNum(longVolume)}</span>
                      <p>多头爆仓 {buyPercent}%</p>
                    </div>
                    <div className="right">
                      <span>{yiwanNum(shortVolume)}</span>
                      <p>{sellPercent}% 空头爆仓</p>
                    </div>
                  </dt>
                  <dd>
                    <div className="chart">
                      <div className="z" style={{width: `${buyPercent}%`}}></div>
                      <div className="r" style={{width: `${sellPercent}%`}}></div>
                    </div>
                  </dd>
                  <dd>
                    {(this.state.timestamps || []).length && 
                      <p className="time">
                        {new Date(this.state.timestamps[0] * 1000).format('MM/dd hh:mm')} ~{' '}
                        {new Date(
                          this.state.timestamps[this.state.timestamps.length - 1] * 1000
                        ).format('MM/dd hh:mm')}
                      </p>
                    }
                  </dd>
                </dl>
                <div>
                  <p className="info">
                    近{timeTypeName}一共有<span className="buy">{yiwanNum(longNum)}</span>
                    个多头爆仓单，<span className="sell">{yiwanNum(shortNum)}</span>
                    个空头爆仓单
                  </p>
                  <p className="sumInfo">
                    爆仓总金额 <span>{yiwanNum(total)}</span> USDT
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        </div>

        {orders && 
          <div className="list">
            <Table
              size="small"
              bordered={true}
              dataSource={orders}
              columns={columns}
              scroll={{x: true, y: false}}
              pagination={{pageSize: 30}}
            ></Table>
          </div>
        }
      </div>

    </div>
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading,
    tool: state.tool
  };
}
export default connect(mapStateToProps)(Index);
