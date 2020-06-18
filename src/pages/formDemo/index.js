/*
 * @Date: 2020-06-02 17:45:33
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-10 17:59:33
 */ 
/*global someFunction ENV:true log:true*/
/*eslint no-undef: "error"*/
import React, {PureComponent} from 'react';
import {Button, Toast} from 'antd-mobile';
import {Input, Inputx, Selectx} from 'components';
import {trim} from 'utils';
import styles from './test.less';
const utils = {
  validName(name) {
    if (!/^[0-9a-zA-Z\u4e00-\u9fa5_\s]{1,5}$/.test(name)) {
      return '请输入正确的姓名格式';
    }
  },
  validPhone(value) {
    if (value.length < 11) {
      return '手机号码长度不正确';
    } else if (!/^1[34578]\d{9}$/.test(value)) {
      return '手机号码格式不正确';
    }
    return '';
  },
  validExchange(value) {
    if (!value.length) {
      return '请选择交易所';
    }
    return '';
  },
  formatName(val) {
    const newVal = val.Trim();
    return newVal.replace(/^(([0-9a-zA-Z\u4e00-\u9fa5_\s]{1,160})|(.*))(.*)$/, '$2');
  },
  formatPhone(val) {
    return val.replace(/[^\d]/g, '');
  }
}
class Test extends React.Component {
  constructor(props) {
    super(props);
    this.accountInfo = {
      name: '志良',
      phone: '13538831277',
      exchange: ''
    };
    this.state = {
      nameIsRight: !!this.accountInfo.name,
      phoneIsRight: !!this.accountInfo.phone,
      exchangeIsRight: !!this.accountInfo.exchange
    }
    this.submitParams = {
      Name: this.accountInfo.name || '',
      Phone: this.accountInfo.phone || '',
      Exchange: this.accountInfo.exchange || ''
    }
    this.validInput = this.validInput.bind(this);
    this.formatInput = this.formatInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    log('当前环境', ENV)
  }
  // 校验输入
  validInput(value, type) {
    let resultObj = null;

    resultObj = {
      result: false,
      errorTip: ''
    };


    if (value.length !== 0) {
      let errorMsg = '';
      switch (type) {
        case 'name':
          errorMsg = utils.validName(value);
          break;
        case 'phone':
          errorMsg = utils.validPhone(value);
          break;
        case 'exchange': 
          errorMsg = utils.validExchange(value);
          break;
        default: break;
      }
      if (errorMsg) {
        resultObj.errorTip = errorMsg;
      } else {
        resultObj.result = true;
      }
    }

    this.changeInputState(type, resultObj.result);
    this.changeSubmitParams(type, value);

    return resultObj;
  }
  formatInput(value, type) {
    if (value.length === 0) {return '';}
    let val = value;
    switch (type) {
      case 'name':
        val = utils.formatName(value);
        break;
      case 'phone':
        val = utils.formatPhone(value);
        break;
      default: break;
    }
    return val;
  }
  changeInputState(type, isRight) {
    const key = `${type}IsRight`;
    let param = {};
    param[key] = isRight;
    this.setState({
      ...param
    })
  }
  changeSubmitParams(type, value) {
    const valNameTypeMap = {
      name: 'Name',
      phone: 'Phone',
      exchange: 'Exchange'
    };
    this.submitParams[valNameTypeMap[type]] = value.replace(/\s/g, '');
  }
  handleSubmit() {
    if (!this.btnActive) {return;}
    // to do ajax
    log('提交的参数', this.submitParams)
  }
  render() {
    let defaultValue = null;
    if (this.accountInfo) {
      defaultValue = {
        name: this.accountInfo.name || '',
        phone: this.accountInfo.phone || '',
        exchange: this.accountInfo.exchange || ''
      }
    }
    const {nameIsRight, phoneIsRight, exchangeIsRight} = this.state;
    this.btnActive = nameIsRight && phoneIsRight && exchangeIsRight;
    let theme = 'line'; // 主题line, 'bar'
    return (
      <div className={styles.testWp}>
        <Inputx
          theme={theme}
          id="name"
          label="姓名"
          inputTip="真实姓名"
          placeholder="请输入本人姓名"
          validInput={this.validInput}
          formatInput={this.formatInput}
          defaultValue={defaultValue && defaultValue.name}
          disabled={false}
        />

        <Inputx
          theme={theme}
          id="phone"
          label="手机号"
          inputTip="13位的手机号"
          placeholder="请输入手机号码"
          validInput={this.validInput}
          formatInput={this.formatInput}
          defaultValue={defaultValue && defaultValue.phone}
          disabled={false}
          maxlength="11"
          tail="86"
        />

        <Selectx
          theme={theme}
          id="exchange"
          label="交易所"
          inputTip="请选择交易所"
          placeholder="选择交易所"
          validInput={this.validInput}
          defaultValue={defaultValue && defaultValue.exchange}
          disabled={false}
          options={[
            {
              label: 'OKEx',
              value: 'OKEx'
            },
            {
              label: 'Huobi',
              value: 'Huobi'
            }
          ]}
        >

        </Selectx>
        <div style={{paddingTop: '50px'}}><Button type="primary" disabled={!this.btnActive} onClick={this.handleSubmit}>提交</Button></div>
      </div>
    );
  }
}

export default Test;
