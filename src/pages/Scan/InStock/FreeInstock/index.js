import React, { useState } from 'react';
import { Tabs, Toast } from 'antd-mobile';
import { connect } from 'dva';
import { useDebounceEffect } from 'ahooks';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';
import PositionFreeInstock from '../PositionFreeInstock';
import SkuFreeInstock from '../SkuFreeInstock';
import style from './index.css';

const FreeInstock = (props) => {

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
          clearCode();
          break;
        case 'sku':
          setKey('sku');
          setScnaData(res.result);
          clearCode();
          break;
        default:
          Toast.show({
            content: '请扫库位码或物料码！',
            position: 'bottom',
          });
          clearCode();
          break;
      }
    },
  });


  useDebounceEffect(() => {
    if (codeId && codeId !== '') {
      codeRun({
        params: {
          id: codeId,
        },
      });
    }
  }, [codeId], {
    wait: 0,
  });

  return <div>
    <Tabs
      className={style.tab}
      activeKey={key}
      onChange={(key) => {
        setScnaData(null);
        setKey(key);
      }}
    >
      <Tabs.Tab title='按物料入库' key='sku'>
        <SkuFreeInstock scanData={scnaData} />
      </Tabs.Tab>
      <Tabs.Tab title='按库位入库' key='position'>
        <PositionFreeInstock scanData={scnaData} />
      </Tabs.Tab>
    </Tabs>

    {
      loading && <MyLoading />
    }
  </div>;
};

export default connect(({ qrCode }) => ({ qrCode }))(FreeInstock);
