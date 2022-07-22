import React, { useEffect, useState } from 'react';
import style from './index.less';
import { Card, Grid, Swiper } from 'antd-mobile';
import { SetOutline } from 'antd-mobile-icons';
import DataShow from './component/DatsShow';
import { Avatar, Badge } from 'antd';
import Menus, { borderStyle } from './component/Menus';
import { useModel } from 'umi';
import { connect } from 'dva';
import DefaultMenus from './component/DefaultMenus';
import MenusItem from './component/MenusItem';
import MaterialAnalysis from '../Report/components/MaterialAnalysis';
import InventoryRotation from '../Report/components/InventoryRotation';
import WorkEfficiency from '../Report/components/WorkEfficiency';
import ErrorSku from '../Report/components/ErrorSku';
import { useHistory } from 'react-router-dom';

export const getUserInfo = { url: '/cpuserInfo/backHeadPortrait', method: 'GET' };

const Home = (props) => {

  const history = useHistory();

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};
  const userInfo = state.userInfo || {};

  const userMenus = props.data && props.data.userMenus;

  const sysMenus = userInfo.mobielMenus || [];

  const commonlyMenus = DefaultMenus({ userMenus, sysMenus });

  const [dataTitle, setDataTitle] = useState('资产状况数据看板');

  useEffect(() => {
    if (!userMenus) {
      props.dispatch({
        type: 'data/getUserMenus',
        payload: {
          sysMenus,
        },
      });
    }
    window.document.title = state.systemName ? `首页-${state.systemName}` : '首页';
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
          {state.slogan || 'slogan'}
       </span>
        </div>
      </div>
      <div onClick={() => {
        // props.dispatch({
        //   type: 'qrCode/scanCodeState',
        //   payload: {
        //     route: '/User',
        //   },
        // });
        // history.push('/');
      }}>
        <Avatar
          style={{ backgroundColor: '#98BFEB' }}
          size={46}
          src={userInfo.avatar}>{userInfo.name && userInfo.name.substring(0, 1)}</Avatar>
      </div>
    </div>
    <Card
      className={style.dataCard}
      title={<div className={style.cardTitle}>{dataTitle}</div>}
      extra={<SetOutline style={{ color: '#257BDE', fontSize: 16 }} />}
      bodyClassName={style.cardBody}
      headerClassName={style.cardHeader}
    >
      <Swiper loop autoplay onIndexChange={(index) => {
        let title = '';
        switch (index) {
          case 0:
            title = '资产状况数据看板';
            break;
          case 1:
            title = '物料分析';
            break;
          case 2:
            title = '库存轮转';
            break;
          case 3:
            title = '工作效率';
            break;
          case 4:
            title = '异常物料';
            break;
          default:
            break;
        }
        setDataTitle(title);
      }}>
        <Swiper.Item key='0'>
          <div className={style.data}>
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
              {/*<MoreOutline className={style.allData} />*/}
            </div>
            <DataShow />
          </div>
        </Swiper.Item>
        <Swiper.Item key='1'>
          <MaterialAnalysis />
        </Swiper.Item>
        <Swiper.Item key='2'>
          <InventoryRotation />
        </Swiper.Item>
        <Swiper.Item key='3'>
          <WorkEfficiency />
        </Swiper.Item>
        <Swiper.Item key='4'>
          <ErrorSku />
        </Swiper.Item>
      </Swiper>
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
          [...commonlyMenus, 'all'].map((item, index) => {
            const border = borderStyle(index, 3, [...commonlyMenus, 'all'].length);
            if (item === 'all') {
              return <Grid.Item key={index} className={style.menus} style={{ ...border }}>
                <Menus fontSize={34} />
              </Grid.Item>;
            }

            return <Grid.Item
              className={style.menus}
              key={index}
              style={{ ...border }}
            >
              <MenusItem
                textOverflow={80}
                code={item.code}
                name={item.name}
                fontSize={34}
              />
            </Grid.Item>;
          })
        }
      </Grid>
    </Card>
    <div style={{ height: 16 }} />
  </div>;
};

export default connect(({ qrCode,data }) => ({ qrCode,data }))(Home);
