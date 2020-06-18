/*
 * @Date: 2019-06-12 16:26:47
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-17 15:50:19
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
    apiv1: `${APIV1}`
  },
  colon: false,
  countdownTime: 120
}
