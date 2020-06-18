/*
 * @Date: 2020-06-02 17:45:33
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-18 18:24:48
 */ 
/*global someFunction ENV:true log:true*/
/*eslint no-undef: "error"*/
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Button, Toast} from 'antd-mobile';
import {Input, Inputx, Selectx, NavBar} from 'components';
import {trim} from 'utils';
import styles from './index.less';
import Router from 'umi/router';
const utils = {
  validPhone(value) {
    if (value.length < 11) {
      return '手机号码长度不正确';
    } else if (!/^1[34578]\d{9}$/.test(value)) {
      return '手机号码格式不正确';
    }
    return '';
  },
  validPassword(value) {
    if (!/^(?=.*[0-9])(?=.*[a-zA-Z])(.{6,20})$/.test(value)) {
      return '密码须同时包含字母和数字，长度为6-20位'
    }
    return '';
  },
  formatPhone(val) {
    return val.replace(/[^\d]/g, '');
  }
}
const namespace = 'main';

@connect(({main, loading}) => ({
  main,
  loading
}))
class index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      passwordIsRight: false,
      phoneIsRight: false,
      submitParams: null,
      isInited: false
    }
    this.dispatch = this.props.dispatch;
    this.validInput = this.validInput.bind(this);
    this.formatInput = this.formatInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.initData = this.initData.bind(this);
  }
  componentDidMount() {
    log('当前环境', ENV);
    this.initData();
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
        case 'phone':
          errorMsg = utils.validPhone(value);
          break;
        case 'password': 
          errorMsg = utils.validPassword(value);
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
    };
    const submitParams = this.state.submitParams || {};
    submitParams[valNameTypeMap[type] || type] = value.replace(/\s/g, '');
    this.setState({
      submitParams
    })
  }
  handleSubmit() {
    if (!this.btnActive) {return;}
    const {submitParams} = this.state;
    // to do ajax
    log('提交的参数', submitParams);
    this.dispatch({
      type: `${namespace}/login`,
      payload: {
        ...submitParams
      }
    }).then((res) => {
      const userInfo = res.payload.data;
      const {Token, Regnumber, vip, level, phone} = userInfo;
      localStorage.setItem('_t', Token);
      localStorage.setItem('_n', Regnumber);
      localStorage.setItem('vip', vip);
      localStorage.setItem('level', level);
      localStorage.setItem('phone', phone);
      window.location.href = '/user';
    }).catch((err) => {
      Toast.fail(err.msg || '登录失败!');
    })
  }
  initData() {
    const submitParams = {
      phone: '',
      password: ''
    }
    this.setState({
      submitParams,
      isInited: true
    }, () => {
      this.validInput('', 'phone');
      this.validInput('', 'password');
    });
  }
  render() {
    const {phoneIsRight, passwordIsRight, isInited, submitParams} = this.state;
    this.btnActive = phoneIsRight && passwordIsRight;
    let theme = 'line'; // 主题line, 'bar'
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
        <div className={styles.formWp}>
          <Inputx
            theme={theme}
            id="phone"
            label="手机号"
            inputTip="13位的手机号"
            placeholder="请输入手机号码"
            validInput={this.validInput}
            formatInput={this.formatInput}
            defaultValue={submitParams && submitParams.phone}
            disabled={false}
            maxlength="11"
          />
          <Inputx
            theme={theme}
            id="password"
            label="设置密码"
            inputTip="密码须同时包含字母和数字，长度为6-20位"
            placeholder="密码须同时包含字母和数字，长度为6-20位"
            validInput={this.validInput}
            formatInput={this.formatInput}
            defaultValue={submitParams && submitParams.password}
            disabled={false}
            inputType="password"
          />
          <div style={{paddingTop: '50px'}}><Button type="primary" disabled={!this.btnActive} onClick={this.handleSubmit}>提交</Button></div>
          <div className={styles.findPassword}>
            <span onClick={() => {
              Router.push('/findPw');
            }}>忘记密码</span>
          </div>
          <div className={styles.bottomWp}>
            还没有账号，<span onClick={() => {
              Router.push('/reg');
            }}>立即注册</span>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default index;
