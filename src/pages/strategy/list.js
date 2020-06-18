/*
 * @Date: 2020-06-02 17:45:33
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-18 18:25:23
 */ 
/*global someFunction ENV:true log:true*/
/*eslint no-undef: "error"*/
import React, {PureComponent} from 'react';
import {NavBar, BizIcon, Empty} from 'components';
import {deepGet} from 'utils';
import {StrategyItem} from './components';
import {Button, Modal} from 'antd-mobile';
import Router from 'umi/router';
import styles from './index.less';

class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tipsVisible: false
    };
    this.showInfo = this.showInfo.bind(this);
  }
  showInfo() {
    this.setState({
      tipsVisible: true
    })
  }
  render() {
    const {title} = this.props.route;
    const list = Array.from({length: 10}, (v, i) => i);
    const strategyType = deepGet(this.props, 'match.params.type');
    const typeMap = new Map([
      ['1', '网格'],
      ['2', '套利']
    ]);
    const strategyTypeName = typeMap.get(strategyType);
    let tipDom = null;
    switch (strategyType) {
      case '1': 
        tipDom = <div className={styles.tipWp}>
          <p>
          网格交易法，指以某点为基点，每上涨或下跌一定点数挂一定数量空单或多单，设定盈利目标，但不设止损，当价格朝期望方向进展时获利平仓，并在原点位挂同样的买单或卖单。
          </p>
        </div>
        break;
      case '2': 
        tipDom = <div className={styles.tipWp}>
          <p>套利主要提供数字货币的期限套利和跨期套利。</p>
          <p>
            1期现套利根据套利方向的不同分为正向期现套利和反向期现套利，正向期现套利是指当期货价格相对于持有成本理论价格较高，买入现货卖空期货；反向期现套利是指当期货市价低于持有成本理论价格，买入期货卖空现货；当期货价格与现货价格收敛时获取收益。
          </p>
          <p>
            2跨期套利是在同一合约品种的不同月份的合约上建立数量相等、方向相反的交易头寸，最后以对冲或交割方式结束交易、获得收益的方式。在OKEx平台上，目前的交割合约有当周、次周和季度合约，因此我们就可以通过跨期套利策略买卖不同到期日的合约来进行套利。
          </p>
        </div>
        break;
      default:
        break;
    }
    return (
      <React.Fragment>
        <NavBar
          icon="back"
          leftContent={null}
          rightContent={<div onClick={() => {Router.push('/user/api/add');}}><BizIcon type="plus"></BizIcon></div>}
        >
          <div onClick={this.showInfo}>
            {strategyTypeName}{title} ?
          </div>
        </NavBar>
        <div className={styles.list}>
          {!list.length && <Empty icon="empty" title={`暂无${strategyTypeName}策略`}>
            <Button type="ghost" inline onClick={() => {
              Router.push('/user/api/add')
            }}>添加策略</Button>
          </Empty>}
          {list.map(i => 
            <StrategyItem></StrategyItem> 
          )}
        </div>

        <Modal
          visible={this.state.tipsVisible}
          transparent
          maskClosable={false}
          onClose={() => {this.setState({tipsVisible: false})}}
          title="规则"
          footer={[{text: '确定', onPress: () => {this.setState({tipsVisible: false})}}]}
          wrapProps={{onTouchStart: this.onWrapTouchStart}}
        >
          {tipDom}
        </Modal>
      </React.Fragment>
    );
  }
}

export default index;