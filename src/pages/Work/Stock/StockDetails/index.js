import React, { useEffect, useRef } from 'react';
import { stockDetailsList } from '../../../Scan/Url';
import { Button, List, Space } from 'antd-mobile';
import MyList from '../../../components/MyList';
import { useSetState } from 'ahooks';
import MyEmpty from '../../../components/MyEmpty';
import { getHeader } from '../../../components/GetHeader';
import { request } from '../../../../util/Request';
import LinkButton from '../../../components/LinkButton';
import BackSkus from '../../../Scan/Sku/components/BackSkus';
import PrintCode from '../../../components/PrintCode';
import MyNavBar from '../../../components/MyNavBar';

const StockDetails = (props) => {

  const ids = props.location.query;

  const [datas, setDatas] = useSetState({ data: [] });

  if (!datas) {
    return <MyEmpty height='100vh' />;
  }

  const print = async (inkindId) => {
    if (!getHeader()) {
      const templete = await request({
        url: '/inkind/detail',
        method: 'POST',
        data: {
          inkindId,
        },
      });
      PrintCode.print([templete.printTemplateResult && templete.printTemplateResult.templete],0);
    }
  };

  return <>
    <MyNavBar title='库存信息' />
    <MyList
      params={{storehousePositionsId: ids.storehousePositionsId}}
      api={stockDetailsList}
      data={datas}
      getData={(value) => {
        setDatas({ data: value });
      }}>
      <List>
        {
          datas.data && datas.data.map((items, index) => {
            return <List.Item
              key={index}
              description={items.createTime}
              extra={<Space align='center'>
                <Button style={{ '--border-radius': '10px', color: '#1845b5' }}>
                  ×
                  {items.number}
                </Button>
                <LinkButton title='打印二维码' onClick={() => {
                  print(items.inkindId);
                }} />
              </Space>}
            >
              <BackSkus record={items} />
            </List.Item>;
          })
        }
      </List>
    </MyList>
  </>;
};

export default StockDetails;
