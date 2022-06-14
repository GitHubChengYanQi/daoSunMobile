import React, { useState } from 'react';
import { ActionSheet, Grid, Toast } from 'antd-mobile';
import style from '../../../Home/index.less';
import Menus, { borderStyle } from '../../../Home/component/Menus';
import { history, useModel } from 'umi';
import createStyle from './index.less'

const Create = () => {

  const { initialState } = useModel('@@initialState');

  const userInfo = initialState.userInfo || {};

  const sysMenus = userInfo.mobielMenus || [];

  const [visible,setVisible] = useState();

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

  return <div style={{ backgroundColor: '#fff' }}>

    <Grid columns={3} gap={0}>
      {
        receipts.map((item, index) => {
          const border = borderStyle(index, 3, receipts.length);
          return <Grid.Item className={style.menus} key={index} style={{ ...border }}>
            <Menus textOverflow={80} code={item.code} name={item.name} fontSize={50} onClick={(code, url) => {
              switch (code) {
                case 'inventoryAsk':
                  setVisible(true);
                  break;
                default:
                  if (!url) {
                    return Toast.show({ content: '暂未开通~', position: 'bottom' });
                  }
                  history.push(url);
                  break;
              }
            }} />
          </Grid.Item>;
        })
      }
    </Grid>

    <ActionSheet
      className={createStyle.action}
      cancelText='取消'
      visible={visible}
      actions={[{text:'按物料盘点',key:'sku'},{text:'按条件盘点',key:'condition'}]}
      onClose={()=>setVisible(false)}
      onAction={(action) => {
        switch (action.key) {
          case 'sku':
            history.push('/Work/Stocktaking/SkuStocktaking');
            break;
          case 'condition':
            history.push('/Work/Stocktaking/ConditionStocktaking');
            break;
          default:
            break;
        }
      }}
    />
  </div>;
};

export default Create;
