/*
 * @Date: 2020-06-18 17:25:17
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-18 18:34:22
 */ 
import React from 'react';
import styles from './index.less';
import {config} from 'utils';
import {Toast} from 'antd-mobile';
const {APIV1} = config;

class index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    Toast.loading('加载中', 0, null, true);
    let disabled_features = [
      'header_compare',
      'header_undo_redo',
      'header_screenshot',
      'header_saveload',
      'create_volume_indicator_by_default'
    ];
    if (this.props.disabled_features) {
      disabled_features = this.props.disabled_features;
    }
    let span = 3;
    const widgetOptions = {
      fullscreen: true,
      symbol: this.props.symbol,
      interval: this.props.interval,
      container_id: this.props.containerId,
      datafeed: new window.Datafeeds.UDFCompatibleDatafeed(APIV1 + '/api/ftv', 1000 * span),
      library_path:
        window.location.hostname === 'localhost'
          ? '/tv/charting_library/'
          : APIV1 + '/m/tv/charting_library/',
      timezone: 'Asia/Shanghai',
      locale: 'zh',
      theme: 'Dark',
      preset: '',
      enabled_features: [
        'keep_left_toolbar_visible_on_small_screens',
        'hide_left_toolbar_by_default'
      ],
      disabled_features: disabled_features,
      charts_storage_url: 'https://saveload.tradingview.com',
      charts_storage_api_version: '1.1',
      client_id: 'tradingview.com',
      user_id: ''
    };
    this.tvWidget = new window.TradingView.widget(widgetOptions);
    this.tvWidget.onChartReady(() => {
      Toast.hide();
    });
  }
  componentWillUnmount() {
    try {
      this.tvWidget.remove();
    } catch (err) {
      Toast.info(err, 2, null, false);
    }
  }
  render() {
    return (
      <div>
        {/* <span onClick={() => {
          window.location.reload()
        }}>刷新</span> */}
        <div id={this.props.containerId} className={styles.tvContainer} />
      </div>
    );
  }
}

export default index;
