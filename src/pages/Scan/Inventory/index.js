import React, { useEffect, useRef, useState } from 'react';
import { getHeader } from '../../components/GetHeader';
import { Space, Toast } from 'antd-mobile';
import { useRequest } from '../../../util/Request';
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

  const [item, setItem] = useState();

  const [state, setState] = useState(true);

  const [type, setType] = useState('');

  const [position, setPosition] = useState(false);

  const { loading, run } = useRequest(
    {
      url: '/inventory/inventoryByCodeId',
      method: 'GET',
    }, {
      manual: true,
      onSuccess: (res) => {
        if (position) {
          if (res.type === 'inkind' && !(res.object && res.object.inNotStock)) {
            setItem(res.object);
          } else {
            clearCode();
            Toast.show({
              content: '请扫不在库存的实物码！',
            });
          }
        } else {
          setType(res.type);
          setData(res.object);
          switch (res.type) {
            case 'inkind':
              if (!(res.object && res.object.inNotStock)) {
                Toast.show({
                  content: '库存中不存在此物料！',
                  position: 'bottom',
                  duration:5000,
                });
                setState(false);
              } else {
                inventory(res.object.inkindId, 0);
                setState(true);
                Toast.show({
                  content: '扫描成功！',
                  position: 'bottom',
                  duration:5000,
                });
              }
              break;
            case 'positions':
              setPosition(true);
              break;
            default:
              break;
          }
        }
      },
      onError: () => {
        clearCode();
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

  useEffect(() => {
    if (loading) {
      Toast.show({
        icon: 'loading',
        duration: 0,
        content: '加载中…',
      });
    } else if (loading === false) {
      Toast.clear();
    }
  }, [loading]);

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

  if (loading || outstockLoading) {
    return <MyLoading
      loading={loading || outstockLoading}
      title={'处理中...'} />;
  }

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
          inventory={(res) => {
            inventory(data.inkindId, res);
          }}
          outstockRun={(res) => {
            outstockRun(res);
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
          codeId={codeId}
          setPosition={(res) => {
            setPosition(res);
          }}
          setData={(res) => {
            setData(res);
          }}
          clearCode={() => {
            clearCode();
          }}
          storehouseposition={storehouseposition}
          item={item}
        />;
      default:
        return null;
    }
  };

  return <>
    {module()}

    <Html2Canvas ref={ref} success={() => {
      setData(null);
    }} />


  </>;
};

export default connect(({ qrCode }) => ({ qrCode }))(Inventory);
