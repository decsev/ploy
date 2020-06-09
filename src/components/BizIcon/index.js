/*
 * @Date: 2020-06-02 17:52:41
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-06 15:30:36
 */ 
import React from 'react';

const BizIcon = props => {
  const {type} = props;
  return <i className={`iconfont icon-${type}`} />;
};
export default BizIcon;
