import React, { PureComponent } from 'react';
import router from 'umi/router';
import { Row, Col, Icon, Select, Radio } from 'antd';
import { MyPicker } from 'components';
import { config, deepGet, fNum, deepClone, wanNum, getObjFromArray, yiwanNum } from 'utils';
import './profitabilityChart.scss'
import * as echarts from 'echarts';

const namespace = 'tool';
// 3M,6M,1y,2y
const timeList = [
  {value: '3m', label: '3月'},
  {value: '6m', label: '6月'},
  {value: '1y', label: '1年'},
  {value: '2y', label: '2年'},
  {value: '', label: '全部'}
];
class volume extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      timeType: '2y', //timeList[0].value,
      timeList: deepClone(timeList),
      timestamp: [], 
      price: [], 
      profits: [],
      symbol: 'BTC'
    };
    this.dispatch = this.props.dispatch;
  }
  componentDidMount() {
    this.myChart = echarts.init(document.getElementById('echartId2'));
    this.doFetch();
  }
  timeTypeChange(e) {
    this.setState({
      timeType: e
    }, () => {
      this.doFetch();
      
    })
  }
  changeSelectSymbol(symbol) {
    this.setState({
      symbol
    }, () => {
      this.doFetch();
    })
  }
  doFetch() {
    const {timeType, symbol} = this.state;
    // 获取数据
    this.dispatch({
      type: `${namespace}/profitability`,
      payload: {
        symbol,
        type: timeType
      }
    }).then((data) => {
      const {timestamps, profits, prices} = data || {};
      this.setState({
        timestamp: timestamps || [],
        price: prices || [],
        profits: profits || []
      }, () => {
        this.doDraw();
      })
    })
  }
  doDraw() {
    const {timestamp, profits, price} = this.state;
    if ((timestamp || []).length > 0) {
      this.myChart.hideLoading();
      let legend = ['挖矿收益 (U)', '价格指数'];
      const xAxis = timestamp.map((item) => {
        return new Date(item * 1000).format('yy/MM/dd');
      })
      let option = {
        title: {
          text: `${this.state.symbol} 1 THash/s 每天挖矿收益`,
          left: 'center',
          align: 'right',
          top: '0px',
          textStyle: {
            fontSize: 14
          }
        },
        backgroundColor: '#fff',
        animation: false,
        color: ['#617eca', '#02b302', '#37a2da'],
        legend: {
          data: legend,
          top: 30,
          selected: {
            [legend[0]]: true,
            [legend[1]]: true
          },
          show: true
        },

        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              precision: 2
              // formatter: function(data) {
              //   console.log('data123', data)
              //   if (data.axisDimension === 'x') {
              //     return 123;//data.value;
              //   }
              //   return yiwanNum(data.value);
              // }
            }
          },
          formatter: function(params) {
            var result = '';
            params.forEach(function(item) {
              result += item.marker + ' ' + item.seriesName + ' : ' + yiwanNum(item.value) + '</br>';
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
            dataView: {show: true, readOnly: true},
            magicType: {show: false, type: ['line', 'bar', 'k']},
            restore: {show: true, title: ' '},
            saveAsImage: {show: false}
          }
        },
        dataZoom: [
          {
            type: 'slider',
            show: false,
            xAxisIndex: [0]
          }
          // {
          //   type: 'inside',
          //   xAxisIndex: [0]
          // }
        ],
        grid: {
          left: 50,
          right: 50,
          bottom: 20,
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
            // axisLabel: {
            //   formatter: function(data) {
            //     return new Date(data).format('MM:dd');
            //   }
            // },
            axisPointer: {
              z: 100
            }
          }],
        yAxis: [
          {
            type: 'value',
            //name: legend[0], // 人数比
            // type: 'log',
            // logBase: 2,
            // min: 2,
            // max: 16,
            scale: true,
            boundaryGap: false, //['20%', '20%'],
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
            //type: 'value',
            //name: legend[1], // 价格
            type: 'log',
            logBase: 2,
            min: 3000,
            max: 20000,
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
            type: 'line',
            data: profits,
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
            }, () => {
              this.timeTypeChange(v[0]);
            });
        }
      },
      CustomChildren: props => {
        return (
          <span onClick={props.onClick}>
            <b><span>{getObjFromArray(this.state.timeList, 'value', this.state.timeType).label}<i className="icon iconfont icon-xiasanjiaoxing"></i></span></b>
          </span>
        );
      },
    };

    return (
      <div className="volumeContainer">
        <div className="title">
          <Row gutter={[12, 12]}>
            <Col span={12}>
              <span className="info">{this.state.symbol}挖矿收益</span> 
            </Col>
            <Col span={12} style={{textAlign: 'right'}}>
              <span style={{float: 'right'}}>

              <MyPicker {...myPickerTimePorps}></MyPicker>

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
          <div id="echartId2" style={{ width: `${w}px`, height: `${h}px`, margin: '0 auto' }}></div>
        </div>
      </div>
    );
  }
}

export default volume;