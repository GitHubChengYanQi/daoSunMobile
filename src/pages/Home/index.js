import React, { useEffect } from 'react';
import style from './index.less';
import { Logo } from '../Logo';
import { Card, Grid } from 'antd-mobile';
import { MoreOutline, SetOutline } from 'antd-mobile-icons';
import DataShow from './component/DatsShow';
import { Badge } from 'antd';
import Menus from './component/Menus';
import avatar from '../../assets/avatar.png';
import { useModel } from 'umi';
import { connect } from 'dva';

const Home = (props) => {

  const { initialState } = useModel('@@initialState');

  const userMenus = props.data && props.data.userMenus;

  useEffect(() => {
    if (!userMenus) {
      props.dispatch({
        type: 'data/getUserMenus',
      });
    }
  }, []);

  return <div className={style.home}>
    <div className={style.enterprise}>
      <div className={style.enterpriseLeft}>
        <div className={style.logo}>
          <img src={Logo.HomeLogo()} width={46} height={46} alt='' />
        </div>
        <div className={style.enterpriseTitle}>
        <span className={style.enterpriseName}>
          {initialState.enterpriseName || '企业名称'}
        </span>
          <span className={style.enterpriseDescribe}>
          因为信任，所以简单
       </span>
        </div>
      </div>
      <div>
        <img src={avatar} width={46} height={46} alt='' />
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
        <span>总资产：<span className={style.red}>￥10232.00</span></span>
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
          (userMenus || []).map((item, index) => {
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
  </div>;
};

export default connect(({ data }) => ({ data }))(Home);
