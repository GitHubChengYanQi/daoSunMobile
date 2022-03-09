import React, { useState } from 'react';
import { Tabs, Toast } from 'antd-mobile';
import style from '../../InStock/FreeInstock/index.css';
import Position from './components/Position';
import { useRequest } from '../../../../util/Request';
import { useDebounceEffect } from 'ahooks';
import { MyLoading } from '../../../components/MyLoading';
import Sku from './components/Sku';

const FreeOutstock = (props) => {

  const [key, setKey] = useState('sku');

  const [scnaData, setScnaData] = useState();

  const codeId = props.qrCode && props.qrCode.codeId;

  const clearCode = () => {
    props.dispatch({
      type: 'qrCode/clearCode',
    });
  };

  const { loading, run: codeRun } = useRequest({
    url: '/orCode/backObject',
    method: 'GET',
  }, {
    manual: true,
    onSuccess: (res) => {
      switch (res.type) {
        case 'storehousePositions':
          setKey('position');
          setScnaData(res.result);
          break;
        default:
          Toast.show({
            content: '请扫库位码或物料码！',
            position: 'bottom',
          });
          clearCode();
          break;
      }
      clearCode();
    },
    onError: () => {
      clearCode();
    },
  });

  useDebounceEffect(() => {
    if (codeId) {
      codeRun({
        params: {
          id: codeId,
        },
      });
    }
  }, [codeId], {
    wait: 0,
  });


  return <>
    <Tabs
      className={style.tab}
      activeKey={key}
      onChange={(key) => {
        setKey(key);
      }}
    >
      <Tabs.Tab title='按物料出库' key='sku'>
        <Sku />
      </Tabs.Tab>
      <Tabs.Tab title='按库位出库' key='position'>
        <Position scnaData={scnaData} />
      </Tabs.Tab>
    </Tabs>

    {
      loading && <MyLoading />
    }
  </>;
};

export default FreeOutstock;
