/*
 * 模拟输入框
 * @Date: 2020-06-05 11:22:32
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-05 16:04:12
 */ 
import React, {Component} from 'react';
import './index.less';

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
  }

  componentDidMount() {
    const _this = this;
    const {defaultFocus} = this.props;
    if (defaultFocus) {
      setTimeout(() => {
        _this.handleFocus();
      }, 300);
    }
  }

  handleFocus() {
    if (!this.props.data.disabled) {
      this.props.handleInputFocus(this.props.data.value);
    }
  }

  render() {
    const {data} = this.props;
    let cursor = null;
    let placehodler = null;
    if (!data.disabled) {
      if (data.active) {
        cursor = <span className="cursor" />;
      }
      if (!!data.placeholder && !data.value) {
        placehodler = <span className="placeholder">{data.placeholder}</span>;
      }
    }

    return (
      <div className="form-control" onClick={() => {
        if (!data.disabled) {
          this.handleFocus();
        }
      }}>
        <p className={`input ${data.disabled ? 'disabled' : 'normal'} ${placehodler ? 'placehodler' : ''}`}>
          {data.value}
          {cursor}
          {placehodler}
        </p>
      </div>
    );
  }
}

export default Input;
