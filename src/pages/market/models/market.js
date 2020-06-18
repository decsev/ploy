/*
 * @Date: 2020-06-15 12:06:32
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-18 18:36:57
 */ 
import * as marketServices from 'services/market';


export default {
  namespace: 'market',
  state: {
    quotesData: null, // 行情数据
    rateData: null // 美无兑人民币汇率
  },
  effects: {
    *allPriceBatch({payload}, {call, put, select}) {
      // 批量获取行情
      const params = payload;
      const data = yield call(marketServices.allPriceBatch, params);
      if (data.success && data.code === 0) {
        yield put({
          type: 'updateState',
          payload: {
            quotesData: data.payload.data
          }
        });
        return data;
      } 
      //throw data;
    },
    *rate({payload}, {call, put, select}) {
      const params = payload;
      const data = yield call(marketServices.rate, params);
      if (data.success && data.code === 0) {
        yield put({
          type: 'updateState',
          payload: {
            rateData: data.payload.data
          }
        });
      } else {
        throw data;
      }
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