/*
 * @Date: 2020-06-02 17:45:33
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-16 18:32:19
 */ 
/*global someFunction ENV:true log:true*/
/*eslint no-undef: "error"*/
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import Router from 'umi/router';
import {Button, Toast} from 'antd-mobile';
import {Input, Inputx, Selectx, NavBar} from 'components';
import {ApiInfo} from '../components';
import {trim, deepGet, getObjFromArray} from 'utils';
import styles from './api.less';
const utils = {
  validExchange(value) {
    if (!value.length) {
      return '请选择交易所';
    }
    return '';
  },
  validAccount(val) {
    //if (!/^1[34578]\d{9}$/.test(val) && !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(val)) {
    if (!/^.{1,}$/.test(val)) {
      return '请输入正确的账号';
    }
    return '';
  },
  validApiKey(val) {
    if (!/^.{1,}$/.test(val)) {
      return '请输入正确的Api Key';
    }
    return '';
  },
  validSecretKey(val) {
    if (!/^.{1,}$/.test(val)) {
      return '请输入正确的Secret Key';
    }
    return '';
  },
  validPassphrase(val) {
    if (!/^.{1,}$/.test(val)) {
      return '请输入正确的Passphrase';
    }
  }
}
const namespace = 'api';
@connect(({api, loading}) => ({
  api,
  loading
}))
class index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exchangeIsRight: false,
      accountIsRight: false,
      apiKeyIsRight: false,
      secretKeyIsRight: false,
      passphraseKeyIsRight: false,
      isInited: false,
      formData: null
    }
    this.dispatch = this.props.dispatch;
    // this.submitParams = {
    //   account: '',
    //   access_id: '',
    //   secret_key: '',
    //   passphrase: '',
    //   exchange: ''
    // }
    this.validInput = this.validInput.bind(this);
    this.formatInput = this.formatInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchApiList = this.fetchApiList.bind(this);
    this.initData = this.initData.bind(this);
  }
  componentDidMount() {
    console.log('isInited---', this.state.isInited)
    log('当前环境', ENV);
    log(this.props);
    const id = deepGet(this.props, 'match.params.id');
    if (id) { // 编辑api，如果没有apilist先获取
      const {api} = this.props;
      const {apiList} = api;
      if (!apiList) {
        this.fetchApiList();
      } else {
        console.log(12345);
        this.initData()
      }
    } else {
      this.setState({
        isInited: true
      })
    }
  }
  componentWillUnmount() {
    this.setState({
      isInited: false,
      formData: null
    })
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
        case 'account':
          errorMsg = utils.validAccount(value);
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
      // account: 'account',
      exchange: 'exchange',
      apiKey: 'access_id',
      secretKey: 'secret_key'
      // passphrase: 'passphrase'
    };
    // this.submitParams[valNameTypeMap[type] || type] = value.replace(/\s/g, '');
    const formData = this.state.formData || {};
    formData[valNameTypeMap[type] || type] = value.replace(/\s/g, '');
    this.setState({
      formData
    })
  }
  handleSubmit() {
    if (!this.btnActive) {return;}
    // to do ajax
    log('提交的参数', this.state.formData);
    const params = {};
    const id = deepGet(this.props, 'match.params.id');
    if (id) {
      params.id = id;
    }
    this.dispatch({
      type: `${namespace}/save`,
      payload: {
        ...this.state.formData,
        ...params
      }
    }).then((res) => {
      Router.push('/user/api/list');
    })
  }
  fetchApiList() {
    this.dispatch({
      type: `${namespace}/apiList`,
      payload: {}
    }).then((res) => {
      this.initData();
    })
  }
  initData() {
    const id = deepGet(this.props, 'match.params.id');
    const {api} = this.props;
    const {apiList} = api;
    const apiData = getObjFromArray(apiList, 'id', id);
    if (apiData) {
      const {account, exchange, access_id, secret_key, passphrase} = apiData;
      const formData = {
        account: account,
        exchange: exchange,
        apiKey: access_id,
        secretKey: secret_key,
        passphrase: passphrase
      }
      this.setState({
        formData,
        isInited: true
      }, () => {
        this.validInput(exchange, 'exchange');
        this.validInput(account, 'account');
        this.validInput(access_id, 'apiKey');
        this.validInput(secret_key, 'secretKey');
        this.validInput(passphrase, 'passphrase');
      });
      
    } else {
      this.setState({
        isInited: true
      })
    }
  }
  render() {
    const {
      exchangeIsRight,
      accountIsRight,
      apiKeyIsRight,
      secretKeyIsRight,
      passphraseIsRight,
      isInited,
      formData
    } = this.state;
    const {exchange} = formData || {};
    this.btnActive = exchangeIsRight && accountIsRight && apiKeyIsRight && secretKeyIsRight && passphraseIsRight;
    if (exchange !== 'OKex') {
      this.btnActive = exchangeIsRight && accountIsRight && apiKeyIsRight && secretKeyIsRight;
    }
    let theme = 'line'; // 主题line, 'bar'
    console.log('isInited', isInited)
    if (!isInited) {
      return null;
    }
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
            defaultValue={formData && formData.exchange}
            disabled={false}
            options={[
              {
                label: 'OKex',
                value: 'OKex'
              },
              {
                label: '火币',
                value: 'Huobi'
              },
              {
                label: '币安',
                value: 'Binance'
              }
            ]}
          >
          </Selectx>

          <Inputx
            theme={theme}
            id="account"
            label="账号"
            inputTip="交易所账号（邮箱/手机号）"
            placeholder="请输入交易所账号"
            validInput={this.validInput}
            formatInput={this.formatInput}
            defaultValue={formData && formData.account}
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
            defaultValue={formData && formData.apiKey}
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
            defaultValue={formData && formData.secretKey}
            disabled={false}
            tail={null}
            inputType="password"
          />

          {exchange === 'OKex' && <Inputx
            theme={theme}
            id="passphrase"
            label="Passphrase"
            inputTip="Passphrase"
            placeholder="请输入Passphrase"
            validInput={this.validInput}
            formatInput={this.formatInput}
            defaultValue={formData && formData.passphrase}
            disabled={false}
            tail={null}
            inputType="password"
          />}

         
          <div style={{paddingTop: '50px'}}>
            <Button loading={this.props.loading.effects['api/save']} type="primary" disabled={!this.btnActive} onClick={this.handleSubmit}>提交</Button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default index;
