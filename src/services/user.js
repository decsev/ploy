import {request, config} from 'utils'
import qs from 'qs';

const {api} = config;
const {apiv1} = api;

const localStorageRegnumber = localStorage.getItem('_n');
const localStorageToken = localStorage.getItem('_t');


/**
 * 登陆
 * @export
 * @returns
 */

export async function login(params) {
  return request({
    url: `${apiv1}/home/index/auth`,
    method: 'post',
    data: qs.stringify(params)
  });
}

/**
 * 注册
 * @export 
 * @returns
 */

export async function register(params) {
  return request({
    url: `${apiv1}/api/index/reg`,
    method: 'post',
    data: qs.stringify(params)
  });
}


/**
 * 退出登录
 * @export 
 * @returns
 */

export async function logout(params) {
  return request({
    url: `${apiv1}/api/custom/logout`,
    method: 'post',
    data: qs.stringify(params)
  });
}


/**
 * 更新个人资料
 * @export
 * @returns
 */

export async function updateInfo(params) {
  return request({
    url: `${apiv1}/api/custom/updateInfo`,
    method: 'post',
    data: qs.stringify(params),
    headers: {
      Regnumber: localStorageRegnumber,
      Token: localStorageToken
    }
  });
}

/**
 * 获取个人资料
 * @export
 * @returns
 */

export async function info(params) {
  return request({
    url: `${apiv1}/api/custom/info`,
    method: 'get',
    data: params,
    headers: {
      Regnumber: localStorageRegnumber,
      Token: localStorageToken
    }
  });
}

/**
 * 获取当前积分值
 * @export
 * @returns
 */

export async function currentPoints() {
  return request({
    url: api.currentPoints,
    method: 'get',
    headers: {
      Regnumber: localStorageRegnumber,
      Token: localStorageToken
    }
  });
}

/**
 * 获取积分记录
 * @export
 * @returns
 */

export async function pointsLog() {
  return request({
    url: api.pointsLog,
    method: 'get',
    headers: {
      Regnumber: localStorageRegnumber,
      Token: localStorageToken
    }
  });
}


/**
 * 修改密码
 * @export
 * @returns
 */

export async function changePassword(params) {
  return request({
    url: `${apiv1}/api/custom/changePassword`,
    method: 'post',
    data: qs.stringify(params),
    headers: {
      Regnumber: localStorageRegnumber,
      Token: localStorageToken
    }
  });
}


/**
 * 找回密码发短信 找回密码step1
 * @export
 * @returns
 */

export async function smsForgotPassword(params) {
  return request({
    url: `${apiv1}/api/sms/forgotPassword`,
    method: 'post',
    data: qs.stringify(params),
    headers: {
      Regnumber: localStorageRegnumber,
      Token: localStorageToken
    }
  });
}

/**
 * 验证短信验证码是否正确 找回密码step2
 * @export
 * @returns
 */

export async function checkPasswordCode(params) {
  return request({
    url: `${apiv1}/api/sms/checkPasswordCode`,
    method: 'post',
    data: qs.stringify(params),
    headers: {
      Regnumber: localStorageRegnumber,
      Token: localStorageToken
    }
  });
}


/**
 * 重置密码 找回密码step3
 * @export
 * @returns
 */

export async function reSetPassword(params) {
  return request({
    url: `${apiv1}/api/index/reSetPassword`,
    method: 'post',
    data: qs.stringify(params),
    headers: {
      Regnumber: localStorageRegnumber,
      Token: localStorageToken
    }
  });
}


