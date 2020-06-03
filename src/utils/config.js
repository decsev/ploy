/*
 * @Date: 2019-06-12 16:26:47
 * @LastEditors: lianggua
 * @LastEditTime: 2020-05-27 15:40:11
 */ 
let APIV1 = 'https://tokenwin.one';
let APIV2 = 'https://tokenwin.one';
if (phixSit === 'prod' || phixSit === 'dev') {
  let myhost = 'tokenwin.one';
  const hostnameArr = location.hostname.split('.');
  if (hostnameArr.length >= 2) {
    myhost = hostnameArr[hostnameArr.length - 2] + '.' + hostnameArr[hostnameArr.length - 1]
  }
  if (myhost === 'imbin.cn') {
    myhost = 'tokenwin.one';
  }
  APIV1 = 'https://' + myhost;
  APIV2 = 'https://' + myhost;
}
const iconFontJS = window.location.hostname === 'localhost' ? '/iconfont.js' : `${APIV1}/www/v2/dist/iconfont.js`;
module.exports = {
  isProd: true, // 上线时设为true
  name: 'imbin',
  prefix: 'imbin',
  footerText: 'imbin',
  logo: '/logo.svg',
  pageSize: 10,
  iconFontCSS: '/iconfont.css',
  iconFontJS,
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
