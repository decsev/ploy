import React from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import {Navigation, MyGap} from 'components';
import {deepClone, deepGet} from 'utils';
import {Button, Modal, Toast, NavBar, Tabs} from 'antd-mobile';

const {alert} = Modal;
const namespace = 'data';
@connect(({data, loading}) => ({
  data,
  loading
}))
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gaplistData: null,
      isApp: false
    };
    this.dispatch = this.props.dispatch;
  }
  componentDidMount() {
    const {tool} = this.props;
    const {gaplist} = tool;
    if (!gaplist) {
      this.fetchGaplist(1);
    }
    this.times = setInterval(() => {
      this.fetchGaplist();
    }, 1000 * 3);
  }
  componentWillUnmount() {
    this.times && clearInterval(this.times);
  }
  componentDidUpdate() {}
  fetchGaplist(showloading) {
    if (showloading) {
      Toast.loading('玩命加载中', 0, null);
    }
    this.dispatch({
      type: `${namespace}/gaplist`,
      payload: {}
    }).then(data => {
      if (showloading) {
        Toast.hide();
      }
    }).catch(err => {
      if (showloading) {
        Toast.hide();
      }
    });
  }
  go(url) {
    const reg = /^(http:\/\/|https:\/\/).*$/g;
    if (url === '') {
      return;
    }
    if (reg.test(url)) {
      window.location.href = url;
      return false;
    }
    router.push(url);
  }
  formateGaplistData(obj) {
    let arr = [];
    Object.keys(obj).forEach(key => {
      arr.push({key, data: obj[key]});
    });
    return arr;
  }
  changeEx(ex) {
    this.dispatch({
      type: `${namespace}/updateState`,
      payload: {
        selectedEx: ex
      }
    });
    this.fetchGaplist();
  }
  // renderSub(data) {
  //   let arr = [];
  //   let i = -1;
  //   (data || []).forEach((item, index) => {
  //     // console.log('item', item, index);
  //     if (index % 3 === 0) {
  //       i++;
  //       arr[i] = [];
  //     }
  //     arr[i].push(item);
  //   })
  //   let result = (arr || []).map((item, index) => {
  //     return <dl key={'dl' + index}>
  //       {(item || []).map((o, i) => {
  //         return <dd key={i}>
  //           <span className="gapVal" style={{ color: `rgba(0, 97, 200,${o.colorFlag})` }}>{o.val}</span>
  //           <p>{o.key}</p>
  //         </dd>
  //       })}
  //     </dl>
  //   })
  //   return result;
  // }
  renderContent(tab, data, ex) {
    return (
      <MyGap
        key={tab.title}
        isApp={this.state.isApp}
        gaplistData={data}
        ex={ex}
        symbol={tab.title}
      ></MyGap>
    );
  }

  render() {
    const {tool, inTab} = this.props;
    const {exList, selectedEx, symbols, gaplist} = tool;
    if (!gaplist) {return null;}
    let gaplistData = this.formateGaplistData(gaplist || []);
    let tabs = (symbols || []).map(item => {
      return {title: item.toUpperCase()};
    });
    return (
      <div className={`page-container ${!inTab ? 'page-tool-index' : ''}`}>
        <div className="page-innerContainer page-gap-innerContainer">
          <div className="gapExOption">
            {(exList || []).map((item, index) => {
              if (item === selectedEx) {
                return (
                  <span key={index} className="gapExSelected">
                    {item}
                  </span>
                );
              } 
              return (
                <span
                  key={index}
                  onClick={() => {
                    this.changeEx(item);
                  }}
                >
                  {item}
                </span>
              );
              
            })}
          </div>
          <div className={`${!inTab ? 'scroll-container' : ''}`}>
            <Tabs tabs={tabs} renderTabBar={props => <Tabs.DefaultTabBar {...props} page={6} />}>
              {o => {
                return this.renderContent(o, gaplistData, selectedEx);
              }}
            </Tabs>
          </div>
          {!inTab && <Navigation current={4}></Navigation>}
        </div>
      </div>
    );
  }
}

export default Index;
