/*
 * @Date: 2020-06-16 11:25:25
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-18 15:52:51
 */ 
import {request, config} from 'utils'
import qs from 'qs';

const {api} = config;
const {apiv1} = api;

const localStorageRegnumber = localStorage.getItem('_n');
const localStorageToken = localStorage.getItem('_t');


export async function allPriceBatch(params) {
  const {symbols, span} = params;
  return request({
    url: `${apiv1}/api/okex/allPriceBatch`,
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