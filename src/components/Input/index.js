/*
 * 模拟输入框
 * @Date: 2020-06-05 11:22:32
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-08 16:55:21
 */ 
import React, {Component} from 'react';
import styles from './index.less';

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
        cursor = <span className={styles.cursor} />;
      }
      if (!!data.placeholder && !data.value) {
        placehodler = <span className={styles.placeholder}>{data.placeholder}</span>;
      }
    }

    return (
      <div className={styles.formControl} onClick={() => {
        if (!data.disabled) {
          this.handleFocus();
        }
      }}>
        <p className={`${styles.input} ${data.disabled ? styles.disabled : styles.normal} ${placehodler ? styles.placehodler : null}`}>
          {data.value}
          {cursor}
          {placehodler}
        </p>
      </div>
    );
  }
}

export default Input;
