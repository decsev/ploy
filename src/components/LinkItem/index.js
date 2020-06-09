/*
 * @Date: 2020-06-09 10:35:43
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-09 11:16:26
 */ 
import React, {PureComponent} from 'react';
import Router from 'umi/router';
import BizIcon from '../BizIcon';
import styles from './index.less';
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { };
  }
  render() {
    return (
      <div className={`${styles.linkItem} ${this.props.isLast ? styles.noSplitLine : null}`} onClick={() => {
        Router.push(`${this.props.link}`)
      }}>
        <div className={`${styles.iconContainer} ${styles[this.props.iconClassName]}`}>
          <BizIcon type={this.props.icon}></BizIcon>
        </div>
        <div className={styles.content}>
          <div className={styles.title}>{this.props.title}</div>
          <div className={styles.rightIcon}>
            <BizIcon type="right"></BizIcon>    
          </div>    
        </div>      
      </div>
    );
  }
}

export default index;