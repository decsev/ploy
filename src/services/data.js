/*
 * @Date: 2020-06-16 11:25:25
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-19 18:13:34
 */ 
import {request, config, obj2query} from 'utils'
import qs from 'qs';

const {api} = config;
const {apiv1} = api;

const localStorageRegnumber = localStorage.getItem('_n');
const localStorageToken = localStorage.getItem('_t');

const getUrlByType = (type) => {
  let url = '/api/custom/price';

  if (type === '1' || type === 'price') {
    url = '/api/custom/price';
  }
  if (type === '2' || type === 'gap') {
    url = '/api/custom/gap';
  }
  if (type === '3' || type === 'otc') {
    url = '/api/custom/otc';
  }
  if (type === '4' || type === 'explosive') {
    url = '/api/custom/explosive';
  }
  if (type === '5' || type === 'position') {
    url = '/api/custom/position';
  }

  return url;
};

/**
 * 币助手初始化数据
 * @export
 * @returns
 */

export async function getKits(params) {
  const searchKey = obj2query(params);
  const ts = searchKey === '' ? '' : `?${searchKey}`;
  return request({
    url: `${apiv1}/api/custom/kits` + ts,
    method: 'get'
  });
}

export async function allPrice(params) {
  const {symbol, span} = params;
  return request({
    url: `${apiv1}/api/okex/allPrice/pre/1/symbol/${symbol}/span/${span}`,
    method: 'get'
  });
}

// /api/kraken/price/symbol/usdtusd usdt实时价格
export async function usdtusd() {
  return request({
    url: `${apiv1}/api/kraken/price/symbol/usdt_usd`,
    method: 'get'
  });
}

export async function gaplist(params) {
  return request({
    url: `${apiv1}/api/data/gplist`, //使用v2版本价差列表
    method: 'get',
    data: {
      symbols: 'btc,eth,eos,bch,bsv,etc,ltc,xrp,trx',
      varieties: params.varieties
    },
    headers: {
      Regnumber: localStorageRegnumber,
      Token: localStorageToken
    }
  });
}

export async function allPriceBatch(params) {
  const {symbols, span} = params;
  return request({
    url: `${apiv1}/api/okex/allPriceBatch`, // /pre/1/symbol/${symbol}/span/${span}
    method: 'get',
    data: {
      pre: 1,
      symbols,
      span
    }
  });
}

export async function rate() {
  return request({
    url: `${apiv1}/rate`,
    method: 'get'
  });
}

// 获取预警交易对

export async function configSymbol(params) {
  return request({
    url: `${apiv1}/api/data/configSymbol`,
    method: 'post',
    data: params
  });
}

// /api/custom / gap

export async function addWarn(payload) {
  const {type, ...params} = payload;
  let url = getUrlByType(type);
  return request({
    url: `${apiv1}${url}`,
    method: 'post',
    data: params
  });
}

export async function warnList(payload) {
  //debugger;
  const {type, ...params} = payload;
  let url = getUrlByType(type);
  return request({
    url: `${apiv1}${url}`,
    method: 'get',
    data: params
  });
}

export async function removeWarn(payload) {
  const {type, ...params} = payload;
  let url = getUrlByType(type);
  return request({
    url: `${apiv1}${url}`,
    method: 'post',
    data: params
  });
}

export async function editWarn(payload) {
  const {type, ...params} = payload;
  let url = getUrlByType(type);
  return request({
    url: `${apiv1}${url}`,
    method: 'post',
    data: params
  });
}

export async function tradesummary(params) {
  return request({
    url: `${apiv1}/api/contractdata/tradesummary`,
    method: 'get',
    data: params
  });
}

export async function contractdataSummary(params) {
  return request({
    url: `${apiv1}/api/contractdata/summary`,
    method: 'get',
    data: params
  });
}

export async function openInterestVolume(params) {
  return request({
    url: `${apiv1}/api/contractdata/openInterestVolume`,
    method: 'get',
    data: params
  });
}

export async function longShortPositionRatio(params) {
  return request({
    url: `${apiv1}/api/contractdata/longShortPositionRatio`,
    method: 'get',
    data: params
  });
}

export async function trade(params) {
  return request({
    url: `${apiv1}/api/contractdata/trade`,
    method: 'get',
    data: params
  });
}

export async function otcGap(params) {
  return request({
    url: `${apiv1}/api/data/otcGap`,
    method: 'get',
    data: params
  });
}

export async function explosive(params) {
  return request({
    url: `${apiv1}/api/contractdata/explosive`,
    method: 'get',
    data: params
  });
}


/**
 * @description: 挖矿难度
 * @param {type} 
 * @return: 
 */
export async function blockBtc(params) {
  return request({
    url: `${apiv1}/api/contractdata/blockBtc`,
    method: 'get',
    data: params
  })
}


/**
 * @description: 挖矿收益
 * @param {type} 
 * @return: 
 */
export async function profitability(params) {
  return request({
    url: `${apiv1}/api/contractdata/profitability`,
    method: 'get',
    data: params
  })
}