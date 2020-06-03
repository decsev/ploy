/*
 * @Date: 2020-06-02 17:45:33
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-03 20:01:06
 */ 
import React, {PureComponent} from 'react';
import styles from './index.less';

class Index extends PureComponent {
  render() {
    const {route} = this.props;
    return (
      <div className={styles.index}>
        <div className={styles.test}>
          <h2>{route.title}</h2>
        </div>
      </div>
    );
  }
}

export default Index;
