/*
 * @Date: 2020-06-02 17:45:33
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-18 18:25:02
 */ 
/*global someFunction ENV:true log:true*/
/*eslint no-undef: "error"*/
import React, {PureComponent} from 'react';
import {Button, Toast} from 'antd-mobile';
import {Input, Inputx, Selectx, NavBar} from 'components';
import {ApiInfo} from '../components';
import {trim} from 'utils';
import styles from './api.less';
const utils = {
  validExchange(value) {
    if (!value.length) {
      return '请选择交易所';
    }
    return '';
  },
  validName(val) {
    if (!/^1[34578]\d{9}$/.test(val) && !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(val)) {
      return '请输入正确的账号';
    }
  },
  validApiKey(val) {
    if (!/^.{1,}$/.test(val)) {
      return '请输入正确的Api Key';
    }
  },
  validSecretKey(val) {
    if (!/^.{1,}$/.test(val)) {
      return '请输入正确的Secret Key';
    }
  },
  validPassphrase(val) {
    if (!/^.{1,}$/.test(val)) {
      return '请输入正确的Passphrase';
    }
  }
}
class index extends React.Component {
  constructor(props) {
    super(props);
    this.accountInfo = {
      exchange: '',
      name: '',
      apiKey: '',
      secretKey: '',
      passphrase: ''
    };
    this.state = {
      exchangeIsRight: !!this.accountInfo.exchange,
      nameIsRight: !!this.accountInfo.name,
      apiKeyIsRight: !!this.accountInfo.apiKey,
      secretKeyIsRight: !!this.accountInfo.secretKey,
      passphraseKeyIsRight: !!this.accountInfo.passphrase
    }
    this.submitParams = {
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
        case 'exchange':
          errorMsg = utils.validExchange(value);
          break;
        case 'name':
          errorMsg = utils.validName(value);
          break;
        case 'apiKey': 
          errorMsg = utils.validApiKey(value);
          break;
        case 'secretKey': 
          errorMsg = utils.validSecretKey(value);
          break;
        case 'passphrase': 
          errorMsg = utils.validPassphrase(value);
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
      // case 'name':
      //   val = utils.formatName(value);
      //   break;
      // case 'phone':
      //   val = utils.formatPhone(value);
      //   break;
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
      exchange: 'Exchange',
      apiKey: 'ApiKey',
      secretKey: 'SecretKey',
      passphrase: 'Passphrase'
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
    const {
      exchangeIsRight,
      nameIsRight,
      apiKeyIsRight,
      secretKeyIsRight,
      passphraseIsRight
    } = this.state;
    this.btnActive = exchangeIsRight && nameIsRight && apiKeyIsRight && secretKeyIsRight && passphraseIsRight;
    let theme = 'line'; // 主题line, 'bar'
    return (
      <React.Fragment>
        <NavBar
          icon="back"
          leftContent={null}
          rightContent={null}
        >{this.props.route.title}</NavBar>
        <ApiInfo></ApiInfo>
        <div className={styles.apiWp}>
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

          <Inputx
            theme={theme}
            id="name"
            label="账号"
            inputTip="交易所账号（邮箱/手机号）"
            placeholder="请输入交易所账号"
            validInput={this.validInput}
            formatInput={this.formatInput}
            defaultValue={defaultValue && defaultValue.name}
            disabled={false}
          />

          <Inputx
            theme={theme}
            id="apiKey"
            label="Api Key"
            inputTip="Api Key"
            placeholder="请输入Api Key"
            validInput={this.validInput}
            formatInput={this.formatInput}
            defaultValue={defaultValue && defaultValue.apiKey}
            disabled={false}
            tail={null}
          />

          <Inputx
            theme={theme}
            id="secretKey"
            label="Secret Key"
            inputTip="Secret Key"
            placeholder="请输入Secret Key"
            validInput={this.validInput}
            formatInput={this.formatInput}
            defaultValue={defaultValue && defaultValue.secretKey}
            disabled={false}
            tail={null}
          />

          <Inputx
            theme={theme}
            id="passphrase"
            label="Passphrase"
            inputTip="Passphrase"
            placeholder="请输入Passphrase"
            validInput={this.validInput}
            formatInput={this.formatInput}
            defaultValue={defaultValue && defaultValue.passphrase}
            disabled={false}
            tail={null}
          />

         
          <div style={{paddingTop: '50px'}}><Button type="primary" disabled={!this.btnActive} onClick={this.handleSubmit}>提交</Button></div>
        </div>
      </React.Fragment>
    );
  }
}

export default index;
