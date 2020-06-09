/*
 * @Date: 2020-06-09 11:50:59
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-09 16:06:44
 */ 
import React, {PureComponent} from 'react';
import Router from 'umi/router';
import BizIcon from '../BizIcon';
import styles from './index.less';

class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { };
    this.doLeftClick = this.doLeftClick.bind(this);
  }
  doLeftClick() {
    const {onLeftClick} = this.props;
    if (onLeftClick) {
      onLeftClick();
    } else {
      Router.goBack();
    }
  }
  render() {
    const {icon, leftContent, rightContent} = this.props;
    return (
      <div className={styles.navBar}>
        <div className={styles.left} onClick={this.doLeftClick}>
          {icon && <span className={styles.backIcon}><BizIcon type={icon}></BizIcon></span>}
          {leftContent && leftContent}
        </div>
        <div className={styles.title}>{this.props.children}</div>
        <div className={styles.right}>
          {rightContent && rightContent}
        </div> 
      </div>
    );
  }
}

export default index;