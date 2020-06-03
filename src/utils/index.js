/* global window */
import classnames from 'classnames'
import lodash from 'lodash'
import config from './config'
import request from './request'
import {color} from './theme'
import {message} from 'antd';
window.localforage = require('localforage');


/**
 * 加法运算，避免数据相加小数点后产生多位数和计算精度损失。
 * 
 * @param num1加数1 | num2加数2
 */
const numAdd = (num1, num2) => {
  var baseNum, baseNum1, baseNum2;
  try {
    baseNum1 = num1.toString().split('.')[1].length;
  } catch (e) {
    baseNum1 = 0;
  }
  try {
    baseNum2 = num2.toString().split('.')[1].length;
  } catch (e) {
    baseNum2 = 0;
  }
  baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
  return (num1 * baseNum + num2 * baseNum) / baseNum;
};
/**
 * 减法运算，避免数据相减小数点后产生多位数和计算精度损失。
 * 
 * @param num1被减数  |  num2减数
 */
const numSub = (num1, num2) => {
  var baseNum, baseNum1, baseNum2;
  var precision;// 精度
  try {
    baseNum1 = num1.toString().split('.')[1].length;
  } catch (e) {
    baseNum1 = 0;
  }
  try {
    baseNum2 = num2.toString().split('.')[1].length;
  } catch (e) {
    baseNum2 = 0;
  }
  baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
  precision = baseNum1 >= baseNum2 ? baseNum1 : baseNum2;
  return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
};
/**
 * 乘法运算，避免数据相乘小数点后产生多位数和计算精度损失。
 * 
 * @param num1被乘数 | num2乘数
 */
const numMulti = (num1, num2) => {
  var baseNum = 0;
  try {
    baseNum += num1.toString().split('.')[1].length;
  } catch (e) {
  }
  try {
    baseNum += num2.toString().split('.')[1].length;
  } catch (e) {
  }
  return Number(num1.toString().replace('.', '')) * Number(num2.toString().replace('.', '')) / Math.pow(10, baseNum);
};
/**
 * 除法运算，避免数据相除小数点后产生多位数和计算精度损失。
 * 
 * @param num1被除数 | num2除数
 */
const numDiv = (num1, num2) => {
  var baseNum1 = 0, baseNum2 = 0;
  var baseNum3, baseNum4;
  try {
    baseNum1 = num1.toString().split('.')[1].length;
  } catch (e) {
    baseNum1 = 0;
  }
  try {
    baseNum2 = num2.toString().split('.')[1].length;
  } catch (e) {
    baseNum2 = 0;
  }

  baseNum3 = Number(num1.toString().replace('.', ''));
  baseNum4 = Number(num2.toString().replace('.', ''));
  return baseNum3 / baseNum4 * Math.pow(10, baseNum2 - baseNum1);

};


String.prototype.Trim = function() {
  return this.replace(/(^\s*)|(\s*$)/g, '');
}
String.prototype.LTrim = function() {
  return this.replace(/(^\s*)/g, '');
}
String.prototype.RTrim = function() {
  return this.replace(/(\s*$)/g, '');
}
Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
// 连字符转驼峰
String.prototype.hyphenToHump = function() {
  return this.replace(/-(\w)/g, (...args) => {
    return args[1].toUpperCase()
  })
}

// 驼峰转连字符
String.prototype.humpToHyphen = function() {
  return this.replace(/([A-Z])/g, '-$1').toLowerCase()
}

// 日期格式化
Date.prototype.format = function(format) {
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: ('00000000' + this.getMilliseconds()).substr(-3)
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length))
    }
  }
  return format
}


/**
 * @param   {String}
 * @return  {String}
 */

const queryURL = (name, searchStr) => {
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  let r = window.location.search.substr(1).match(reg);
  if (searchStr) {
    r = searchStr.substr(1).match(reg);
  }
  if (r != null) {return decodeURI(r[2])}
  return null
}

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  const item = array.filter(_ => _[keyAlias] === key)
  if (item.length) {
    return item[0]
  }
  return null
}

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
const arrayToTree = (array, id = 'id', pid = 'pid', children = 'children') => {
  let data = lodash.cloneDeep(array)
  let result = []
  let hash = {}
  data.forEach((item, index) => {
    hash[data[index][id]] = data[index]
  })

  data.forEach((item) => {
    let hashVP = hash[item[pid]]
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = [])
      hashVP[children].push(item)
    } else {
      result.push(item)
    }
  })
  return result
}

// 深复制，支持大部分类型
const deepClone = (values) => {
  let copy;

  // Handle the 3 simple types, and null or undefined
  if (values == null || typeof values !== 'object') {return values;}

  // Handle Date
  if (values instanceof Date) {
    copy = new Date();
    copy.setTime(values.getTime());
    return copy;
  }

  // Handle Array
  if (values instanceof Array) {
    copy = [];
    for (let i = 0, len = values.length; i < len; i++) {
      copy[i] = deepClone(values[i]);
    }
    return copy;
  }

  // Handle Object
  if (values instanceof Object) {
    copy = {};
    for (const attr in values) {
      if (values.hasOwnProperty(attr)) {copy[attr] = deepClone(values[attr]);}
    }
    return copy;
  }

  throw new Error('Unable to copy values! Its type isn\'t supported.');
};

