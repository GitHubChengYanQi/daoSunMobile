import React, { useState } from 'react';
import { Card, Grid } from 'antd-mobile';
import style from '../../../Home/index.less';
import Menus, { borderStyle } from '../../../Home/component/Menus';
import { useModel } from 'umi';
import CreateInStock from './components/CreateInStock';
import Inventory from './components/Inventory';
import CuringAsk from './components/CuringAsk';

const Create = () => {

  const { initialState } = useModel('@@initialState');

  const userInfo = initialState.userInfo || {};

  const sysMenus = userInfo.mobielMenus || [];

  const [visible, setVisible] = useState();

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


  return <div style={{ padding: 16 }}>
    <Card
      className={style.dataCard}
      style={{ marginBottom: 0 }}
      bodyClassName={style.manuCardBody}
      headerClassName={style.cardHeader}
    >
      <Grid columns={3} gap={0}>
        {
          receipts.map((item, index) => {
            const border = borderStyle(index, 3, receipts.length);
            return <Grid.Item className={style.menus} key={index} style={{ ...border }}>
              <Menus
                textOverflow={80}
                code={item.code}
                name={item.name}
                fontSize={50}
                onClick={(code) => {
                  switch (code) {
                    case 'inventoryAsk':
                    case 'instockAsk':
                    case 'curingAsk':
                      setVisible(code);
                      return true;
                    default:
                      break;
                  }
                }} />
            </Grid.Item>;
          })
        }
      </Grid>
    </Card>

    <CreateInStock open={visible === 'instockAsk'} onClose={() => setVisible(false)} />
    <Inventory open={visible === 'inventoryAsk'} onClose={() => setVisible(false)} />
    <CuringAsk open={visible === 'curingAsk'} onClose={() => setVisible(false)} />

  </div>;
};

export default Create;
