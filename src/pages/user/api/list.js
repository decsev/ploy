/*
 * @Date: 2020-06-02 17:45:33
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-18 18:23:22
 */ 
/*global someFunction ENV:true log:true*/
/*eslint no-undef: "error"*/
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {NavBar, BizIcon, Empty} from 'components';
import {ApiItem} from '../components';
import {Button, Toast, Modal} from 'antd-mobile';
import Router from 'umi/router';
import styles from './api.less';
const alert = Modal.alert;

const namespace = 'api';
@connect(({api, loading}) => ({
  api,
  loading
}))
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { };
    this.dispatch = this.props.dispatch;
    this.fetchApiList = this.fetchApiList.bind(this);
    this.delete = this.delete.bind(this);
  }
  componentDidMount() {
    this.fetchApiList();
  }
  fetchApiList() {
    this.dispatch({
      type: `${namespace}/apiList`,
      payload: {}
    })
  }
  delete(id) {
    if (!id) {
      Toast.info('发生未知错误');
      return;
    }
    alert('删除', '确定要删除???', [
      {text: '取消', onPress: () => {}},
      {text: '确定', onPress: () => {
        this.dispatch({
          type: `${namespace}/delete`,
          payload: {
            id
          }
        }).then((res) => {
          this.fetchApiList();
        })
      }}
    ])
  }
  render() {
    const {route, api} = this.props;
    const {title} = route;
    const {apiList} = api;
    // const list = Array.from({length: 10}, (v, i) => i);
    return (
      <React.Fragment>
        <NavBar
          icon="back"
          leftContent={null}
          rightContent={<div onClick={() => {Router.push('/user/api/add')}}><BizIcon type="plus"></BizIcon></div>}
        >{title}</NavBar>
        <div className={styles.apiList}>
          {!(apiList || []).length && <Empty icon="empty" title="暂无API">
            <Button type="ghost" inline onClick={() => {
              Router.push('/user/api/add')
            }}>添加API</Button>
          </Empty>}
          {(apiList || []).map((item, index) => {
            return <ApiItem key={index} data={item} del={(id) => {
              this.delete(id)
            }}></ApiItem>;
          })}
        </div>
      </React.Fragment>
    );
  }
}

export default index;