const changeTitle = (title) => {
  document.title = title;
  window.parent.document.title = title;
}

const setItem = (key, value, callback) => {
  localforage.setItem(key, value).then(function(val) {
    if (typeof callback === 'function') {
      callback(val);
    }
  }).catch(function(err) {
    message.error(err);
  });
}

const getItem = (key, callback) => {
  localforage.getItem(key).then(function(val) {
    if (typeof callback === 'function') {
      callback(val);
    }
  }).catch(function(err) {
    message.error(err);
  });
}

const removeItem = (key, callback) => {
  localforage.removeItem(key).then(function(val) {
    if (typeof callback === 'function') {
      callback(val);
    }
  }).catch(function(err) {
    message.error(err);
  });
}

const randomString = (len) => {
  len = len || 32;
  let $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789';
  let maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

const randomId = () => {
  return String(new Date().getTime());
}

const parseParams = (data) => {
  try {
    var tempArr = [];
    for (var i in data) {
      var key = encodeURIComponent(i);
      var value = encodeURIComponent(data[i]);
      tempArr.push(key + '=' + value);
    }
    var urlParamsStr = tempArr.join('&');
    return urlParamsStr;
  } catch (err) {
    return '';
  }
}

//将科学计数法转换为小数
const NE = (num) => {
  let m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
  return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
}

const isEmpty = (obj) => {
  if (typeof obj === 'undefined' || obj === null || obj === '') {
    return true;
  }

  // 检验 undefined 和 null
  if (!obj && obj !== 0) {
    return true;
  }

  if (Array.prototype.isPrototypeOf(obj) && obj.length === 0) {
    return true;
  }

  if (Object.prototype.isPrototypeOf(obj) && Object.keys(obj).length === 0) {
    return true;
  }

  return false;
}

const fNum = (str, tail = 4, ne = 0) => {
  // return parseFloat(Number(str).toFixed(tail));
  if (isEmpty(str)) {str = 0;}
  let num = parseFloat(Number(str).toFixed(tail));

  if (ne) {num = NE(num);}

  return num;
}

const fPrice = (s) => {
  if (isNaN(Number(s)) || s === null || typeof s === 'object' || typeof s === 'boolean') {
    return null;
  }
  let b = '';
  if (s < 0) {
    b = '-';
  }
  s = parseFloat((s + '').replace(/[^\d\\.]/g, '')) + '';
  let l = s.split('.')[0].split('').reverse();
  let r = s.split('.')[1];   
  let t = '';   
  for (let i = 0; i < l.length; i ++) {   
    t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? ',' : '');   
  }   
  return b + t.split('').reverse().join('') + (r ? '.' + r : '');   
}
const rPrice = (s) => {
  return parseFloat(s.replace(/[^\d\\.-]/g, '')); 
}

const getTailArr = (fromData) => {
  let tailArr = [];
  let formArr = [];
  for (let i = 0; i < fromData.length; i++) {
    formArr = formArr.concat(fromData[i].form);
  }
  for (let i = 0; i < formArr.length; i++) {
    if (formArr[i].type !== 'array') {
      if (formArr[i].tail === '%') {
        tailArr.push(formArr[i].name);
      }
    } else {
      let arrayForm = formArr[i].form;
      for (let j = 0; j < arrayForm.length; j++) {
        if (arrayForm[j].tail === '%') {
          tailArr.push(arrayForm[j].name);
        }
      }
    }
  }
  return tailArr;
}
const formatterNum = (value) => {
  const reg = new RegExp('^[+-]{0,1}(\\d+)$|^[+-]{0,1}(\\d+\\.\\d+)$');
  if (reg.test(String(value))) {
    return fNum(`${numMulti(parseFloat(value), 100)}`, 16);
  }
  return value;
}
const parserNum = (value) => {
  const reg = new RegExp('^[+-]{0,1}(\\d+)$|^[+-]{0,1}(\\d+\\.\\d+)$');
  if (reg.test(String(value))) {
    return fNum(`${numDiv(parseFloat(value), 100)}`, 16);
  }
  return value;
}

const parserValues = (strategyFormData, values) => {
  let tailArr = getTailArr(strategyFormData);
  for (let key in values) {
    if (tailArr.indexOf(key) !== -1) {
      if (Object.prototype.toString.call(values[key]) === '[object Array]') {
        for (let k = 0; k < values[key].length; k++) {
          values[key][k] = parserNum(values[key][k]);
        }
      } else {
        values[key] = parserNum(values[key]);
      }
    }
  }
  return values;
}

// 获取表单元素是否可用参考值
const getPvalue = (formData, name) => {
  let result = null;
  for (let i = 0; i < formData.length; i++) {
    for (let ii = 0; ii < formData[i].form.length; ii++) {
      if (formData[i].form[ii].name === name) {
        result = formData[i].form[ii].value;
        break;
      }
    }
  }
  return result;
}


