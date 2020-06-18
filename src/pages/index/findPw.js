/*
 * @Date: 2020-06-02 17:45:33
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-18 18:25:45
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
      submitParams: null,
      isInited: false,
      step: 1,
      token: null
    }
    this.dispatch = this.props.dispatch;
    this.validInput = this.validInput.bind(this);
    this.formatInput = this.formatInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getCode = this.getCode.bind(this);
    this.initData = this.initData.bind(this);
    this.step1 = this.step1.bind(this);
    this.step2 = this.step2.bind(this);
  }
  componentDidMount() {
    log('当前环境', ENV);
    const token = deepGet(this.props, 'match.params.token');
    if (token) {
      this.setState({
        token,
        step: 2
      }, () => {
        this.initData();
      })
    } else {
      this.setState({
        step: 1
      }, () => {
        this.initData();
      })
    }
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
    const {step} = this.state;
    if (step === 1) {
      this.step1();
    }
    if (step === 2) {
      this.step2();
    }
  }
  step1() {
    const {submitParams} = this.state;
    this.dispatch({
      type: `${namespace}/checkPasswordCode`,
      payload: {
        phone: submitParams.phone,
        code: submitParams.code
      }
    }).then((res) => {
      const token = deepGet(res, 'payload.data.token');
      if (token) {
        Router.push(`/findPw/${token}`);
      } else {
        Toast.info('发生未知错误，请联系客服');
      }
    })
  }
  step2() {
    const {token, submitParams} = this.state;
    this.dispatch({
      type: `${namespace}/reSetPassword`,
      payload: {
        password: submitParams.password,
        token
      }
    }).then((res) => {
      Toast.success('密码重置成功，请记住您的密码！', 2);
      setTimeout(() => {
        Router.replace('/login');
      }, 2000);
    });
  }
  /**
     * @description 获取验证码
     */
  getCode(fun = null) {
    const {submitParams} = this.state;
    this.dispatch({
      type: `${namespace}/smsForgotPassword`,
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
    const {step} = this.state;
    if (step === 1) {
      const submitParams = {
        phone: '',
        code: ''
      }
      this.setState({
        submitParams,
        isInited: true
      }, () => {
        this.validInput('', 'phone');
        this.validInput('', 'code');
      });
    }
    if (step === 2) {
      const submitParams = {
        password: ''
      }
      this.setState({
        submitParams,
        isInited: true
      }, () => {
        this.validInput('', 'password');
      });
    }
  }

  render() {
    const {phoneIsRight, codeIsRight, passwordIsRight, isInited, submitParams, step} = this.state;
    if (step === 1) {
      this.btnActive = !!phoneIsRight && !!codeIsRight;
    }
    if (step === 2) {
      this.btnActive = !!passwordIsRight;
    }
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
          {step === 1 && <React.Fragment>
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
                <GetCode disabled={!phoneIsRight || this.props.loading.effects['main/smsForgotPassword']} doFetch={this.getCode} countTime={false}></GetCode>
              </div>
            </div>
          </React.Fragment>}
          {step === 2 && <Inputx
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
          />}
          <div style={{paddingTop: '50px'}}><Button loading={this.props.loading.effects['main/checkPasswordCode'] || this.props.loading.effects['main/reSetPassword']} type="primary" disabled={!this.btnActive} onClick={this.handleSubmit}>提交</Button></div>
        </div>
      </React.Fragment>
    );
  }
}

export default index;
