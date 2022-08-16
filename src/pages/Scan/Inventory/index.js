import React, { useEffect, useState } from 'react';
import { Space, Toast } from 'antd-mobile';
import { useRequest } from '../../../util/Request';
import { connect } from 'dva';
import { MyLoading } from '../../components/MyLoading';
import MyEmpty from '../../components/MyEmpty';
import LinkButton from '../../components/LinkButton';
import { ScanOutlined } from '@ant-design/icons';
import ItemInventory from './components/ItemInventory';
import PositionsInventory from './components/PositionsInventory';
import { storehousePositionsTreeView } from '../Url';
import { ToolUtil } from '../../components/ToolUtil';

const Inventory = (props) => {

  const codeId = props.qrCode && props.qrCode.codeId;

  const clearCode = () => {
    props.dispatch({
      type: 'qrCode/clearCode',
    });
  };

  const { data: storehouseposition } = useRequest(storehousePositionsTreeView);

  const [data, setData] = useState();

  const [item, setItem] = useState();

  const [position, setPosition] = useState({});

  const [state, setState] = useState(true);

  const [type, setType] = useState();

  const scanInkind = (res) => {
    if (!(res.object && res.object.inNotStock)) {
      Toast.show({
        content: '库存中不存在此物料！',
        position: 'bottom',
        duration: 5000,
      });
      setState(false);
    } else {
      inventory(res.object.inkindId, 0);
      setState(true);
      Toast.show({
        content: '扫描成功！',
        position: 'bottom',
        duration: 5000,
      });
    }
  };

  const { loading, run } = useRequest(
    {
      url: '/inventory/inventoryByCodeId',
      method: 'GET',
    }, {
      manual: true,
      onSuccess: (res) => {
        if (type) {
          switch (type) {
            case 'inkind':
              switch (res.type) {
                case 'inkind':
                  setData(res.object);
                  scanInkind(res);
                  break;
                case 'positions':

                  if (state) {
                    setType(res.type);
                    setData(res.object);
                  } else {
                    setPosition({
                      storehouse: {
                        label: res.object.storehouseResult.name,
                        value: res.object.storehouseResult.storehouseId,
                      },
                      positionId: res.object.storehousePositionsId,
                    });
                  }

                  break;
                default:
                  clearCode();
                  Toast.show({
                    content: '请扫库位码！',
                    position: 'bottom',
                  });
                  break;
              }
              break;
            case 'positions':
              switch (res.type) {
                case 'inkind':
                  if (!(res.object && res.object.inNotStock)) {
                    setItem(res.object);
                  }
                  break;
                case 'positions':
                  setData(res.object);
                  break;
                default:
                  clearCode();
                  Toast.show({
                    content: '请扫不在库存的实物码！',
                    position: 'bottom',
                  });
                  break;
              }
              break;
            default:
              break;
          }
        } else {
          setType(res.type);
          setData(res.object);
          switch (res.type) {
            case 'inkind':
              scanInkind(res);
              break;
            case 'positions':
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
  });


  useEffect(() => {
    if (codeId) {
      setData(null);
      run({
        params: {
          id: codeId,
        },
      });
    }
  }, [codeId]);

  if (loading || outstockLoading) {
    return <MyLoading
      title={'处理中...'} />;
  }

  if (!data) {
    return <MyEmpty description={<Space direction='vertical' align='center'>
      <span style={{ fontSize: 24 }}>
        请扫描物料或库位
      </span>
      {
        ToolUtil.isQiyeWeixin() && <LinkButton onClick={() => {
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
          position={position}
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
          setType={(res) => {
            setType(res);
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
  </>;
};

export default connect(({ qrCode }) => ({ qrCode }))(Inventory);
