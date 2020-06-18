/*
 * @Date: 2020-06-10 15:14:18
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-15 18:36:10
 */ 
/*global someFunction ENV:true log:true*/
/*eslint no-undef: "error"*/

import React, {PureComponent} from 'react';
import {connect} from 'dva';
import Router from 'umi/router';
import {trim, isEmpty} from 'utils';
import {NavBar, Inputx} from 'components';
import {Toast, Button} from 'antd-mobile';
import styles from './index.less';
const utils = {
  validPassword(value) {
    if (!/^(?=.*[0-9])(?=.*[a-zA-Z])(.{6,20})$/.test(value)) {
      return '密码须同时包含字母和数字，长度为6-20位'
    }
    return '';
  },
  formatPassword(val) {
    const newVal = val.Trim();
    return newVal;
  }
}
const namespace = 'user';
@connect(({user, loading}) => ({
  user,
  loading
}))
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      oldPasswordIsRight: false,
      newPasswordIsRight: false,
      repeatNewPasswordIsRight: false,
      formData: null
    };
    this.submitParams = {
      old_password: '',
      new_password: '',
      repeact_new_password: ''
    }
    this.dispatch = this.props.dispatch;
    this.validInput = this.validInput.bind(this);
    this.formatInput = this.formatInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
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
        case 'oldPassword':case 'newPassword':case 'repeatNewPassword': 
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
      case 'oldPassword':case 'newPassword':case 'repeatNewPassword': 
        val = utils.formatPassword(value);
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
      oldPassword: 'old_password',
      newPassword: 'new_password',
      repeatNewPassword: 'repeact_new_password'
    };
    this.submitParams[valNameTypeMap[type]] = value.replace(/\s/g, '');
  }
  handleSubmit() {
    if (!this.btnActive) {return;}
    // to do ajax
    log('提交的参数', this.submitParams);
    const {old_password, new_password, repeact_new_password} = this.submitParams;
    if (new_password !== repeact_new_password) {
      Toast.info('两次输入的新密码不一致');
      return;
    }

    if (old_password === new_password) {
      Toast.info('新密码不能跟旧密码一样');
      return;
    }

    this.dispatch({
      type: `${namespace}/changePassword`,
      payload: {
        old_password,
        new_password
      }
    }).then((res) => {
      Toast.success('密码修改成功，请记住您的密码！', 3);
      setTimeout(() => {
        Router.push('/user');
      }, 3000);
    })
  }

  render() {
    const {formData, oldPasswordIsRight, newPasswordIsRight, repeatNewPasswordIsRight} = this.state;

    this.btnActive = !!oldPasswordIsRight && !!newPasswordIsRight && !!repeatNewPasswordIsRight;
    const theme = 'line';
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
            id="oldPassword"
            label="旧密码"
            inputTip="输入旧密码"
            placeholder="输入旧密码"
            validInput={this.validInput}
            formatInput={this.formatInput}
            defaultValue={formData && formData.oldPassword}
            disabled={false}
            inputType="password"
          />
          <Inputx
            theme={theme}
            id="newPassword"
            label="新密码"
            inputTip="密码须同时包含字母和数字，长度为6-20位"
            placeholder="输入新密码"
            validInput={this.validInput}
            formatInput={this.formatInput}
            defaultValue={formData && formData.newPassword}
            disabled={false}
            inputType="password"
          />
          <Inputx
            theme={theme}
            id="repeatNewPassword"
            label="重复新密码"
            inputTip="须跟新密码一样"
            placeholder="重复输入新密码"
            validInput={this.validInput}
            formatInput={this.formatInput}
            defaultValue={formData && formData.repeatNewPassword}
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