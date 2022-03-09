import React, { useEffect, useRef, useState } from 'react';
import { storehousePositionsTreeView } from '../../../Url';
import { List, Toast } from 'antd-mobile';
import TreeSelectSee from '../../../../components/TreeSelectSee';
import { Typography } from 'antd';
import Html2Canvas from '../../../../Html2Canvas';
import BottomButton from '../../../../components/BottomButton';
import MyCascader from '../../../../components/MyCascader';
import { useRequest } from '../../../../../util/Request';
import SkuResult from '../../../Sku/components/SkuResult';
import Number from '../../../../components/Number';
import Search from '../../../InStock/PositionFreeInstock/components/Search';

const ItemInventory = (
  {
    codeId,
    clearCode,
    data,
    state,
    position,
    inventory,
    storehouseposition,
    setData,
    outstockRun,
  }) => {
  const ref = useRef();

  const refSearch = useRef();

  const [number, setNumber] = useState();

  const [storehouse, setStorehouse] = useState({});

  const [storehousePosition, setStorehousePosition] = useState();

  useEffect(() => {
    setStorehouse(position.storehouse || {});
    setStorehousePosition(position.positionId);
  }, [position]);

  const { run } = useRequest({
    url: '/inventoryDetail/inventoryInstock',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: async () => {
      Toast.show({
        content: '入库成功！',
        position: 'bottom',
      });
      clearCode();
      setData(null);
    },
    onError: () => {
      Toast.show({
        content: '入库失败！',
        position: 'bottom',
      });
    },
  });

  const instockAction = (positionId, storeHouseId) => {
    if (number > 0) {
      run({
        data: {
          inkindId: data.inkindId,
          number: number,
          storeHouseId,
          positionId,
          qrCodeId: codeId,
        },
      });
    } else {
      Toast.show({
        content: '数量不能小于1！',
      });
    }
  };

  const out = (number) => {
    outstockRun({
      data: {
        type: '盘点出库',
        batchOutStockParams: [{
          codeId,
          number,
        }],
      },
    });
  };

  const treeRef = useRef();

  const getSku = (skuResult) => {
    if (!skuResult) {
      return null;
    }
    return <SkuResult skuResult={skuResult} />
  };

  useEffect(() => {
    setNumber(data.number || 1);
  }, [data]);

  return <>
    <List
      style={{
        '--border-top': 'none',
        '--border-bottom': 'none',
      }}>
      <List.Item title='物料信息'>
        <h3>{getSku(data.skuResult)}</h3>
      </List.Item>
      <List.Item title='供应商(品牌)'>
        <h3>{data.brand && data.brand.brandName}</h3>
      </List.Item>
      <List.Item title={data.skuResult.batch === 1 ? '数量 (可修改) ' : '数量'}>
        {
          data.skuResult.batch === 1
            ?
            <Number
              color={number > 0 ? 'blue' : 'red'}
              width='100%'
              value={number}
              onChange={(value) => {
                setNumber(value);
              }} />
            :
            <h3>{number}</h3>
        }
      </List.Item>
      {state ? <>
          <List.Item title='仓库'>
            <h3>{data.positionsResult && data.positionsResult.storehouseResult && data.positionsResult.storehouseResult.name}</h3>
          </List.Item>
          <List.Item title='库位'>
            <h3>
              <TreeSelectSee
                data={storehouseposition}
                value={data.positionsResult && data.positionsResult.storehousePositionsId} />
            </h3>
          </List.Item>
          <List.Item title='入库时间'>
            <h3>{data.createTime}</h3>
          </List.Item>
        </>
        :
        <>
          <List.Item title='仓库'>
            <Typography.Link underline onClick={() => {
              refSearch.current.search({ type: 'storehouse' });
            }}>
              {
                storehouse.label || '请选择仓库'
              }
            </Typography.Link>
          </List.Item>
          <List.Item
            title='库位'
          >
            <MyCascader
              arrow={false}
              ref={treeRef}
              disabled={!storehouse.value}
              poputTitle='选择库位'
              branchText='请先选择仓库'
              textType='link'
              resh={storehouse.value}
              title={<Typography.Link underline>选择库位</Typography.Link>}
              value={storehousePosition}
              api={storehousePositionsTreeView}
              onChange={(value) => {
                setStorehousePosition(value);
              }}
            />
          </List.Item>
        </>}
    </List>

    <Search ref={refSearch} onChange={(value) => {
      switch (value.type) {
        case 'storehouse':
          treeRef.current.run({
            params: {
              ids: value.value,
            },
          });
          setStorehouse(value);
          break;
        default:
          break;
      }
    }} />

    <Html2Canvas ref={ref} success={() => {
      setData(null);
    }} />

    {
      (!state || data.skuResult.batch === 1)
      &&
      <BottomButton
        only
        disabled={parseInt(number) === data.number}
        text={state ? '确定数量' : '添加库存'}
        onClick={() => {
          if (state) {
            if (parseInt(number) > 0) {
              if (number > data.number) {
                // 入库
                inventory(1);
                if (data.positionsResult) {
                  instockAction(data.positionsResult.storehousePositionsId, data.positionsResult.storehouseId);
                } else {
                  Toast.show({
                    content: '请查看库存和库位！',
                  });
                }
              } else if (number < data.number) {
                // 出库
                inventory(2);
                out(data.number - number);
              }
            } else {
              Toast.show({
                content: '请输入正确数量!',
                position: 'bottom',
              });
            }
          } else {
            if (storehousePosition && storehouse.value) {
              inventory(1);
              instockAction(storehousePosition, storehouse.value);
            } else {
              Toast.show({
                content: '请选择仓库和库位',
                position: 'bottom',
              });
            }
          }
        }}
      />}
  </>;

};

export default ItemInventory;
