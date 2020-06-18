/*
 * @Date: 2020-06-16 11:25:25
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-16 16:57:22
 */ 
import {request, config} from 'utils'
import qs from 'qs';

const {api} = config;
const {apiv1} = api;

const localStorageRegnumber = localStorage.getItem('_n');
const localStorageToken = localStorage.getItem('_t');

/**
 * api列表
 * @export
 * @returns
 */

export async function tradingAccountAll(params) {
  return request({
    url: `${apiv1}/api/custom/tradingAccountAll`,
    method: 'post',
    data: params,
    headers: {
      Regnumber: localStorageRegnumber,
      Token: localStorageToken
    }
  });
}

/**
 * 删除api
 * @export
 * @returns
 */

export async function deleteTradingAccount(params) {
  return request({
    url: `${apiv1}/api/custom/deleteTradingAccount`,
    method: 'post',
    data: params,
    headers: {
      Regnumber: localStorageRegnumber,
      Token: localStorageToken
    }
  });
}

/**
 * 删除api
 * @export
 * @returns
 */

export async function saveTradingAccount(params) {
  return request({
    url: `${apiv1}/api/custom/saveTradingAccount`,
    method: 'post',
    data: params,
    headers: {
      Regnumber: localStorageRegnumber,
      Token: localStorageToken
    }
  });
}