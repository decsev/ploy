/*
 * @Date: 2020-06-02 17:33:34
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-08 15:56:00
 */

import React, {PureComponent} from 'react';

class Exception extends PureComponent {
  render() {
    const {children} = this.props;

    return (
      <div>
        异常页面通用结构
        {children}
      </div>
    );
  }
}

export default Exception;
