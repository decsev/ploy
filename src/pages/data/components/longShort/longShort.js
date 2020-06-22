/*
 * @Date: 2020-01-15 12:30:45
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-22 17:12:34
 */
import React, {PureComponent} from 'react';
import router from 'umi/router';
import {Row, Col, Icon} from 'antd-mobile';
import {BizIcon} from 'components';
import {config, deepGet, fNum} from 'utils';
import styles from './longShort.less';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  render() {
    const {longShortData} = this.props;
    return (
      <div className={styles.longShortContainer}>
        <div className={styles.title}>
          <span>多空比</span>
          <span
            className={styles.icon}
            onClick={() => {
              router.replace({
                pathname: '/data',
                query: {
                  tabIndex: 1
                }
              })
            }}
          ><BizIcon type="more"></BizIcon></span>
        </div>
        <ul>
          {(Object.keys(longShortData) || []).map((key, index) => {
            const item = longShortData[key];
            if (index < 3) {
              return (
                <li key={index}>
                  <p>{item.symbol.toUpperCase()}</p>
                  <p className={fNum(item.gap * 100, 2) >= 0 ? 'up' : 'down'}>{item.ratio}</p>
                  <p>{fNum(item.gap * 100, 2)}%</p>
                </li>
              );
            }
            return null;
          })}
        </ul>
      </div>
    );
  }
}

export default Index;
