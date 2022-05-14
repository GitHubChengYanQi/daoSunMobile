import React, { useEffect, useState } from 'react';
import style from './index.less';
import { Card, Grid } from 'antd-mobile';
import { MoreOutline, SetOutline } from 'antd-mobile-icons';
import DataShow from './component/DatsShow';
import { Avatar, Badge } from 'antd';
import Menus from './component/Menus';
import { useModel } from 'umi';
import { connect } from 'dva';
import DefaultMenus from './component/DefaultMenus';

const Home = (props) => {

  const { initialState } = useModel('@@initialState');

  const state = initialState || {};

  const userInfo = state.userInfo || {};

  const userMenus = props.data && props.data.userMenus;

  const sysMenus = userInfo.menus || [];

  const [commonlyMenus, setCommonlyMenus] = useState([]);

  useEffect(() => {
    setCommonlyMenus(DefaultMenus({ userMenus, sysMenus }));
  }, [userMenus]);

  useEffect(() => {
    if (!userMenus) {
      props.dispatch({
        type: 'data/getUserMenus',
      });
    }
    window.document.title = '首页';
  }, []);


  return <div className={style.home}>
    <div className={style.enterprise}>
      <div className={style.enterpriseLeft}>
        <div className={style.logo}>
          {state.homeLogo && <img src={state.homeLogo} width={46} height={46} alt='' />}
        </div>
        <div className={style.enterpriseTitle}>
        <span className={style.enterpriseName}>
          {state.enterpriseName || '企业名称'}
        </span>
          <span className={style.enterpriseDescribe}>
          因为信任，所以简单
       </span>
        </div>
      </div>
      <div>
        <Avatar
          style={{ backgroundColor: '#98BFEB' }}
          size={46}
          src={userInfo.avatar}>{userInfo.name && userInfo.name.substring(0, 1)}</Avatar>
      </div>
    </div>
    <Card
      className={style.dataCard}
      title={<div className={style.cardTitle}>资产状况数据看板</div>}
      extra={<SetOutline style={{ color: '#257BDE', fontSize: 16 }} />}
      bodyClassName={style.cardBody}
      headerClassName={style.cardHeader}
    >
      <div className={style.dataShowLeft}>
        <span>总资产：<span className={style.red}>￥1023200.00</span></span>
        <Badge color='#F04864' text={<span className={style.dataValue}><span>账户余额</span><span
          className={style.fontSize12}>￥7256.36</span></span>} />
        <Badge color='#1890FF' text={<span className={style.dataValue}><span>库存总额</span><span
          className={style.fontSize12}>￥3536.66</span></span>} />
        <Badge color='#13C2C2' text={<span className={style.dataValue}><span>固定资产</span><span
          className={style.fontSize12}>￥5000.00</span></span>} />
        <Badge color='#FACC14' text={<span className={style.dataValue}><span>应付欠款</span><span
          className={style.fontSize12}>￥8565.78</span></span>} />
        <MoreOutline className={style.allData} />
      </div>
      <div className={style.dataShowRight}>
        <DataShow />
      </div>
    </Card>
    <Card
      className={style.dataCard}
      style={{ marginBottom: 0 }}
      title={<div className={style.cardTitle}>常用功能</div>}
      bodyClassName={style.manuCardBody}
      headerClassName={style.cardHeader}
    >
      <Grid columns={3} gap={0}>
        {
          commonlyMenus.map((item, index) => {
            return <Grid.Item className={style.menus} key={index}>
              <Menus textOverflow={80} code={item.code} name={item.name} fontSize={50} />
            </Grid.Item>;
          })
        }
        <Grid.Item className={style.menus}>
          <Menus fontSize={50} />
        </Grid.Item>
      </Grid>
    </Card>
    <div style={{ height: 16 }} />
  </div>;
};

export default connect(({ data }) => ({ data }))(Home);
