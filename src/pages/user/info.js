/*
 * @Date: 2020-06-10 15:14:18
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-16 18:15:34
 */ 
/*global someFunction ENV:true log:true*/
/*eslint no-undef: "error"*/

import React, {PureComponent} from 'react';
import {connect} from 'dva';
import Router from 'umi/router';
import {trim, isEmpty} from 'utils';
import {NavBar, Inputx} from 'components';
import {Toast} from 'antd-mobile';
import styles from './index.less';
const utils = {
  validNickName(name) {
    if (!/^[0-9a-zA-Z\u4e00-\u9fa5_\s]{1,6}$/.test(name)) {
      return '昵称长度要求1-6位';
    }
  },
  formatNickName(val) {
    const newVal = val.Trim();
    return newVal.replace(/^(([0-9a-zA-Z\u4e00-\u9fa5_\s]{1,160})|(.*))(.*)$/, '$2');
  }
}
const namespace = 'user';
@connect(({user, loading}) => ({
  user,
  loading
}))
class info extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      nickNameIsRight: false,
      formData: null,
      isInited: false
    };
    this.submitParams = {
      nickname: '',
      wechat: ''
    }
    this.dispatch = this.props.dispatch;
    this.validInput = this.validInput.bind(this);
    this.formatInput = this.formatInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.initData = this.initData.bind(this);
    this.fetchInfo = this.fetchInfo.bind(this);
  }
  componentDidMount() {
    const {user} = this.props;
    const {userInfo} = user;
    if (isEmpty(userInfo)) {
      this.fetchInfo();
    } else {
      this.initData();
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
        case 'nickName':
          errorMsg = utils.validNickName(value);
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
      case 'nickName':
        val = utils.formatNickName(value);
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
      nickName: 'nickname',
      wx: 'wechat'
    };
    this.submitParams[valNameTypeMap[type]] = value.replace(/\s/g, '');
  }
  handleSubmit() {
    if (!this.btnActive) {return;}
    // to do ajax
    log('提交的参数', this.submitParams)
    this.dispatch({
      type: `${namespace}/changeInfo`,
      payload: {
        ...this.submitParams
      }
    }).then((data) => {
      Toast.success('修改成功', 2);
      setTimeout(() => {
        Router.push('/user');
      }, 2000);
    });
  }
  fetchInfo() {
    this.dispatch({
      type: `${namespace}/info`,
      payload: {}
    }).then(() => {
      this.initData();
    })
  }
  initData() {
    const {user} = this.props;
    const {userInfo} = user;
    const {nickname, wechat} = userInfo;
    const formData = {
      nickName: nickname,
      wx: wechat
    }
    this.setState({
      formData,
      isInited: true
    }, () => {
      this.validInput(nickname, 'nickName');
      this.validInput(wechat, 'wx');
    });
    
  }
  render() {
    const {formData, nickNameIsRight, isInited} = this.state;

    this.btnActive = !!nickNameIsRight;
    const saveButton = <span onClick={this.handleSubmit} className={`${styles.saveInfo} ${this.btnActive ? null : styles.disabled}`}>保存</span>;
    const theme = 'bar';
    if (!isInited) {
      return null;
    }
    return (
      <React.Fragment>
        <NavBar
          icon="back"
          leftContent={null}
          rightContent={saveButton}
        >{this.props.route.title}</NavBar>
        <div className={styles.infoWp}>
          <div className={styles.infoLogo}>
            <img src="/image/logo.png"></img>
          </div>
          <Inputx
            theme={theme}
            id="nickName"
            label="昵称"
            inputTip=""
            placeholder="输入1-6位昵称"
            validInput={this.validInput}
            formatInput={this.formatInput}
            defaultValue={formData && formData.nickName}
            disabled={false}
          />
          <Inputx
            theme={theme}
            id="wx"
            label="微信"
            inputTip=""
            placeholder="输入微信号"
            validInput={this.validInput}
            formatInput={this.formatInput}
            defaultValue={formData && formData.wx}
            disabled={false}
          />
        </div> 
      </React.Fragment>
    );
  }
}

export default info;