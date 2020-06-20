import React from 'react';
import {connect} from 'dva';
// import BScroll from 'better-scroll';
import router from 'umi/router';
import {MyPicker} from 'components';
import {Button, Modal, Toast, Flex, NavBar, Icon} from 'antd-mobile';
import {Volume} from './components';
import {numAdd, numSub, numMulti, numDiv} from 'utils';


const {alert} = Modal;
const namespace = 'data';
@connect(({data, loading}) => ({
  data,
  loading
}))
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      symbolList: ['BTC', 'ETH', 'BCH', 'LTC', 'EOS', 'BSV', 'ETC', 'XRP', 'TRX'],
      unit: true // true 张 false 个
    };
  }
  componentDidMount() {
  }
  componentWillUnmount() {
  }
  go(url) {
    const reg = /^(http:\/\/|https:\/\/).*$/g;
    if (url === '') {
      return;
    }
    if (reg.test(url)) {
      window.location.href = url;
      return false;
    }
    router.push(url);
  }
  // changeUnit = () => {
  //   this.setState({
  //     unit: !this.state.unit
  //   }, () => {
  //     setTimeout(() => {
  //       this.doVolumeDraw();
  //     }, 300)
  //   })
  // }
  doVolumeDraw = () => {
    (this.state.symbolList || []).forEach((symbol) => {
      this.refs[symbol].doDraw();
    })

  }
  render() {
    const {inTab} = this.props;
    const season = [
      {
        label: '张',
        value: true
      },
      {
        label: '个',
        value: false
      }
    ];
    const myPickerPorps = {
      data: season,
      cols: 1,
      value: [this.state.unit],
      title: '选择计价单位',
      extra: '选择计价单位',
      onOk: v => {
        if (v[0] !== this.state.unit) {
          this.setState(
            {
              unit: v[0]
            },
            () => {
              // this.changeUnit();
              setTimeout(() => {
                this.doVolumeDraw();
              }, 300)
            }
          );
        }
      },
      CustomChildren: props => {
        return (
          <span onClick={props.onClick} className="right">
            <i className="iconfont icon-Setup"></i>
          </span>
        );
      }
    };
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
                rightContent={[<MyPicker {...myPickerPorps}></MyPicker>]}
              >合约持仓总量及交易量</NavBar>
            </div>
            <div className="scroll-container">
              <div className="main-container" style={{minHeight: '100%'}}>
                {(this.state.symbolList || []).map((symbol, index) => {
                  return <div key={index} id={symbol}><Volume ref={symbol} symbol={symbol} unit={this.state.unit} dispatch={this.props.dispatch} app={this.props.app}></Volume></div>
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return <div className="inTabContainer">
      {(this.state.symbolList || []).map((symbol, index) => {
        return <div key={index} id={symbol}><Volume ref={symbol} symbol={symbol} unit={this.state.unit} dispatch={this.props.dispatch} app={this.props.app}></Volume></div>
      })}
    </div>

  }
}

// function mapStateToProps(state) {
//   return {
//     loading: state.loading,
//     tool: state.tool
//   };
// }
export default Index;
