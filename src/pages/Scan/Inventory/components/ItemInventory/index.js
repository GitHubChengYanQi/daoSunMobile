import React, { useRef, useState } from 'react';
import { storehousePositionsTreeView } from '../../../Url';
import { Dialog, List, Space, Toast } from 'antd-mobile';
import TreeSelectSee from '../../../../components/TreeSelectSee';
import { Typography } from 'antd';
import MyTreeSelect from '../../../../components/MyTreeSelect';
import Search from '../../../InStock/FreeInstock/components/Search';
import Html2Canvas from '../../../../Html2Canvas';
import { Input } from 'weui-react-v2';
import BottomButton from '../../../../components/BottomButton';

const ItemInventory = (
  {
    codeId,
    clearCode,
    data,
    state,
    storehouseposition,
    setData,
    outstockRun,
    instockRun,
    number: defaultNumber,
  }) => {

  const ref = useRef();

  const refSearch = useRef();

  const [number, setNumber] = useState(defaultNumber);

  const [storehouse, setStorehouse] = useState({});

  const [storehousePosition, setStorehousePosition] = useState();

  const instockAction = (positionsId,storeHouseId) => {
    instockRun({
      data: {
        positionsId,
        codeIds: [codeId],
        storeHouseId,
      },
    });
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
    return <>
      {skuResult.skuName}
      &nbsp;/&nbsp;
      {skuResult.spuResult && skuResult.spuResult.name}
      &nbsp;&nbsp;
      {
        skuResult.list
        &&
        skuResult.list.length > 0
        &&
        skuResult.list[0].attributeValues
        &&
        <em style={{ color: '#c9c8c8', fontSize: 10 }}>
          (
          {
            skuResult.list.map((items, index) => {
              return <span key={index}>{items.itemAttributeResult.attribute}：{items.attributeValues}</span>;
            })
          }
          )
        </em>}
    </>;
  };

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
      <List.Item title={state && data.skuResult.batch === 1 ? '数量 (可修改) ' : '数量'}>
        {
          state && data.skuResult.batch === 1
            ?
            <Input
              style={{ width: 100, color: number >= 0 ? '#1677ff' : 'red' }}
              type='number'
              value={number}
              onChange={(value) => {
                setNumber(value);
              }} />
            :
            <h3>{data.number}</h3>
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
            <MyTreeSelect
              arrow={false}
              ref={treeRef}
              branch={!storehouse.value}
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

    <BottomButton
      only={!state && data.skuResult.batch === 1}
      leftText='下一项'
      rightText='修复库存'
      rightDisabled={parseInt(number) === data.number}
      rightOnClick={() => {
        if (parseInt(number) >= 0) {
          if (number > data.number) {
            // 入库
          } else if (number < data.number) {
            // 出库
            out(data.number - number);
          }
        } else {
          Toast.show({
            content: '请输入正确数量!',
            position: 'bottom',
          });
        }
      }}
      leftOnClick={() => {
        setData(null);
        clearCode();
      }}
      text={state ? '下一项' : '添加库存'}
      onClick={() => {
        if (state) {
          setData(null);
          clearCode();
        } else {
          if (storehousePosition && storehouse.value) {
            instockAction(storehousePosition,storehouse.value);
          } else {
            Toast.show({
              content: '请选择仓库和库位',
              position: 'bottom',
            });
          }
        }
      }}
    />
  </>;
};

export default ItemInventory;
