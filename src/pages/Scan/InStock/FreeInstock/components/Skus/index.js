import React, { useEffect, useRef, useState } from 'react';
import { Card, List, Space, Toast } from 'antd-mobile';
import Search from '../Search';
import Number from '../../../../../components/Number';
import LinkButton from '../../../../../components/LinkButton';
import IsDev from '../../../../../../components/IsDev';
import { getHeader } from '../../../../../components/GetHeader';
import { request } from '../../../../../../util/Request';
import { DeleteOutline } from 'antd-mobile-icons';
import { useSetState } from 'ahooks';

const Skus = (
  {
    sku,
    fontSize,
    addCanvas,
    onChange,
    params,
  },
) => {

  const selectRef = useRef();

  const [skuItem, setSkuItem] = useState({
    skuId: sku.skuId,
    skuResult: sku.skuResult,
    batch: sku.batch,
    brandId: null,
    brandName: null,
    customerId: null,
    customerName: null,
    batchNumber: null,
  });

  const [items, setItems] = useSetState({
      data: [
        // inkindId
        // codeId
        // number
      ],
    },
  );

  const value = () => {
    const array = [];
    for (let i = 0; i < skuItem.batchNumber; i++) {
      const item = items.data[i] || {};
      array.push({
        skuId: skuItem.skuId,
        brandId: skuItem.brandId,
        customerId: skuItem.customerId,
        inkindId: item.inkindId,
        codeId: item.codeId,
        number: skuItem.batch ? item.number : 1,
      });
    }
    return array;
  };

  useEffect(() => {
    onChange(value());
  }, [skuItem, items]);

  const listItems = () => {
    const arrays = [];
    for (let i = 0; i < skuItem.batchNumber; i++) {
      const item = params[i] || {
        number: !skuItem.batch && 1,
      };
      arrays.push(<List.Item
        key={i}
        extra={
          <LinkButton title={item.inkindId ? '打印二维码' : '生成二维码'} onClick={async () => {
            if (!skuItem.brandId || !skuItem.skuId || !skuItem.customerId) {
              return Toast.show({
                content: '请完善物料信息！',
                position: 'bottom',
              });
            }
            if (item.number > 0) {
              if (item.inkindId) {
                if (IsDev() || !getHeader()) {
                  addCanvas([item.inkindId]);
                }
                return;
              }
              const res = await request({
                url: '/orCode/automaticBinding',
                method: 'POST',
                data: {
                  source: 'item',
                  brandId: skuItem.brandId,
                  id: skuItem.skuId,
                  number: item.number,
                  inkindType: '自由入库',
                },
              });
              if (IsDev() || !getHeader()) {
                addCanvas([res.inkindId]);
              }
              setItems([]);
              const arr = params;
              arr[i] = { ...item, codeId: res.codeId, inkindId: res.inkindId };
              setItems({ data: arr });
            } else {
              Toast.show({
                content: '数量不能小于0!',
                position: 'bottom',
              });
            }
          }} />
        }
      >
        <Space align='center'>
          <LinkButton
            onClick={() => {
              const array = params;
              array.splice(i, 1);
              setItems({ data: array });
              setSkuItem({ ...skuItem, batchNumber: skuItem.batchNumber - 1 });
            }}
            disabled={item.inkindId}
            title={
              <DeleteOutline />
            } />
          <div style={{ marginRight: 32 }}>
            第{i + 1}
            {
              skuItem.batch ? '批' : '个'
            }
          </div>
          {skuItem.batch && <Number
            placeholder='入库数量'
            color={item.number > 0 ? 'blue' : 'red'}
            width={100}
            disabled={item.inkindId}
            value={item.number}
            onChange={(value) => {
              const arr = params;
              arr[i] = { ...arr[i], number: value };
              setItems({ data: arr });
            }} />}
        </Space>
      </List.Item>);
    }
    return arrays;
  };

  return <>
    <Card
      bodyStyle={{ padding: 0 }}
      title={<span style={{ fontSize }}>{skuItem.skuResult}</span>}
      extra={<Number
        center
        placeholder={skuItem.batch ? '批次' : '数量'}
        buttonStyle={{
          padding: '0 8px',
          border: 'solid #999999 1px',
          borderRadius: 10,
          display: 'inline-block',
        }}
        color={skuItem.batchNumber > 0 ? 'blue' : 'red'}
        width={80}
        value={skuItem.batchNumber}
        onChange={(value) => {
          setSkuItem({ ...skuItem, batchNumber: value });
        }} />}
    >
      <List
        style={{
          '--border-top': 'none',
        }}
      >
        {skuItem.batchNumber > 0 && <>
          <List.Item
            title='品牌'
            style={{ padding: 0 }}>
            <LinkButton
              style={{ width: '100vw', fontSize, textAlign: 'left', color: !skuItem.brandName && 'red' }}
              onClick={() => {
                selectRef.current.search({
                  type: 'brand',
                  params: {
                    skuId: skuItem.skuId,
                    nameSource: '品牌',
                    name: '',
                  },
                });
              }}
              title={
                skuItem.brandName || '选择品牌'
              }
            />
          </List.Item>
          <List.Item
            title='供应商'
            style={{ padding: 0 }}>
            <LinkButton
              style={{ width: '100vw', fontSize, textAlign: 'left', color: !skuItem.customerName && 'red' }}
              onClick={() => {
                selectRef.current.search({
                  type: 'supply',
                  params: {
                    skuId: skuItem.skuId,
                    brandId: skuItem.brandId,
                    nameSource: '供应商',
                    name: '',
                  },
                });
              }}
              title={
                skuItem.customerName || '选择供应商'
              }
            />
          </List.Item>
        </>
        }
        <List.Item>
          {listItems()}
        </List.Item>
      </List>
    </Card>

    <Search ref={selectRef} onChange={async (value) => {
      switch (value.type) {
        case 'brand':
          setSkuItem({
            ...skuItem,
            brandId: value.value,
            brandName: value.label,
          });
          break;
        case 'supply':
          setSkuItem({
            ...skuItem,
            customerId: value.value,
            customerName: value.label,
          });
          break;
        default:
          break;
      }
    }} />
  </>;
};

export default Skus;
