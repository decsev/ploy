/*
 * @Date: 2020-06-02 17:45:33
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-18 18:25:12
 */ 
/*global someFunction ENV:true log:true*/
/*eslint no-undef: "error"*/
import React, {PureComponent} from 'react';
import {Button, Toast} from 'antd-mobile';
import {Input, Inputx, Selectx, NavBar} from 'components';
import {trim} from 'utils';
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
class index extends React.Component {
  constructor(props) {
    super(props);
    this.accountInfo = {
      name: '志良',
      phone: '13538831277',
      exchange: ''
    };
    this.state = {
      passwordIsRight: !!this.accountInfo.password,
      phoneIsRight: !!this.accountInfo.phone,
      codeIsRight: !!this.accountInfo.code
    }
    this.submitParams = {
      Password: this.accountInfo.password || '',
      Phone: this.accountInfo.phone || '',
      Code: this.accountInfo.code || ''
    }
    this.validInput = this.validInput.bind(this);
    this.formatInput = this.formatInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getCode = this.getCode.bind(this);
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
      phone: 'Phone',
      code: 'Code',
      password: 'Password'
    };
    this.submitParams[valNameTypeMap[type]] = value.replace(/\s/g, '');
  }
  handleSubmit() {
    if (!this.btnActive) {return;}
    // to do ajax
    log('提交的参数', this.submitParams)
  }
  getCode() {
    log('获取验证码')
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
    const {phoneIsRight, codeIsRight, passwordIsRight} = this.state;
    this.btnActive = phoneIsRight && codeIsRight && passwordIsRight;
    let theme = 'line'; // 主题line, 'bar'
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
            defaultValue={defaultValue && defaultValue.phone}
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
                defaultValue={defaultValue && defaultValue.code}
                disabled={false}
              />
            </div>
            <div className={styles.right}>
              <Button type="ghost" onClick={this.getCode}>发送验证码</Button>
            </div>
          </div>
          <Inputx
            theme={theme}
            id="password"
            label="设置新密码"
            inputTip="密码须同时包含字母和数字，长度为6-20位"
            placeholder="密码须同时包含字母和数字，长度为6-20位"
            validInput={this.validInput}
            formatInput={this.formatInput}
            defaultValue={defaultValue && defaultValue.password}
            disabled={false}
            inputType="password"
          />
          <div style={{paddingTop: '50px'}}><Button type="primary" disabled={!this.btnActive} onClick={this.handleSubmit}>提交</Button></div>
        </div>
      </React.Fragment>
    );
  }
}

export default index;
