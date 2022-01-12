import React, { useRef } from 'react';
import { stockDetailsList } from '../../../Scan/Url';
import { Button, List, Space } from 'antd-mobile';
import MyList from '../../../components/MyList';
import { useSetState } from 'ahooks';
import MyEmpty from '../../../components/MyEmpty';
import IsDev from '../../../../components/IsDev';
import { getHeader } from '../../../components/GetHeader';
import { request } from '../../../../util/Request';
import Html2Canvas from '../../../Html2Canvas';
import LinkButton from '../../../components/LinkButton';
import BackSkus from '../../../Scan/Sku/components/BackSkus';

const StockDetails = (props) => {

  const ids = props.location.query;

  const html2ref = useRef();

  const [datas, setDatas] = useSetState({ data: [] });

  if (!datas) {
    return <MyEmpty height='100vh' />;
  }

  const print = async (inkindId) => {
    if (IsDev() || !getHeader()) {
      const templete = await request({
        url: '/inkind/detail',
        method: 'POST',
        data: {
          inkindId,
        },
      });
      if (templete.printTemplateResult && templete.printTemplateResult.templete) {
        await html2ref.current.setTemplete(templete.printTemplateResult && templete.printTemplateResult.templete);
        await html2ref.current.setCodeId(true);
      }
    }
  };

  return <>
    <MyList
      select={
        {
          storehousePositionsId: ids.storehousePositionsId,
        }
      }
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

    <Html2Canvas close ref={html2ref} />
  </>;
};

export default StockDetails;