const getObjFromArray = (arr, key, val) => {
  let result = null;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] == val) {
      result = arr[i];
      break;
    }
  }
  return result;
}

// 科学记数法数字转成可读的数字字符串
const getFullNum = (num) => {
  //处理非数字
  if (isNaN(num)) {return num}

  //处理不需要转换的数字
  var str = '' + num;
  if (!/e/i.test(str)) {return num;}

  return num.toFixed(18).replace(/\.?0+$/, '');
}


const setHeight = () => {
  let hp100 = document.getElementById('hp100');
  let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  if (hp100) {
    hp100.style.height = h + 'px';
  }
}


const UnitMap = {
  0: '零',
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
  7: '七',
  8: '八',
  9: '九'
};
const BigUnitMap = {
  10: '十',
  100: '百',
  1000: '千'
};
const toChineseSub = (n, i, units) => {
  let list = n.slice(i).join('');
  if (i != 0 && list.match(/^0+$/i)) {return '';}
  if (i == 0 && units[i].BigUnit == '10' && units[i].Unit == '1') {return '';}
  return UnitMap[units[i].Unit]
}
const getUnit = (num) => {
  let n = num.toString().split('');
  let units = function(n) {
    let ns = [];
    for (let i = 0; i < n.length; i++) {
      ns.push({
        Unit: n[i],
        BigUnit: '1' + Array(n.length - i).join('0')
      })
    }
    return ns
  } (n);

  let str = '';
  let last;
  for (let i = 0; i < units.length; i++) {
    if (last != '0' || units[i].Unit != '0') {
      str += toChineseSub(n, i, units) + (units[i].Unit != '0' && typeof BigUnitMap[units[i].BigUnit] != 'undefined' ? BigUnitMap[units[i].BigUnit] : '');
      last = units[i].Unit
    }
  }
  return str
}
const toChinese = (num) => {
  num = num || 0;
  let str = num.toString().split('').reverse().join(''),
    reg = /(\d{1,4})(\d{1,4})?(\d{1,4})?(\d{1,4})?/i,
    ex = reg.exec(str);
  let qian, wang, yi;
  if (ex[1]) {qian = ex[1].split('').reverse().join('');}
  if (ex[2]) {wang = ex[2].split('').reverse().join('');}
  if (ex[3]) {yi = ex[3].split('').reverse().join('');}
  let result = '';
  if (yi && yi.match(/[^0]/i)) {
    result = result + getUnit(yi) + '亿'
  }
  if (wang && wang.match(/[^0]/i)) {
    result = result + getUnit(wang) + '万'
  }
  if (!qian || !result || !qian.match(/^0+$/i)) {
    result = result + getUnit(qian)
  }
  return result
}

const toChineseAndCal = (num, unitAmount, last, symbol) => {
  let result = toChinese(num);
  let calResult = null;
  if (unitAmount && last && symbol) {
    calResult = ` (${fPrice(fNum(num * unitAmount / last, 2)) + symbol})`;
  }
  if (calResult) {
    result = result + calResult;
  }
  return result;
}

function compare(propertyName, asc = true) {
  return function(a, b) {
    let value1 = a[propertyName];
    let value2 = b[propertyName];
    if (asc) {
      return value2 - value1;
    } 
    return value1 - value2;
  };
}

const changeIcon = (url) => {
  if (url) {
    const link = document.head.querySelector('link');
    link.href = '/www/favicon/' + url;
  }
}

const deepGet = (data, str, def = null) => {
  if (str.substr) {str = str.split(/\.|\\|\//);}

  if (str.length && data) {
    return deepGet(data[str.shift()], str)
  } else if (!str.length && data) {
    return data
  }
  return def;
}

const wanNum = (v, fixedNum = 2, wanFixedNum = 2, ltone = 4) => {
  v = Number(v);
  let result = null
  if (v || v === 0) {
    if (Math.abs(v) >= 10000) {
      result = fPrice(fNum(v / 10000, wanFixedNum, 1)) + 'w';
    } else if (Math.abs(v) < 1) {
      result = fNum(v, ltone, 1);
    } else {
      result = fPrice(fNum(v, fixedNum, 1));
    }
  }
  return result;
}

module.exports = {
  config,
  request,
  color,
  classnames,
  queryURL,
  queryArray,
  arrayToTree,
  deepClone,
  changeTitle,
  setItem,
  getItem,
  removeItem,
  randomString,
  parseParams,
  fNum,
  numAdd,
  numSub,
  numMulti,
  numDiv,
  parserValues,
  getTailArr,
  formatterNum,
  randomId,
  getPvalue,
  isEmpty,
  getObjFromArray,
  getFullNum,
  NE,
  setHeight,
  fPrice,
  rPrice,
  toChinese,
  compare,
  toChineseAndCal,
  changeIcon,
  deepGet,
  wanNum
}
