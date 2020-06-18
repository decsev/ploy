/*
 * @Date: 2020-06-15 12:06:32
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-16 16:58:05
 */ 
import * as apiServices from 'services/api';


export default {
  namespace: 'api',
  state: {
    apiList: null
  },
  effects: {
    /**
     * api列表
     *
     * @param {*} { payload }
     * @param {*} { call, put, select }
     */
    *apiList({payload}, {call, put, select}) {
      const data = yield call(apiServices.tradingAccountAll, payload);
      if (data.success && data.code === 0) {
        const {list} = data.payload.data;
        let arr = [];
        Object.keys(list).forEach((item, index) => {
          arr.push(...list[item]);
        });
        yield put({
          type: 'updateState',
          payload: {
            apiList: arr
          }
        })
        return arr;
      }
      throw data;
    },
    /**
     * 删除api
     *
     * @param {*} { payload }
     * @param {*} { call, put, select }
     */
    *delete({payload}, {call, put, select}) {
      const data = yield call(apiServices.deleteTradingAccount, payload);
      if (data.success && data.code === 0) {
        return data;
      }
      throw data;
    },
    /**
     * 添加\修改api
     *
     * @param {*} { payload }
     * @param {*} { call, put, select }
     */
    *save({payload}, {call, put, select}) {
      const data = yield call(apiServices.saveTradingAccount, payload);
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