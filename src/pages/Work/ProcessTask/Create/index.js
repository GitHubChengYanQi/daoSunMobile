import React from 'react';
import { Grid } from 'antd-mobile';
import style from '../../../Home/index.less';
import Menus from '../../../Home/component/Menus';
import { useModel } from 'umi';

const Create = () => {

  const { initialState } = useModel('@@initialState');

  const userInfo = initialState.userInfo || {};

  const sysMenus = userInfo.mobielMenus || [];

  const receipts = [];
  sysMenus.map(item => {
    if (item.id === 'process') {
      item.subMenus.map((item) => {
        if (item.code !== 'action') {
          receipts.push(item);
        }
        return null;
      });
    }
    return null;
  });

  return <div style={{backgroundColor:'#fff'}}>

    <Grid columns={3} gap={0}>
      {
        receipts.map((item, index) => {
          return <Grid.Item className={style.menus} key={index}>
            <Menus textOverflow={80} code={item.code} name={item.name} fontSize={50} />
          </Grid.Item>;
        })
      }
    </Grid>

  </div>;
};

export default Create;
