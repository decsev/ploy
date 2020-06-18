/*
 * @Date: 2020-06-09 19:20:32
 * @LastEditors: lianggua
 * @LastEditTime: 2020-06-09 19:26:40
 */ 
import React, {PureComponent} from 'react';
import Router from 'umi/router';
import {NavBar} from 'components';
import styles from './index.less';

class about extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { };
  }
  render() {
    return (
      <React.Fragment>
        <NavBar
          icon="back"
          onLeftClick={() => {
            Router.goBack();       
          }}
        >
          关于我们
        </NavBar>
        <div className={styles.about}>
          <p>我们的团队</p>
          <p>美国Georgia State University金融学博士、清华大学数学系硕士、山东大学密码学硕士、中山大学等顶尖人才，原PPmoney证券事业部、招商证券量化研发团队，美国顶尖私立研究大学Lehigh University金融学院教授、原CapitalOne高层担任金融和技术顾问。 专注于宏观分析、微观行情大数据分析、金融衍生品风险对冲风险管理、程序化交易、高频量化交易、无风险套利、对冲基金、区块链底层技术及应用等方向的探索与研究。
关注我们</p>
          <p>我们旨在打造领先的区块大数据和数字资产量化交易工具平台， 我们基于大数据和人工智能技术，给您带来上帝视角，把握数字资产世界的脉搏，帮助您决胜于千里之外。</p>
          <p>欢迎您与我们同行，一起同创、共享、共赢。</p>
        </div>
      </React.Fragment>
    );
  }
}

export default about;