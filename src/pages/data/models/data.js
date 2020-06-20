/*
 * @Date: 2020-06-15 12:06:32
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-20 10:59:16
 */ 
import * as dataServices from 'services/data';

export default {
  namespace: 'data',
  state: {
    exList: ['OKEX', 'HUOBI', 'OKEX_HUOBI', 'MIX'],
    selectedEx: 'OKEX',
    symbols: ['all', 'btc', 'eth', 'eos', 'bch', 'bsv', 'etc', 'ltc', 'xrp', 'trx'],
    gaplist: null,
    quotesData: null, // 行情数据
    kitsData: null, // kit工具
    rateData: null, // 利率
    usdtusdData: null, // usdtusd兑换价
    warnType: '1', // 预警类型
    warnList: {}, // 预警列表
    configSymbol: null, // 交易对列表
    contractdata: null // 首页btc合约，多空比数据
  },
  effects: {
    *onInputChange({payload}, {call, put, select}) {
      if (payload.reporter === 'priceEx') {
        yield put({
          type: 'setPriceSymbol',
          payload: {
            ex: payload.value
          }
        });
      }
      // 仓位
      if (payload.reporter === 'positionExx') {
        yield put({
          type: 'setPosition',
          payload: {
            t: 'x',
            v: payload.value
          }
        });
      }
      if (payload.reporter === 'positionExy') {
        yield put({
          type: 'setPosition',
          payload: {
            t: 'y',
            v: payload.value
          }
        });
      }
    },
    *gaplist({payload}, {call, put, select}) {
      const {selectedEx} = yield select(state => state.data);
      payload.varieties = 'TS,NS,QS,NT,QT,QN,TX,QZ,BH,WV,BQ,HZ';
      switch (selectedEx) {
        case 'HUOBI':
          payload.varieties =
            'TS|HUOBI_HUOBI,NS|HUOBI_HUOBI,QS|HUOBI_HUOBI,NT|HUOBI_HUOBI,QT|HUOBI_HUOBI,QN|HUOBI_HUOBI';
          break;
        case 'OKEX_HUOBI':
          payload.varieties =
            'TS|OKEX_HUOBI,NS|OKEX_HUOBI,QS|OKEX_HUOBI,NT|OKEX_HUOBI,QT|OKEX_HUOBI,QN|OKEX_HUOBI,TT|OKEX_HUOBI,NN|OKEX_HUOBI,QQ|OKEX_HUOBI,SS|OKEX_HUOBI';
          break;
        case 'MIX':
          payload.varieties =
            'TS,TS|HUOBI_HUOBI,TS|OKEX_HUOBI,NS,NS|HUOBI_HUOBI,NS|OKEX_HUOBI,QS,QS|HUOBI_HUOBI,QS|OKEX_HUOBI,NT,NT|HUOBI_HUOBI,NT|OKEX_HUOBI,QT,QT|HUOBI_HUOBI,QT|OKEX_HUOBI,QN,QN|HUOBI_HUOBI,QN|OKEX_HUOBI,TT|OKEX_HUOBI,NN|OKEX_HUOBI,QQ|OKEX_HUOBI,SS|OKEX_HUOBI';
          break;
        default:
          break;
      }
      const {ex} = payload;
      if (ex === 'OKEX') {
        payload.varieties = 'TS,NS,QS,NT,QT,QN';
      }
      const data = yield call(dataServices.gaplist, payload);
      if (data.success) {
        if (data.code === 0 && !ex) {
          yield put({
            type: 'updateState',
            payload: {
              gaplist: data.payload.data
            }
          });
        }
        if (ex === 'OKEX') {
          return data;
        }
      } else {
        throw data;
      }
    },
    *getKits({payload}, {call, put, select}) {
      const params = payload;
      const data = yield call(dataServices.getKits, params);
      const firstdata = [
        {
          id: 1,
          title: '计算器',
          type: 'bigData',
          data: [
            {
              className: 'colff8e00',
              iconfont: 'icon-calculator',
              text: '等差网格',
              url: '/cal?type=1'
            },
            {
              className: 'col40729c',
              iconfont: 'icon-calculator1',
              text: '自定义网格',
              url: '/cal?type=2'
            }
          ]
        }
      ];
      if (data.success) {
        if (data.payload.data) {
          data.payload.data.splice(-1, 0, firstdata[0]);
          yield put({
            type: 'updateState',
            payload: {
              kitsData: data.payload.data
            }
          });
          return data;
        }
      } else {
        throw data;
      }
    },
    *allPrice({payload}, {call, put, select}) {
      const params = payload;
      const data = yield call(dataServices.allPrice, params);
      return data;
    },
    *usdtusd({payload}, {call, put, select}) {
      const params = payload;
      const data = yield call(dataServices.usdtusd, params);
      if (data.success && data.code === 0) {
        yield put({
          type: 'updateState',
          payload: {
            usdtusdData: data.payload.data
          }
        });
        return data;
      } 
      throw data;
      
    },
    *allPriceBatch({payload}, {call, put, select}) {
      // 批量获取行情
      const params = payload;
      const data = yield call(dataServices.allPriceBatch, params);
      if (data.success && data.code === 0) {
        yield put({
          type: 'updateState',
          payload: {
            quotesData: data.payload.data
          }
        });
        return data;
      } 
      // throw data;
      
    },
    *rate({payload}, {call, put, select}) {
      const params = payload;
      const data = yield call(dataServices.rate, params);
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
    },
    *contractdataSummary({payload}, {call, put, select}) {
      const params = payload;
      const data = yield call(dataServices.contractdataSummary, params);
      if (data.success && data.code === 0) {
        yield put({
          type: 'contractdataSummarySuccess',
          payload: {
            data: data.payload.data
          }
        });
      } else {
        throw data;
      }
    },
    *configSymbol({payload}, {call, put, select}) {
      const {configSymbol} = yield select(state => state.data);
      if (configSymbol) {
        yield put({
          type: 'fetchConfigSymbolSuccess',
          payload: {
            data: configSymbol
          }
        });
      } else {
        const data = yield call(dataServices.configSymbol, payload);
        if (data.success && data.code === 0) {
          yield put({
            type: 'updateState',
            payload: {
              configSymbol: data.payload.data
            }
          });
          yield put({
            type: 'fetchConfigSymbolSuccess',
            payload: {
              data: data.payload.data
            }
          });
        }
      }
    },
    *addWarn({payload}, {call, put, select}) {
      const data = yield call(dataServices.addWarn, payload);
      if (data.success && data.code === 0) {
        return data;
      }
      throw data;
    },
    *warnList({payload}, {call, put, select}) {
      const data = yield call(dataServices.warnList, payload);
      if (data.success && data.code === 0) {
        yield put({
          type: 'fetchWarnListSuccess',
          payload: {
            type: payload.type,
            data: data.payload.data
          }
        });
      } else {
        throw data;
      }
    },
    *removeWarn({payload}, {call, put, select}) {
      const data = yield call(dataServices.removeWarn, payload);
      if (data.success && data.code === 0) {
        return data;
      } 
      throw data;
      
    },
    *editWarn({payload}, {call, put, select}) {
      const data = yield call(dataServices.editWarn, payload);
      if (data.success && data.code === 0) {
        return data;
      } 
      throw data;
      
    },
    *getWarn({payload}, {call, put, select}) {
      const data = yield call(dataServices.warnList, payload);
      if (data.success && data.code === 0) {
        if (payload.type === '4') {
          const exTemp = data.payload.data.config.ex;
          yield put({
            type: 'setPriceSymbol',
            payload: {
              ex: exTemp
            }
          });
        }

        if (payload.type === '5') {
          const xExchange = data.payload.data.config.xExchange;
          const yExchange = data.payload.data.config.xExchange;
          yield put({
            type: 'setPosition',
            payload: {
              t: 'x',
              v: xExchange
            }
          });
          if (yExchange !== '') {
            yield put({
              type: 'setPosition',
              payload: {
                t: 'y',
                v: yExchange
              }
            });
          }
        }

        yield put({
          type: 'getWarnSuccess',
          payload: {
            data: data.payload.data,
            type: payload.type
          }
        });
      } else {
        throw data;
      }
    },

    *tradesummary({payload}, {call, put}) {
      // 主力数据
      const data = yield call(dataServices.tradesummary, payload);
      if (data.code === 0 && data) {
        return data.payload.data;
      }
      throw data;
    },

    *openInterestVolume({payload}, {call, put}) {
      const data = yield call(dataServices.openInterestVolume, payload);
      if (data.code === 0 && data) {
        return data.payload.data;
      }
      throw data;
    },
    *longShortPositionRatio({payload}, {call, put}) {
      const data = yield call(dataServices.longShortPositionRatio, payload);
      if (data.code === 0 && data) {
        return data.payload.data;
      }
      throw data;
    },
    *trade({payload}, {call, put}) {
      // 主力数据
      const data = yield call(dataServices.trade, payload);
      if (data.code === 0 && data) {
        return data.payload.data;
      }
      throw data;
    },
    *otcGap({payload}, {call, put}) {
      // otc gap
      const data = yield call(dataServices.otcGap, payload);
      if (data.code === 0 && data) {
        return data.payload.data;
      }
      throw data;
    },
    /**
     * @description: 暴仓价
     * @param {type}
     * @return:
     */

    *explosive({payload}, {call, put}) {
      const data = yield call(dataServices.explosive, payload);
      if (data.code === 0 && data) {
        return data.payload.data;
      }
      throw data;
    },
    /**
     * @description: 挖矿难度
     * @param {type} 
     * @return: 
     */    
    *blockBtc({payload}, {call, put}) {
      const data = yield call(dataServices.blockBtc, payload);
      if (data.code === 0 && data) {
        return data.payload.data;
      }
      throw data;
    },
    /**
     * @description: 挖矿收益
     * @param {type} 
     * @return: 
     */    
    *profitability({payload}, {call, put}) {
      const data = yield call(dataServices.profitability, payload);
      if (data.code === 0 && data) {
        return data.payload.data;
      }
      throw data;
    }
  },

  reducers: {
    updateState(state, {payload}) {
      return {
        ...state,
        ...payload
      };
    },
    getWarnSuccess(state, {payload}) {
      const {data, type} = payload;
      switch (type) {
        case '1': {
          const {config, ...p} = data;
          let params = {
            ...p,
            ...config
          };
          params.status = !!params.status;
          params.notice_type = params.notice_type.split(',');
          state.priceFormData.forEach((item, index) => {
            item.value = params[item.name];
          });
          break;
        }
        case '2': {
          const {config, ...p} = data;
          let params = {
            ...p,
            ...config
          };
          params.status = !!params.status;
          params.notice_type = params.notice_type.split(',');
          state.gapFormData.forEach((item, index) => {
            item.value = params[item.name];
          });
          break;
        }
        case '3': {
          const {config, ...p} = data;
          let params = {
            ...p,
            ...config
          };
          params.status = !!params.status;
          params.notice_type = params.notice_type.split(',');
          state.otcFormData.forEach((item, index) => {
            item.value = params[item.name];
          });
          break;
        }
        case '4': {
          const {config, ...p} = data;
          let params = {
            ...p,
            ...config
          };
          params.status = !!params.status;
          params.notice_type = params.notice_type.split(',');
          state.explosiveFormData.forEach((item, index) => {
            item.value = params[item.name];
          });
          break;
        }
        case '5': {
          const {config, ...p} = data;
          let params = {
            ...p,
            ...config
          };
          params.status = !!params.status;
          params.notice_type = params.notice_type.split(',');
          state.positionFormData.forEach((item, index) => {
            item.value = params[item.name];
          });
          break;
        }
        default:
          break;
      }
      return {...state};
    },
    // resetFormData(state, {payload}) {
    //   state.gapFormData = deepClone(gapFormData);
    //   state.explosiveFormData = deepClone(explosiveFormData);
    //   state.otcFormData = deepClone(otcFormData);
    //   state.priceFormData = deepClone(priceFormData);
    //   state.positionFormData = deepClone(positionFormData);
    //   return {
    //     ...state
    //   };
    // },
    fetchConfigSymbolSuccess(state, {payload}) {
      const {explosive, gap, otc, position} = payload.data;
      let {exchangeList} = position || {};
      exchangeList = exchangeList || {};
      let explosiveOption = [];
      let gapOption = [];
      let otcOption = [];
      let positionExOption = [];
      (explosive || []).forEach(item => {
        explosiveOption.push({
          label: item.replace('_usd', '').toUpperCase(),
          value: item
        });
      });
      (gap || []).forEach(item => {
        gapOption.push({
          label: item,
          value: item
        });
      });
      (otc || []).forEach(item => {
        otcOption.push({
          label: item.toUpperCase(),
          value: item
        });
      });
      for (let key in exchangeList) {
        positionExOption.push({
          label: key,
          value: exchangeList[key]
        });
      }
      console.log('gapOption', gapOption)
      state.gapFormData[0].options = gapOption;
      state.otcFormData[0].options = otcOption;
      state.explosiveFormData[0].options = explosiveOption;
      state.positionFormData[0].options = positionExOption;
      state.positionFormData[3].options = positionExOption;
      return {
        ...state
      };
    },
    fetchWarnListSuccess(state, {payload}) {
      const {type, data} = payload;
      state.warnList[type] = data;
      return {...state};
    },
    setPriceSymbol(state, {payload}) {
      const {ex} = payload;
      let {price} = state.configSymbol;
      price = price[ex];
      let priceOption = [];

      (price || []).forEach(item => {
        priceOption.push({
          label: item.toUpperCase(),
          value: item
        });
      });
      state.priceFormData[1].options = priceOption;
      state.priceFormData[1].value = priceOption[0].value;
      return {
        ...state
      };
    },
    setPosition(state, {payload}) {
      //debugger;
      const {t, v} = payload;
      let {position} = state.configSymbol;
      const {accountList, contractList} = position;
      let accountOption = [];
      let contractOption = [];
      (accountList[v] || []).forEach(item => {
        accountOption.push({
          label: item.account,
          value: item.id.toString()
        });
      });
      (contractList[v.toUpperCase()] || []).forEach(item => {
        contractOption.push({
          label: item.name,
          value: item.value
        });
      });
      if (t === 'x') {
        state.positionFormData[1].options = accountOption;
        // state.positionFormData[1].value = accountOption[0].value;
        state.positionFormData[2].options = contractOption;
        // state.positionFormData[2].value = contractOption[0].value;
      }
      if (t === 'y') {
        state.positionFormData[4].options = accountOption;
        // state.positionFormData[4].value = accountOption[0].value;
        state.positionFormData[5].options = contractOption;
        // state.positionFormData[5].value = contractOption[0].value;
      }
      return {
        ...state
      };
    },
    contractdataSummarySuccess(state, {payload}) {
      // console.log('payload', payload);
      const {data} = payload;
      state.contractdata = data; // 首页btc合约，多空比数据
      return {...state};
    }
  },
  
  subscriptions: {
    setupHistory({dispatch, history}) {
      return history.listen(({pathname}) => {
        
      });
    }
  }
};