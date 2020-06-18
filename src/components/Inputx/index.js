/*
 * @Date: 2020-06-05 16:16:37
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-15 18:38:48
 */ 
import React, {Component} from 'react';
import {Input, BizIcon} from '../';
import styles from './index.less';

class index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.defaultValue || '',
      focus: false,
      errorTip: '',
      isShowPassword: false
    };
    this.submitParams = {
      Name: ''
    }
    this.handleMockInputFocus = this.handleMockInputFocus.bind(this);
    this.handleMockInputBlur = this.handleMockInputBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.clearInput = this.clearInput.bind(this);
    this.showPassword = this.showPassword.bind(this);
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
  showPassword() {
    const {isShowPassword} = this.state;
    this.setState({
      isShowPassword: !isShowPassword
    })
  }
  render() {
    const {mockInput, label, placeholder, tail, inputTip, theme, inputType} = this.props;
    const {value, focus, errorTip, isShowPassword} = this.state;
    const inputData = {
      disabled: this.props.disabled,
      value,
      active: focus,
      placeholder,
      type: 'number',
      noLabel: true
    };
    if (theme === 'line') {
      return (
        <div className={styles.inputxWp_line}>
          <div className={`${styles.inputxLabel} ${focus ? styles.focus : errorTip ? styles.error : null}`}>
            {value && <React.Fragment>{focus || !errorTip ? label : errorTip ? errorTip : inputTip}</React.Fragment>}
          </div>  
          <div className={styles.inputxBody}>
            <div className={styles.inputxInput}>
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
                  : <input type={inputType === 'password' ? isShowPassword ? 'text' : 'password' : 'text'} className={`${styles.formInput} ${styles.originInput}  ${inputType === 'password' && styles.password}`} maxLength={this.props.maxlength} placeholder={placeholder} value={value} onChange={this.handleChange} onFocus={this.handleFocus} onBlur={this.handleBlur} disabled={!!this.props.disabled} />
              }
              <div className={styles.tailCtr}>
                {value && !this.props.disabled && <span className={styles.clear} onClick={this.clearInput}>
                  <BizIcon type="clear"></BizIcon>
                </span>}
                {inputType === 'password' && <span className={styles.eye} onClick={this.showPassword}>
                  <BizIcon type={isShowPassword ? 'eye' : 'eyeblind'}></BizIcon>
                </span>}
              </div>
            </div>
            {tail && <div className={styles.inputxTail}> 
              {tail}
            </div>}
          </div>
          {/* <div className={`${styles.inputxFooter} ${focus ? styles.focus : errorTip ? styles.error : null}`} >{!focus && errorTip ? errorTip : inputTip}</div> */}
        </div>
      );
    }
    if (theme === 'bar') {
      return (
        <div className={styles.inputxWp_bar}>
          <div className={`${styles.inputxBody} ${focus ? styles.focus : errorTip ? styles.error : null}`}>
            <div className={styles.inputxLabel}>{label}</div>  
            <div className={styles.inputxInput}>
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
                  : <input className={`${styles.formInput} ${styles.originInput}`} maxLength={this.props.maxlength} placeholder={placeholder} value={value} onChange={this.handleChange} onFocus={this.handleFocus} onBlur={this.handleBlur} disabled={!!this.props.disabled} />
              }
              {value && !this.props.disabled && <span className={styles.clear} onClick={this.clearInput}>
                <BizIcon type="clear"></BizIcon>
              </span>}
            </div>
            {tail && <div className={styles.inputxTail}> 
              {tail}
            </div>}
          </div>
        </div>
      );
    }
    return (
      <div className={styles.inputxWp}>
        <div className={styles.inputxBody}>
          <div className={styles.inputxLabel}>{label}</div>  
          <div className={styles.inputxInput}>
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
                : <input type={inputType === 'password' ? isShowPassword ? 'text' : 'password' : 'text'} className={`${styles.formInput} ${styles.originInput} ${inputType === 'password' && styles.password}`} maxLength={this.props.maxlength} placeholder={placeholder} value={value} onChange={this.handleChange} onFocus={this.handleFocus} onBlur={this.handleBlur} disabled={!!this.props.disabled} />
            }
            <div className={styles.tailCtr}>
              {value && !this.props.disabled && <span className={styles.clear} onClick={this.clearInput}>
                <BizIcon type="clear"></BizIcon>
              </span>}
              {inputType === 'password' && <span className={styles.eye} onClick={this.showPassword}>
                <BizIcon type={isShowPassword ? 'eye' : 'eyeblind'}></BizIcon>
              </span>}
            </div>
          </div>
          {tail && <div className={styles.inputxTail}> 
            {tail}
          </div>}
        </div>
        <div className={`${styles.inputxFooter} ${focus ? styles.focus : errorTip ? styles.error : null}`} >{!focus && errorTip ? errorTip : inputTip}</div>
      </div>
    );
  }
}

export default index;