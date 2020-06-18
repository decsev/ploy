/*
 * @Date: 2020-06-15 12:06:32
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-15 18:33:34
 */ 
import * as userServices from 'services/user';


export default {
  namespace: 'user',
  state: {
    userInfo: {}
  },
  effects: {
    /**
     * 修改个人信息
     *
     * @param {*} { payload }
     * @param {*} { call, put, select }
     */
    *changeInfo({payload}, {call, put, select}) {
      const data = yield call(userServices.updateInfo, payload);
      console.log('data', data)
      if (data.success && data.code === 0) {
        return data;
      }
      throw data;
    },
    /**
     * 获取个人信息
     *
     * @param {*} { payload }
     * @param {*} { call, put, select }
     */
    *info({payload}, {call, put, select}) {
      const data = yield call(userServices.info, payload);
      if (data.success && data.code === 0) {
        yield put({
          type: 'updateState',
          payload: {
            userInfo: data.payload.data || {}
          }
        });
        return data;
      } 
      throw data;
              
    },
    *changePassword({payload}, {call, put, select}) { // 修改密码
      const data = yield call(userServices.changePassword, payload);
      console.log('----', data)
      if (data.success && data.code === 0) {
        return data;
      } 
      throw data;
    },
    *checkPasswordCode({payload}, {call, put, select}) { // 找回密码获取验证码
      const params = payload;
      const data = yield call(userServices.checkPasswordCode, params);
      if (data.success) {
        return data;
      } 
      throw data;
              
    },
    *reSetPassword({payload}, {call, put, select}) { // 找回密码重置密码
      const params = payload;
      const data = yield call(userServices.reSetPassword, params);
      if (data.success) {
        return data;
      } 
      throw data;
              
    },
    *smsForgotPassword({payload}, {call, put, select}) { // 找回密码获取验证码
      const params = payload;
      const data = yield call(userServices.smsForgotPassword, params);
      if (data.success) {
        return data;
      } 
      throw data;        
    },
    *logout({payload}, {call, put, select}) {
      const data = yield call(userServices.logout, payload);
      if (data.success && data.code === 0) {
        return data.payload;
      }
      throw data;
    }
  },
  
  reducers: {
    updateState(state, {payload}) {
      return {
        ...state,
        ...payload
      }
    }
  },
  
  subscriptions: {
    setupHistory({dispatch, history}) {
      return history.listen(({pathname}) => {
        
      });
    }
  }
};