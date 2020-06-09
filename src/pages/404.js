/*
 * @Date: 2020-06-02 17:45:33
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-09 17:27:00
 */ 
import React from 'react';
import Router from 'umi/router';
import {Button} from 'antd-mobile';
import {Empty} from 'components';

export default () => <div style={{paddingTop: '200px'}}>
  <Empty
    icon="404"
    title="找不到该页面了"
  >
    <React.Fragment>
      <Button type="ghost" size="small" inline onClick={() => {
        Router.replace('/');
      }}>首页</Button>
      <Button style={{marginLeft: '30px'}} type="ghost" size="small" inline onClick={() => {
        Router.goBack();
      }}>返回</Button>
    </React.Fragment>
  </Empty>
</div>;
