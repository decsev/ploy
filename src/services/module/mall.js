/*
 * @Date: 2020-06-02 17:55:33
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-03 12:30:59
 */ 
import {stringify, request, apiUrlfun} from '../config';

// 获取商品列表
export async function rtsGetCommodityList(params) {
  return request(`${apiUrlfun('mall')}/v1/commodities?${stringify(params)}`);
}

// 获取一级类目
export async function rtsGetCategorysList(params) {
  return request(`${apiUrlfun('mall')}/v1/categories?${stringify(params)}`);
}

// 获取二级类目
export async function rtsGetSubcategories(params) {
  return request(`${apiUrlfun('mall')}/v1/subcategories?${stringify(params)}`);
}
