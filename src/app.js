/*
 * @Date: 2020-06-02 16:36:45
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-15 18:31:22
 */ 
import {Toast} from 'antd-mobile';
export const dva = {
  config: {
    onError(err) {
      Toast.fail(err.msg || err.message);
      err.preventDefault();
    }
  }
};
