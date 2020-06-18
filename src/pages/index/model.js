import * as userServices from 'services/user';


export default {
  namespace: 'main',
  state: {
    userInfo: {}
  },
  effects: {
    *login({payload}, {call, put, select}) {
      const params = payload;
      const data = yield call(userServices.login, params);
      if (data.success && data.code === 0) {
        return data;
      } 
      throw data;
              
    },
    *reg({payload}, {call, put, select}) { // 注册获取验证码; 注册
      const params = payload;
      const data = yield call(userServices.register, params);
      if (data.success && data.code === 0) {
        return data;
      } 
      throw data;
              
    },
    /**
     * 修改个人信息
     *
     * @param {*} { payload }
     * @param {*} { call, put, select }
     */
    *changeInfo({payload}, {call, put, select}) {
      const data = yield call(userServices.updateInfo, payload);
    },
    /**
     * 获取个人信息
     *
     * @param {*} { payload }
     * @param {*} { call, put, select }
     */
    *getInfoData({payload}, {call, put, select}) {
      const data = yield call(userServices.info, payload);
      if (data.success) {
        const {
          name, nickname, wechat, qq, city, note, bitcoin, ethereum, phone, regnumber, id
        } = data.payload.data;
        yield put({
          type: 'updateState',
          payload: {
            userInfo: {name, nickname, wechat, qq, city, note, bitcoin, ethereum, phone, regnumber, id}
          }
        });
        return data;
      } 
      throw data;
              
    },
    *changePassword({payload}, {call, put, select}) { // 修改密码
      const params = payload;
      const data = yield call(userServices.changePassword, params);
      if (data.success) {
        return data;
      } 
      throw data;
              
    },
    *checkPasswordCode({payload}, {call, put, select}) { // 找回密码获取token
      const params = payload;
      const data = yield call(userServices.checkPasswordCode, params);
      if (data.success && data.code === 0) {
        return data;
      } 
      throw data;
              
    },
    *reSetPassword({payload}, {call, put, select}) { // 找回密码重置密码
      const params = payload;
      const data = yield call(userServices.reSetPassword, params);
      if (data.success && data.code === 0) {
        return data;
      } 
      throw data;
              
    },
    *smsForgotPassword({payload}, {call, put, select}) { // 找回密码获取验证码
      const params = payload;
      const data = yield call(userServices.smsForgotPassword, params);
      if (data.success && data.code === 0) {
        return data;
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