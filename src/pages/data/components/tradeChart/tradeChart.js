import React, { PureComponent } from 'react';
import router from 'umi/router';
import { Row, Col, Icon, Select, Radio, Table} from 'antd';
import { MyPicker } from 'components';
import { config, deepGet, fNum, deepClone, wanNum, getObjFromArray, yiwanNum, fPrice } from 'utils';
import './tradeChart.scss'
import * as echarts from 'echarts';

const namespace = 'tool';
// [1h,3h,8h,24h,48h,7d]
const timeList = [
  {value: '1h', label: '1小时'},
  {value: '3h', label: '3小时'},
  {value: '8h', label: '8小时'},
  {value: '1d', label: '1天'},
  {value: '2d', label: '2天'},
  {value: '7d', label: '7天'},
]
class volume extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      timeType: timeList[0].value,
      timeList: deepClone(timeList),

      timestamp: [], 
      price: [], 
      volume: [],
      detail: {},
      trades: [],

      symbolList: ['BTC', 'ETH', 'BCH', 'LTC', 'EOS', 'BSV', 'ETC', 'XRP', 'TRX'],
      symbol: 'BTC',

      from: null,
      to: null
    };
    this.dispatch = this.props.dispatch;
  }
  componentDidMount() {
    this.myChart = echarts.init(document.getElementById('echartId'));
    this.doFetch();
  }
  timeTypeChange(e) {
    this.setState({
      timeType: e,
      from: null,
      to: null
    }, () => {
      this.doFetch();
      setTimeout(() => {
        this.props.updateSummary();
      }, 2000);
      
    })
  }
  changeSelectSymbol(symbol) {
    this.setState({
      symbol
    }, () => {
      this.doFetch();
      setTimeout(() => {
        this.props.updateSummary();
      }, 2000);
    })
  }
  doFetch() {
    const {timeType, from, to, exchange, symbol} = this.state;
    // 获取数据
    this.dispatch({
      type: `${namespace}/trade`,
      payload: {
        symbol,
        type: timeType,
        from: from ? new Date(from).getTime() / 1000 : null,
        to: to ? new Date(to).getTime() / 1000 : null
      }
    }).then((data) => {
      const {list, detail, trades} = data || {};
      const {timestamp, price, volume} = list;
      this.setState({
        timestamp: timestamp || [],
        price: price || [],
        volume: volume || [],
        detail: detail || {},
        trades: trades || []
      }, () => {
        this.doDraw();
      })
    })
  }
  doDraw() {
    let w = parseInt(document.body.clientWidth * 1);
    let h = parseInt(w * 0.7);
    const {timestamp, price, volume, timeType, symbol} = this.state;
    if ((timestamp || []).length > 0) {
      let inVolume = [];
      let outVolume = [];
      (volume || []).forEach((item) => {
        if (item >= 0) {
          inVolume.push(item);
        } else {
          inVolume.push(null);
        }
        if (item <= 0) {
          outVolume.push(item);
        } else {
          outVolume.push(0);
        }
      })
      this.myChart.hideLoading();
      let legend = ['主力净流入', '主力净流出', '合约指数'];
      const xAxis = timestamp.map((item) => {
        return new Date(item * 1000).format('MM/dd hh:mm');
      })
      let option = {
        backgroundColor: '#fff',
        animation: false,
        // color: ['#14b143', '#ef232a', '#295b51'],
        color: ['green', 'red', '#295b51'],
        legend: {
          data: legend,
          top: 20,
          selected: {
            [legend[0]]: true,
            [legend[1]]: true,
            [legend[2]]: true
          },
          show: true
        },

        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              formatter: function(data) {
                if (data.seriesData.length >= 1) {
                  return data.value;
                } 
                return yiwanNum(data.value);
              }
            }
          },
          formatter: function(params) {
            var result = '';
            params.forEach(function(item) {
              if (item.value) {
                result += item.marker + ' ' + item.seriesName + ' : ' + yiwanNum(item.value) + '</br>';
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
            xAxisIndex: [0]
          },
          // {
          //   type: 'inside',
          //   xAxisIndex: [0]
          // }
        ],
        grid: {
          left: 60,
          right: 60,
          bottom: 20
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
              // interval: 3,
              formatter: function(data) {
                if (timeType === '7d') {
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
            //name: legend[0],
            scale: true,
            boundaryGap: ['50%', '50%'],
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
                return yiwanNum(data, 2);
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
            boundaryGap: ['50%', '50%'],
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
            }
          }
        
        ],
        series: [
          {
            name: legend[0],
            type: 'bar',
            data: inVolume,
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
                    color: {//设置渐变
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [{
                        offset: 0, color: '#666'// 0% 处的颜色
                      }, {
                        offset: 1, color: '#666' // 100% 处的颜色
                      }],
                      global: false // 缺省为 false
                    }
                  },
                  label: { 
                    show: false, 
                    position: 'left' 
                  } 
                }
              },
              data: [{
                yAxis: 0
              }]
            },
            barGap: '-100%'

          },
          {
            name: legend[1],
            type: 'bar',
            data: outVolume,
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
                    color: {//设置渐变
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [{
                        offset: 0, color: '#666'// 0% 处的颜色
                      }, {
                        offset: 1, color: '#666' // 100% 处的颜色
                      }],
                      global: false // 缺省为 false
                    }
                  },
                  label: { 
                    show: false, 
                    position: 'left' 
                  } 
                }
              },
              data: [{
                yAxis: 0
              }]
            },
            barGap: '-100%'
          },
          {
            name: legend[2],
            type: 'line',
            data: price,
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
    let w = parseInt(document.body.clientWidth * 1);
    let h = parseInt(w * 0.7);
    const content = <div>
      <p>主动买入量：展示单位时间内，大单主动性买盘的成交量（taker吃挂单买入），即主力资金流入量。</p>
      <p>主动卖出量：展示单位时间内，大单主动性卖盘的成交量（taker吃挂单卖出），即主力资金流出量。</p>
    </div>;
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
          return new Date(p * 1000).format('yyyy-MM-dd hh:mm:ss')
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
          const map = new Map([['swap', '永续'], ['quarter', '季度'], ['this_week', '当周'], ['next_week', '次周']]);
          return p + ' ' + map.get(o.contract);
        }
      },
      {
        title: '方向',
        dataIndex: 'side',
        key: 'side',
        sorter: (a, b) => {
          return a.side.localeCompare(b.side);        
        },
        render: (p, o) => {
          if (p === 'sell') {
            return <span className="sell">卖</span>
          } 
          if (p === 'buy') {
            return <span className="buy">买</span>
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
            const {side} = o;
            if (side === 'sell') {
              return <span className="sell">{yiwanNum(p)}</span>
            } 
            if (side === 'buy') {
              return <span className="buy">{yiwanNum(p)}</span>
            }
          }
        }
      }
    ];
    const dataList = this.state.trades || [];
    const {buyNum, buyVolume, sellNum, sellVolume, total} = this.state.detail || {};
    const timeTypeName = (getObjFromArray(timeList, 'value', this.state.timeType) || {}).label;
    const buyPercent = fNum(buyVolume * 100 / (buyVolume + sellVolume), 1);
    const sellPercent = fNum(sellVolume * 100 / (buyVolume + sellVolume), 1);

    const {from, to} = this.state;
    const myDateProps = {
      startValue: from,
      endValue: to,
      handleChange: (startValue, endValue) => {
        // to Do 获取数据
        this.setState({
          from: startValue,
          to: endValue,
          timeType: null
        }, () => {
          if (startValue && endValue) {
            this.doFetch();
            setTimeout(() => {
              this.props.updateSummary();
            }, 2000);
          }
        })
      }
    }

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
              timeType: v[0],
            }, ()=>{
              this.timeTypeChange(v[0]);
            });
        }
      },
      CustomChildren: props => {
        return (
          <span onClick={props.onClick}>
            <b><span>{timeTypeName}<i className="icon iconfont icon-xiasanjiaoxing"></i></span></b>
          </span>
        );
      },
    };

    return (
      <div className="tradeChartContainer">
        <div className="cpTitle">
          {/* <Popover placement="right" content={content} title={null} trigger="click"><Icon type="question-circle" /></Popover> */}
          <Row>
            <Col span={20}>
              <ul>
                {(this.state.symbolList || []).map((item, index) => {
                  return <li className={this.state.symbol === item ? "selected" : null} onClick={() => {
                    this.changeSelectSymbol(item);
                  }}>{item}</li>
                })}
              </ul>
            </Col>
            <Col span={4} style={{textAlign: 'right'}}>
              <MyPicker {...myPickerTimePorps}></MyPicker>
            </Col>
          </Row>
        </div>

        {/* <div className="title">
          <Row gutter={[12, 12]}>
            <Col span={12}>
              <span className="info">{this.state.symbol}合约主力资金</span> 
            </Col>
            <Col span={24}>
              <span style={{marginRight: '10px'}}><MyDate key={from + to} {...myDateProps}></MyDate></span>
              <span style={{float: 'right'}}>
                <Radio.Group value={this.state.timeType} onChange={(e) => {
                  this.timeTypeChange(e);
                }}>
                  {(this.state.timeList || []).map((item) => {
                    return <Radio.Button value={item.value}>{item.name}</Radio.Button>
                  })}
                </Radio.Group>
              </span>
            </Col>
          </Row>
        </div> */}
        <div className="content">
          <div id="echartId" style={{width: `${w}px`, height: `${h}px`, margin: '0 auto'}}></div>
        </div>

        <div className="mainContainer">
          <div className="infoContainer">
            <Row gutter={[12, 12]}>
              {/* <Col span={8}>
                <p className="info">
                近{timeTypeName}一共有<span className="buy">{yiwanNum(buyNum)}</span>个大额买单，<span className="sell">{yiwanNum(sellNum)}</span>个大额卖单
                </p>
              </Col> */}
              <Col span={24}>
                <dl className="infoMain">
                  <dt>
                    <div className="left">
                      <span>{yiwanNum(buyVolume)}</span>
                      <p>买 {buyPercent}%</p>
                    </div>
                    <div className="right">
                      <span>{yiwanNum(sellVolume)}</span>
                      <p>{sellPercent}% 卖</p>
                    </div>
                  </dt>
                  <dd>
                    <div className="chart">
                      <div className="z" style={{width: `${buyPercent}%`}}></div>
                      <div className="r" style={{width: `${sellPercent}%`}}></div>
                    </div>
                  </dd>
                  <dd>
                    {(this.state.timestamp || []).length && <p className="time">{new Date(this.state.timestamp[0] * 1000).format('MM/dd hh:mm')} ~ {new Date(this.state.timestamp[this.state.timestamp.length - 1] * 1000).format('MM/dd hh:mm')}</p>}
                  </dd>
                </dl>
                <div>
                  <p className="info">
                  近{timeTypeName}一共有<span className="buy">{yiwanNum(buyNum)}</span>个大额买单，<span className="sell">{yiwanNum(sellNum)}</span>个大额卖单
                  </p>
                  <p className="sumInfo">{total >= 0 ? '净流入' : '净流出'} <span className={total >= 0 ? "buy" : "sell"}>{yiwanNum(total)}</span> USDT</p>
                </div>
              </Col>
              {/* <Col span={8}>
                <p className="sumInfo">{total >= 0 ? '净流入' : '净流出'} <span className={total >= 0 ? "buy" : "sell"}>{yiwanNum(total)}</span> USDT</p>
              </Col> */}
            </Row>
          </div>
        </div>
      
        <div className="list">
          <Table size="small" bordered={true} dataSource={dataList} columns={columns} scroll={{x: true, y: false}} pagination={{pageSize: 30}}></Table>
        </div>
      </div>
    );
  }
}

export default volume;