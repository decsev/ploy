/*
 * @Date: 2020-06-08 10:13:46
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-10 16:49:56
 */ 
import React, {PureComponent, Component} from 'react';
import {Picker} from 'antd-mobile';
import {BizIcon} from 'components';
import styles from './index.less'

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.defaultValue || ''
    };
    this.handleOk = this.handleOk.bind(this);
    this.clearInput = this.clearInput.bind(this);
  }
  handleOk(e) {
    console.log('e111', e);
    if (e.length === 1) {
      this.setState({
        value: e[0]
      })
      this.props.validInput(e[0], this.props.id)
    }
  }
  clearInput() {
    this.setState({
      value: ''
    });
    this.props.validInput('', this.props.id)
  }
  render() {
    const {label, disabled, placeholder, theme} = this.props;
    const {value} = this.state;
    let SelectxChildren = props => {
      return (
        <div onClick={props.onClick}>
          <p className={`${styles.input} ${disabled ? styles.disabled : styles.normal} ${!value && placeholder ? styles.placeholder : null}`}>{value || placeholder}</p>
          <span className={styles.pickerIcon}><BizIcon type="down"></BizIcon></span>
        </div>
      )
    };
    if (theme === 'line') {
      return (
        <div className={styles.selectxWp_line}>
          <div className={styles.selectxLabel}>
            {value && <React.Fragment>{label}</React.Fragment>}
          </div>
          <div className={styles.selectxMain}>
            <Picker
              title={null}
              extra={this.props.extra}
              cols={1}
              data={this.props.options}
              value={[this.state.value]}
              onOk={this.handleOk}
              disabled={this.props.disabled}
            >
              <SelectxChildren></SelectxChildren>
            </Picker>
            {value && !this.props.disabled && <span className={styles.clear} onClick={this.clearInput}>
              <BizIcon type="clear"></BizIcon>
            </span>}
          </div>
        </div>
      );
    }
    return (
      <div className={styles.selectxWp}>
        <div className={styles.selectxBody}>
          <div className={styles.selectxLabel}>
            {label}
          </div>
          <div className={styles.selectxMain}>
            <Picker
              title={null}
              extra={this.props.extra}
              cols={1}
              data={this.props.options}
              value={[this.state.value]}
              onOk={this.handleOk}
              disabled={this.props.disabled}
            >
              <SelectxChildren></SelectxChildren>
            </Picker>
            {value && !this.props.disabled && <span className={styles.clear} onClick={this.clearInput}>
              <BizIcon type="clear"></BizIcon>
            </span>}
          </div>
        </div>
      </div>
    );
  }
}

export default index;