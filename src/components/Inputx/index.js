/*
 * @Date: 2020-06-05 16:16:37
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-05 17:14:27
 */ 
import React, {Component} from 'react';
import {Input, BizIcon} from '../';
import './index.less';

class index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.defaultValue || '',
      focus: false,
      errorTip: ''
    };
    this.handleMockInputFocus = this.handleMockInputFocus.bind(this);
    this.handleMockInputBlur = this.handleMockInputBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.clearInput = this.clearInput.bind(this);
  }
  handleChange(e) {
    let val = e;
    // 模拟input触发的change和手动调用的handleChange的参数为字符串，react input触发的change参数为事件对象
    if (typeof e !== 'string') {
      val = e.target.value;
    }
    const newVal = this.props.formatInput(val, this.props.id);
    // 输入内容校验的时机，默认是onChange
    if (this.props.validInputTime !== 'blur') {
      const validResultObj = this.props.validInput(val, this.props.id);
      if (validResultObj.errorTipIsPromise) {
        validResultObj.errorTip.then((errorTip) => {
          this.setState({
            value: newVal,
            errorTip
          });
        });
      } else {
        this.setState({
          value: newVal,
          errorTip: validResultObj.errorTip
        });
      }
    } else {
      this.setState({
        value: newVal
      });
    }
  }
  handleFocus() {
    this.setState({
      focus: true
    });
  }
  handleBlur(e) {
    this.setState({
      focus: false
    });
    // 只有设置的校验时机是blur的时候（银行卡设置的是blur）才有必要进行校验（默认是边输边校验）
    if (this.props.validInputTime !== 'blur' || typeof e === 'undefined') {return;}
    const val = e.target.value;
    const validResultObj = this.props.validInput(val, this.props.id);
    if (validResultObj.errorTipIsPromise) {
      validResultObj.errorTip.then((errorTip) => {
        this.setState({
          errorTip
        });
      });
    } else {
      this.setState({
        errorTip: validResultObj.errorTip
      });
    }
  }
  clearInput() {
    this.setState({
      value: ''
    });
    this.props.setInputBoxVal && this.props.setInputBoxVal('');
    this.handleChange('');
  }
  handleMockInputFocus() {
    this.handleFocus();
    this.props.openBox(this.state.value.replace(/\s/g, ''));
  }
  handleMockInputBlur() {
    this.setState({
      focus: false
    });
  }
  render() {
    const {mockInput, inputTip, placeholder, tail} = this.props;
    const {value, focus, errorTip} = this.state;
    const inputData = {
      disabled: this.props.disabled,
      value,
      active: focus,
      placeholder,
      type: 'number',
      noLabel: true
    };
    return (
      <div className="input-com">
        <div>
          <div className="form-label">{inputTip}</div>  
          <div className="form-label-input">
            {
              mockInput
                ?
                <div>
                  <Input
                    data={inputData}
                    handleInputFocus={this.handleMockInputFocus}
                    handleInputDelete={this.handleInputDelete}
                    defaultFocus={false}
                  />
                </div>
                : <input className="form-input origin-input" maxLength={this.props.maxlength} placeholder={placeholder} value={value} onChange={this.handleChange} onFocus={this.handleFocus} onBlur={this.handleBlur} disabled={!!this.props.disabled} />
            }
            <span className="icon-clear" onClick={this.clearInput}>
              <BizIcon type="user"></BizIcon>
            </span>
          </div>
          <div className="form-tail">
            {tail ? <span>{tail}</span> : null}
          </div>
        </div>
        <div className={`form-tip ${value ? 'show' : ''} ${focus ? ' focus' : errorTip ? ' error' : ''}`} >{!focus && errorTip ? errorTip : inputTip}</div>
      </div>
    );
  }
}

export default index;