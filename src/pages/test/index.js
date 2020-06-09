/*
 * @Date: 2020-06-02 17:45:33
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-09 16:20:52
 */ 
/*global someFunction ENV:true log:true*/
/*eslint no-undef: "error"*/
import React, {PureComponent} from 'react';
import {NavBar, BizIcon} from 'components';
import Router from 'umi/router';
import styles from './test.less';

class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { };
    this.jumpToApiLink = this.jumpToApiLink.bind(this);
  }
  jumpToApiLink() {
    Router.push('/user');
  }
  render() {
    const {title} = this.props.route;
    const testList = Array.from({length: 10}, (v, i) => i);
    return (
      <React.Fragment>
        <NavBar
          icon="left"
          leftContent={null}
          rightContent={<div onClick={this.jumpToApiLink}><BizIcon type="plus"></BizIcon></div>}
        >{title}</NavBar>
        <div className={styles.testWp}>
          {testList.map(i => 
            <div className={styles.square} key={i}>
              {i}
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default index;