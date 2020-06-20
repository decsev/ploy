/*
 * @Date: 2020-06-20 10:43:57
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-20 12:04:18
 */ 
/*global someFunction ENV:true log:true Swiper:true*/
/*eslint no-undef: "error"*/
import React, {PureComponent} from 'react';
import router from 'umi/router';
import {BizIcon} from 'components';
import styles from './index.less';
import {config} from 'utils';
const {APIV1} = config;

class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const {swiperPro} = this.props;
    const myswiper = new Swiper('.swiper-container', {
      pagination: { 
        el: '.swiper-pagination'
      },
      ...swiperPro
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
  doGo(url) {
    let {isApp} = this.props;
    if (isApp) {
      this.go(`${APIV1}/m/#${url}`);
    } else {
      this.go(url);
    }
  }
  render() {
    const {swiperSlides, bannerData} = this.props;
    let swiperSlidesHtml;
    if (swiperSlides) {
      swiperSlidesHtml = swiperSlides.map((item, index) => {
        return (
          <div key={index} className="swiper-slide">
            {item.img && 
              <img
                src={item.img}
                className="swiper-img"
                onClick={() => {
                  this.go(item.url);
                }}
              />
            }
          </div>
        );
      });
    }
    if (bannerData) {
      swiperSlidesHtml = bannerData.map((item, index) => {
        return (
          <div key={index} className="swiper-slide">
            <dl>
              {item.map(item => {
                return (
                  <dd
                    key={item.k}
                    onClick={() => {
                      this.doGo(`/kline/${item.k.replace('/', '_')}`);
                    }}
                  >
                    <span className={`iconfont ${item.icon}`}></span>
                    <h5>{item.k}</h5>
                    <p className={Number(item.r) >= 0 ? 'up' : 'down'}>{item.v}</p>
                  </dd>
                );
              })}
            </dl>
          </div>
        );
      });
    }
    return (
      // < !--Slider main container-- >
      <div className={this.props.containerClassName}>
        <div className="swiper-container">
          <div className="swiper-wrapper">{swiperSlidesHtml}</div>
          {!!this.props.needPagination && <div className="swiper-pagination"></div>}
        </div>
      </div>
    );
  }
}

export default Index;
