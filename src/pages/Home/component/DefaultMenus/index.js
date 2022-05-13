import React from 'react';
import { Grid } from 'antd-mobile';
import style from '../../index.less';
import Menus from '../Menus';
import { useModel } from 'umi';

const DefaultMenus = ({fontSize}) => {

  const { initialState } = useModel('@@initialState');

  const userInfo = initialState.userInfo || {};

  const sysMenus = userInfo.menus || [];

  console.log(sysMenus);

  return <>
    {
      sysMenus.map((item, index) => {
        if (index >= 8) {
          return null;
        }
        return <Grid.Item key={index} className={style.menus}>
          <Menus code={item.id} name={item.name} fontSize={fontSize} />
        </Grid.Item>;
      })
    }
  </>;
};

export default DefaultMenus;
