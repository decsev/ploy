/*
 * @Date: 2020-06-02 17:45:33
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-09 19:43:01
 */ 
/*global someFunction ENV:true log:true*/
/*eslint no-undef: "error"*/
import React, {PureComponent} from 'react';
import {NavBar, BizIcon, Empty} from 'components';
import {ApiItem} from '../components';
import {Button} from 'antd-mobile';
import Router from 'umi/router';
import styles from './api.less';

class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { };
    this.jumpToApiLink = this.jumpToApiLink.bind(this);
  }
  jumpToApiLink() {
    Router.push('/user/api/exchangeList');
  }
  render() {
    const {title} = this.props.route;
    const list = Array.from({length: 10}, (v, i) => i);
    return (
      <React.Fragment>
        <NavBar
          icon="left"
          leftContent={null}
          rightContent={<div onClick={this.jumpToApiLink}><BizIcon type="plus"></BizIcon></div>}
        >{title}</NavBar>
        <div className={styles.apiList}>
          {!list.length && <Empty icon="empty" title="暂无API">
            <Button type="ghost" size="small" inline onClick={() => {
              Router.push('/user/api/exchangeList')
            }}>添加API</Button>
          </Empty>}
          {list.map(i => 
            <ApiItem></ApiItem>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default index;