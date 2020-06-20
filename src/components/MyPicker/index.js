/*
 * @Date: 2020-06-20 14:46:25
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-20 15:33:35
 */ 
import React, {PureComponent} from 'react';
import router from 'umi/router';
import {Picker} from 'antd-mobile';
import './index.less';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pickerValue: this.props.value
    };
  }
  componentDidMount() {
    // this.setState({ pickerValue: this.props.v });
  }
  handleChange(v) {
    this.setState({pickerValue: v});
  }
  handleOk(v) {
    const {onOk} = this.props;
    this.setState({pickerValue: v});
    onOk(v);
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.value[0] !== nextProps.value[0]) {
      return true;
    }
    return false;
  }
  render() {
    let CustomChildren = props => {
      return (
        <div onClick={props.onClick} className="mypicker-container">
          <div className="item item1">{props.children}</div>
          <div className="item item2">{props.extra}</div>
          <i className="item item3 iconfont icon-downSmall"></i>
        </div>
      )
    };
    if (this.props.CustomChildren) {
      CustomChildren = this.props.CustomChildren;
    }
    return (
      <div className="mypicker-wp">
        <Picker
          title={this.props.title}
          extra={this.props.extra}
          cols={this.props.cols}
          data={this.props.data}
          value={this.state.pickerValue}
          onChange={(v) => {this.handleChange(v)}}
          onOk={(v) => {this.handleOk(v)}}
        >
          <CustomChildren></CustomChildren>
        </Picker>
      </div>
    );
  }
}

export default Index;