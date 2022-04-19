import React, { useEffect, useState } from 'react';
import { Tabs, Toast } from 'antd-mobile';
import { connect } from 'dva';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';
import PositionFreeInstock from '../PositionFreeInstock';
import SkuFreeInstock from '../SkuFreeInstock';
import style from './index.css';

const FreeInstock = (props) => {

  const [key, setKey] = useState('sku');

  const [scnaData, setScnaData] = useState({});

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
          setScnaData(res);
          clearCode();
          break;
        case 'sku':
          setKey('sku');
          setScnaData(res);
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


  useEffect(() => {
    if (codeId && codeId !== '') {
      codeRun({
        params: {
          id: codeId,
        },
      });
    }
  }, [codeId]);

  if (loading) {
    return <MyLoading />;
  }

  const module = () => {
    switch (key) {
      case 'sku':
        return <SkuFreeInstock scanData={scnaData.type === 'sku' && scnaData.result} />;
      case 'position':
        return <PositionFreeInstock scanData={scnaData.type === 'storehousePositions' && scnaData.result} />;
      default:
        return <></>;
    }
  };

  return <div>
    <div style={{position:'sticky',top:0,zIndex:99,backgroundColor:'#fff'}}>
      <Tabs
        className={style.tab}
        activeKey={key}
        onChange={(key) => {
          setScnaData({});
          setKey(key);
        }}
      >
        <Tabs.Tab title={<div>按物料入库</div>} key='sku' />
        <Tabs.Tab title={<div>按库位入库</div>} key='position' />
      </Tabs>
    </div>

    {module()}
  </div>;
};

export default connect(({ qrCode }) => ({ qrCode }))(FreeInstock);
