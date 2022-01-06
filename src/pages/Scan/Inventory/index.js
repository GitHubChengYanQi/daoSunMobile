import React, { useRef, useState } from 'react';
import { getHeader } from '../../components/GetHeader';
import { Space, Toast } from 'antd-mobile';
import { request, useRequest } from '../../../util/Request';
import { connect } from 'dva';
import { useDebounceEffect } from 'ahooks';
import { MyLoading } from '../../components/MyLoading';
import MyEmpty from '../../components/MyEmpty';
import LinkButton from '../../components/LinkButton';
import { ScanOutlined } from '@ant-design/icons';
import Html2Canvas from '../../Html2Canvas';
import ItemInventory from './components/ItemInventory';
import PositionsInventory from './components/PositionsInventory';
import { storehousePositionsTreeView } from '../Url';

const Inventory = (props) => {

  const codeId = props.qrCode && props.qrCode.codeId;

  const clearCode = () => {
    props.dispatch({
      type: 'qrCode/clearCode',
    });
  };

  const ref = useRef();

  const { data: storehouseposition } = useRequest(storehousePositionsTreeView);

  const [data, setData] = useState();

  const [state, setState] = useState(true);

  const [type, setType] = useState('');

  const { loading, run } = useRequest(
    {
      url: '/inventory/inventoryByCodeId',
      method: 'GET',
    }, {
      manual: true,
      onSuccess: (res) => {
        setType(res.type);
        setData(res.object);
        switch (res.type) {
          case 'inkind':
            if (!res.object.positionsResult) {
              inventory(res.object.inkindId, 0);
              Toast.show({
                content: '库存中不存在此物料！',
              });
              setState(false);
            } else {
              inventory(res.object.inkindId, 99);
              setState(true);
              Toast.show({
                content: '扫描成功！',
              });
            }
            break;
          case 'positions':
            break;
          default:
            break;
        }
      },
    },
  );

  // 记录盘点数据
  const { run: addInventory } = useRequest({
    url: '/inventoryDetail/add',
    method: 'POST',
  }, {
    manual: true,
  });

  const inventory = (inkindId, status) => {
    addInventory({
      data: {
        inkindId,
        status,
      },
    });
  };


  // 入库
  const { loading: instockLoading, run: instockRun } = useRequest({
    url: '/instockOrder/freeInstock',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: async () => {
      Toast.show({
        content: '入库成功！',
        position: 'bottom',
      });
      clearCode();
      setData(null)
    },
    onError: () => {
      Toast.show({
        content: '入库失败！',
        position: 'bottom',
      });
    },
  });


  // 批量出库
  const { loading: outstockLoading, run: outstockRun } = useRequest({
    url: '/orCode/batchOutStockByCode',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: () => {
      Toast.show({
        content: '出库成功！',
      });
      setData(null);
      clearCode();
    },
    onError: () => {
      Toast.show({
        content: '出库失败！',
      });
    },
  });

  useDebounceEffect(() => {
    if (codeId) {
      run({
        params: {
          id: codeId,
        },
      });
    }
  }, [codeId], {
    wait: 0,
  });

  if (!data) {
    return <MyEmpty description={<Space direction='vertical' align='center'>
      <span style={{ fontSize: 24 }}>
        请扫描物料或库位
      </span>
      {
        getHeader() && <LinkButton onClick={() => {
          props.dispatch({
            type: 'qrCode/wxCpScan',
            payload: {
              action: 'inventory',
            },
          });
        }} title={<><ScanOutlined />点击扫码</>} />
      }
    </Space>} />;
  }


  const module = () => {
    switch (type) {
      case 'inkind':
        return <ItemInventory
          storehouseposition={storehouseposition}
          number={`${ data.number }`}
          outstockRun={(res) => {
            outstockRun(res);
          }}
          instockRun={(res) => {
            instockRun(res);
          }}
          clearCode={() => {
            clearCode();
          }}
          codeId={codeId}
          state={state}
          data={data}
          setData={(res) => {
            setData(res);
          }}
        />;
      case 'positions':
        return <PositionsInventory
          data={data}
          storehouseposition={storehouseposition}
        />;
      default:
        return null;
    }
  };

  return <>
    {module()}

    <MyLoading
      loading={loading || instockLoading || outstockLoading}
      title={'处理中...'} />

    <Html2Canvas ref={ref} success={() => {
      setData(null);
    }} />


  </>;
};

export default connect(({ qrCode }) => ({ qrCode }))(Inventory);
