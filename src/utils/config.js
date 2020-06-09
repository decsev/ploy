/*
 * @Date: 2019-06-12 16:26:47
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-06 11:24:31
 */ 
let APIV1 = 'https://tokenwin.one';
let APIV2 = 'https://tokenwin.one';

module.exports = {
  isProd: true, // 上线时设为true
  pageSize: 10,
  CORS: [APIV1, APIV2],
  openPages: ['/login'],
  apiPrefix: '/api/v1',
  APIV1,
  api: {
    Strategy: `${APIV1}/api/Strategy`,
    custom: `${APIV2}/api/custom`,
    accounts: `${APIV1}/api/accounts`,
    orderMonitor: `${APIV1}/api/order_monitor`,
    api1: `${APIV1}`
  },
  colon: false
}
