import React, {PureComponent} from 'react';
import router from 'umi/router';
import {Row, Col, Icon, Select, Radio} from 'antd';
import {MyPicker} from 'components';
import {config, deepGet, fNum, deepClone, wanNum, getObjFromArray, yiwanNum} from 'utils';
import './index.less'
import * as echarts from 'echarts';

const namespace = 'data';
// [1h,3h,8h,24h,48h,7d]
const timeList = [
  {value: '1h', label: '1小时'},
  {value: '3h', label: '3小时'},
  {value: '8h', label: '8小时'},
  {value: '24h', label: '1天'},
  {value: '48h', label: '2天'},
  {value: '7d', label: '7天'},
  {value: '1m', label: '1个月'},
  {value: '3m', label: '3个月'},
  {value: 'all', label: '全部'}
]
class volume extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeType: timeList[0].value,
      timeList: deepClone(timeList),
      from: null,
      to: null,

      timestamp: [],
      price: [],
      marketPrice: [],
      gap: [],
      gapPer: []
    };
    this.dispatch = this.props.dispatch;
  }
  componentDidMount() {
    this.myChart = echarts.init(document.getElementById(`echartId_${this.props.symbol}`));
    // this.doFetch();
    this.timeTypeChange('24h');
  }
  timeTypeChange(e) {
    const toTime = parseInt(new Date().getTime() / 1000);
    let fromTime = new Date();
    switch (e) {
      case '1h': {
        fromTime.setHours(fromTime.getHours() - 1);
        fromTime = parseInt(fromTime.getTime() / 1000);
        break;
      }
      case '3h': {
        fromTime.setHours(fromTime.getHours() - 3);
        fromTime = parseInt(fromTime.getTime() / 1000);
        break;
      }
      case '8h': {
        fromTime.setHours(fromTime.getHours() - 8);
        fromTime = parseInt(fromTime.getTime() / 1000);
        break;
      }
      case '24h': {
        fromTime.setHours(fromTime.getHours() - 24);
        fromTime = parseInt(fromTime.getTime() / 1000);
        break;
      }
      case '48h': {
        fromTime.setDate(fromTime.getDate() - 2);
        fromTime = parseInt(fromTime.getTime() / 1000);
        break;
      }
      case '7d': {
        fromTime.setDate(fromTime.getDate() - 7);
        fromTime = parseInt(fromTime.getTime() / 1000);
        break;
      }
      case '1m': {
        fromTime.setMonth(fromTime.getMonth() - 1);
        fromTime = parseInt(fromTime.getTime() / 1000);
        break;
      }
      case '3m': {
        fromTime.setMonth(fromTime.getMonth() - 3);
        fromTime = parseInt(fromTime.getTime() / 1000);
        break;
      }
      case 'all': {
        fromTime.setMonth(fromTime.getMonth() - 12);
        fromTime = parseInt(fromTime.getTime() / 1000);
        break;
      }
      default: {

        break;
      }
    }
    this.setState({
      from: fromTime,
      to: toTime,
      timeType: e
    }, () => {
      this.doFetch();
    })
  }
  doFetch() {
    const {timeType, from, to, exchange} = this.state;
    const {symbol} = this.props;
    // 获取数据
    this.dispatch({
      type: `${namespace}/otcGap`,
      payload: {
        symbol,
        from,
        to
      }
    }).then((data) => {
      const timestamp = [];
      const price = [];
      const marketPrice = [];
      const gap = [];
      const gapPer = [];
      if ((data || []).length > 0) {
        data.forEach((item) => {
          timestamp.push(item.create_time);
          price.push(item.price);
          marketPrice.push(item.market_price);
          gap.push(item.gap);
          gapPer.push(fNum(item.gap / item.price * 100, 2));
        })
      }
      this.setState({
        timestamp,
        price,
        marketPrice,
        gap,
        gapPer
      }, () => {
        this.doDraw();
      })
    })
  }
  doDraw() {
    const {
      timestamp,
      price,
      marketPrice,
      gap,
      gapPer
    } = this.state;
    const {symbol} = this.props;
    if ((timestamp || []).length > 0) {
      this.myChart.hideLoading();
      let legend = [
        '场外价',
        '场内价',
        //'价差', 
        '溢价率'];
      const xAxis = timestamp.map((item) => {
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
        color: ['#ffc107', '#14b143', '#2196f3', '#2196f3'],
        // color: ['green', 'red', '#295b51'],
        legend: {
          data: legend,
          top: 20,
          selected: {
            [legend[0]]: true,
            [legend[1]]: false,
            [legend[2]]: true
            //[legend[3]]: true
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
              //if (item.value) {
              result += item.marker + ' ' + item.seriesName + ' : ' + yiwanNum(item.value) + '</br>';
              //}
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
            xAxisIndex: [0],
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
            },
            axisPointer: {
              z: 100
            }
          }],
        yAxis: [
          {
            type: 'value',
            // name: '价格',
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
                return yiwanNum(data, 2);
              }
            },
            axisLine: {
              show: false
            }
          },
          {
            type: 'value',
            // name: '溢价率(%)',
            scale: true,
            boundaryGap: ['20%', '20%'],
            position: 'right',
            offset: 0, 
            axisTick: {show: false},
            splitLine: {
              show: false,
              lineStyle: {
                type: 'dashed'
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
            data: price,
            yAxisIndex: 0,
            lineStyle: {
              width: 2
            },
            symbol: 'none',
            smooth: true,
            barGap: '-100%'
          },
          {
            name: legend[1],
            type: 'line',
            data: marketPrice,
            yAxisIndex: 0,
            lineStyle: {
              width: 2
            },
            symbol: 'none',
            smooth: true,           
            barGap: '-100%'

          },
          {
            name: legend[2],
            type: 'line',
            data: gapPer,
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
    const {symbol} = this.props;
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
              <span className="info">{symbol} OTC溢价</span>
            </Col>
            <Col span={12} style={{textAlign: 'right'}}>
              <span style={{float: 'right'}} className="time">

                <MyPicker {...myPickerTimePorps}></MyPicker>
                {/* <Radio.Group value={this.state.timeType} onChange={(e) => {
                  this.timeTypeChange(e.target.value);
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
          <div id={`echartId_${this.props.symbol}`} style={{width: `${w}px`, height: `${h}px`, margin: '0 auto'}}></div>
        </div>
      </div>
    );
  }
}

export default volume;