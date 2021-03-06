import React, {PureComponent} from 'react';
import router from 'umi/router';
import {Row, Col, Icon, Select, Radio} from 'antd';
import {MyPicker} from 'components';
import {config, deepGet, fNum, deepClone, wanNum, getObjFromArray, yiwanNum} from 'utils';
import './blockChart.less'
import * as echarts from 'echarts';

const namespace = 'data';
// 3M,6M,1y,2y
const timeList = [
  {value: '3m', label: '3月'},
  {value: '6m', label: '6月'},
  {value: '1y', label: '1年'},
  {value: '2y', label: '2年'},
  {value: '', label: '全部'}
]
class volume extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      timeType: '2y', //timeList[0].value,
      timeList: deepClone(timeList),
      timestamp: [], 
      price: [], 
      difficulty: [],
      symbol: 'BTC'
    };
    this.dispatch = this.props.dispatch;
  }
  componentDidMount() {
    this.myChart = echarts.init(document.getElementById('echartId'));
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
      type: `${namespace}/blockBtc`,
      payload: {
        symbol,
        type: timeType
      }
    }).then((data) => {
      const {timestamp, difficulty, price} = data || {};
      // difficulty.map((item) => {
      //   return item / 1000000000000;
      // })
      for (let i = 0; i < difficulty.length; i++) {
        difficulty[i] = difficulty[i] / 1000000000000;
      }
      this.setState({
        timestamp: timestamp || [],
        price: price || [],
        difficulty: difficulty || []
      }, () => {
        this.doDraw();
      })
    })
  }
  doDraw() {
    const {timestamp, difficulty, price} = this.state;
    if ((timestamp || []).length > 0) {
      this.myChart.hideLoading();
      let legend = ['挖矿难度(T)', 'BTC价格(USD)'];
      const xAxis = timestamp.map((item) => {
        return new Date(item * 1000).format('yy/MM/dd');
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
            type: 'cross',
            label: {
              precision: 2
              // formatter: function(data) {
              //   if (data.axisDimension === 'x') {
              //     return data.value;
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
            //type: 'value',
            //name: legend[0], // 人数比
            type: 'log',
            logBase: 2,
            min: 3,
            max: 20,
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
            data: difficulty,
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
    let w = parseInt(document.body.clientWidth * 1 - 30);
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
              timeType: v[0]
            }, () => {
              this.timeTypeChange(v[0]);
            });
        }
      },
      CustomChildren: props => {
        return (
          <span onClick={props.onClick} className="text-blue">
            {getObjFromArray(this.state.timeList, 'value', this.state.timeType).label}<i className="icon iconfont icon-downSmall"></i>
          </span>
        );
      }
    };
    return (
      <div className="volumeContainer">

        <div className="title">
          <Row gutter={[12, 12]}>
            <Col span={12}>
              <span className="info">{this.state.symbol}挖矿难度</span> 
            </Col>
            <Col span={12} style={{textAlign: 'right'}}>
              <span style={{float: 'right'}} className="time">

                <MyPicker {...myPickerTimePorps}></MyPicker>
              </span>
            </Col>
          </Row>
        </div>
        <div className="content">
          <div id="echartId" style={{width: `${w}px`, height: `${h}px`, margin: '0 auto'}}></div>
        </div>
      </div>
    );
  }
}

export default volume;