/*
 * @Date: 2020-06-09 17:32:08
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-12 12:03:54
 */ 
import React, {PureComponent} from 'react';
import {BizIcon} from 'components';
import {Switch} from 'antd-mobile';
import styles from './index.less';

class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checked: false
    };
    this.delete = this.delete.bind(this);
  }
  delete() {
    const {del} = this.props;
    if (del) {
      del();
    }
    console.log('delete')
  }
  render() {
    const {data} = this.props;
    const {account, apiKey, addDate} = data || {};
    return (
      <div className={styles.itemWp}>
        <div className={styles.header}>
          <div className={styles.left}>ETH网格</div>
          <div className={styles.right}>
            <Switch
              checked={this.state.checked}
              onChange={() => {
                this.setState({
                  checked: !this.state.checked
                });
                // 停止或启动策略
              }}
            />
          </div>
        </div>
        <div className={styles.content}>
          <div>
            <p>200U</p>
            <p>今日盈亏</p>
          </div>
          <div>
            <p>200U</p>
            <p>总盈亏</p>
          </div>
          <div>
            <p>200%</p>
            <p>年化收益率</p>
          </div>
        </div>
        <div className={styles.footer}>
          <div>
            <p>ETH/USDT</p>
            <p>OKEX</p>
          </div>
          <div>
            <p>96次</p>
            <p>交易次数</p>
          </div>
        </div>
      </div>
    );
  }
}

export default index;