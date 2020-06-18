/*
 * @Date: 2020-06-02 17:45:33
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-18 18:25:38
 */ 
/*global someFunction ENV:true log:true*/
/*eslint no-undef: "error"*/
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import Router from 'umi/router';
import {Button, Toast} from 'antd-mobile';
import {Input, Inputx, Selectx, NavBar, GetCode} from 'components';
import {trim, deepGet} from 'utils';
import styles from './index.less';
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
  validCode(value) {
    if (!/^.{1,}$/.test(value)) {
      return '验证码不能为空';
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
      phoneIsRight: false,
      codeIsRight: false,
      passwordIsRight: false,
      submitParams: null,
      isInited: false,
      token: null
    }
    this.dispatch = this.props.dispatch;
    this.validInput = this.validInput.bind(this);
    this.formatInput = this.formatInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getCode = this.getCode.bind(this);
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
        case 'code':
          errorMsg = utils.validCode(value);
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
    // to do ajax
    const {submitParams} = this.state;
    this.dispatch({
      type: `${namespace}/reg`,
      payload: {
        phone: submitParams.phone,
        password: submitParams.password,
        code: submitParams.code
      }
    }).then((res) => {
      Toast.success('注册成功!', 2);
      setTimeout(() => {
        Router.replace('/login');
      }, 2000);
    })
  }
  /**
     * @description 获取验证码
     */
  getCode(fun = null) {
    const {submitParams} = this.state;
    this.dispatch({
      type: `${namespace}/reg`,
      payload: {
        phone: submitParams.phone
      }
    }).then((data) => {
      Toast.info('验证码获取成功');
      if (fun) {
        fun();
      }
    });
  }

  initData() {
    const submitParams = {
      phone: '',
      code: '',
      password: ''
    }
    this.setState({
      submitParams,
      isInited: true
    }, () => {
      this.validInput('', 'phone');
      this.validInput('', 'code');
      this.validInput('', 'password');
    });
    
  }

  render() {
    const {phoneIsRight, codeIsRight, passwordIsRight, isInited, submitParams} = this.state;
    this.btnActive = !!phoneIsRight && !!codeIsRight && !!passwordIsRight;
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
          <div className={styles.code}>
            <div className={styles.left}>
              <Inputx
                theme={theme}
                id="code"
                label="验证码"
                inputTip="验证码"
                placeholder="验证码"
                validInput={this.validInput}
                formatInput={this.formatInput}
                defaultValue={submitParams && submitParams.code}
                disabled={false}
              />
            </div>
            <div className={styles.right}>
              <GetCode disabled={!phoneIsRight || this.props.loading.effects['main/reg']} doFetch={this.getCode} countTime={false}></GetCode>
            </div>
          </div>
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
          <div style={{paddingTop: '50px'}}><Button loading={this.props.loading.effects['main/reg']} type="primary" disabled={!this.btnActive} onClick={this.handleSubmit}>提交</Button></div>
          <div className={styles.bottomWp}>
            已有账号，<span onClick={() => {
              Router.push('/login');
            }}>立即登录</span>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default index;
