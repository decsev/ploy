/*
 * @Date: 2020-06-02 17:45:33
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-03 12:30:23
 */ 
import React, {PureComponent} from 'react';
import {Button, Toast} from 'antd-mobile';

class Test extends PureComponent {
  componentDidMount() {}

  showToast = () => {
    Toast.info('This is a toast tips !!!', 10);
  };

  render() {
    const {route} = this.props;
    return (
      <div>
        <Button type="primary" onClick={this.showToast}>
          {route.title}
        </Button>
      </div>
    );
  }
}

export default Test;
