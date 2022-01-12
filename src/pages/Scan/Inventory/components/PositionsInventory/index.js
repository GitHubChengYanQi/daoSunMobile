import React, { useEffect, useState } from 'react';
import { Card, Checkbox, List, Space, Toast } from 'antd-mobile';
import Icon from '../../../../components/Icon';
import style from '../../../../Work/Quality/DispatchTask/index.css';
import TreeSelectSee from '../../../../components/TreeSelectSee';
import { NumberInput } from 'weui-react-v2';
import BottomButton from '../../../../components/BottomButton';
import LinkButton from '../../../../components/LinkButton';
import { useRequest } from '../../../../../util/Request';
import { useSetState } from 'ahooks';
import MyEmpty from '../../../../components/MyEmpty';
import SkuResult from '../../../Sku/components/SkuResult';
import SkuResultSkuJsons from '../../../Sku/components/SkuResult_skuJsons';
import Number from '../../../../components/Number';

const PositionsInventory = (
  {
    data,
    item,
    setData,
    codeId,
    clearCode,
    setType,
    storehouseposition,
  },
) => {

  const [check, setCheck] = useState([]);

  const { run } = useRequest({
    url: '/inventory/inventory',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: () => {
      Toast.show({
        content: '盘点完成！',
        position: 'bottom',
      });
      setType(null);
      setData(null);
      clearCode();
    },
    onError: () => {
      Toast.show({
        content: '盘点失败！',
        position: 'bottom',
      });
    },
  });

  const getSku = (skuResult, list) => {
    if (!skuResult) {
      return null;
    }

    if (list)
      return <SkuResult skuResult={skuResult} />;
    else
      return <SkuResultSkuJsons skuResult={skuResult} />
  };

  const [inkinds, setInkinds] = useSetState({ data: [] });

  useEffect(() => {
    if (item) {
      const batch = item.skuResult.batch === 1;
      const items = inkinds.data.filter((value) => {
        return value.inkindId === item.inkindId;
      });
      if (items && items.length === 0) {
        const object = {
          codeId,
          sku: getSku(item.skuResult),
          batch,
          brand: item.brand && item.brand.brandName,
          inkindId: item.inkindId,
          number: batch ? item.number || 1 : 1,
        };
        setCheck([...check, item.inkindId]);
        setInkinds({ data: [...inkinds.data, object] });
      } else {
        Toast.show({
          content: '已在库位中，请勿重复扫描！',
        });
      }
    }
  }, [item]);

  useEffect(() => {
    const list = data.detailsResults ? data.detailsResults.map((items) => {
      if (items.inkindResult && items.inkindResult.skuResult && items.inkindResult.brandResult) {
        const batch = items.inkindResult.skuResult.batch === 1;
        return {
          sku: getSku(items.inkindResult && items.inkindResult.skuResult),
          brand: items.inkindResult.brandResult.brandName,
          inkindId: items.inkindId,
          number: batch ? items.number || 1 : 1,
          batch,
          codeId: items.qrCodeId,
        };
      } else {
        return null;
      }

    }) : [];
    setCheck(list.map((items) => {
      return items.inkindId;
    }));
    setInkinds({ data: list });
  }, []);

  return <>
    <Card title={
      <Space direction='vertical'>
        <div>
          {data.storehouseResult && data.storehouseResult.name}
          -
          <TreeSelectSee
            data={storehouseposition}
            value={data.storehousePositionsId} />
        </div>
        <em style={{ fontSize: 10, color: '#c0bebe' }}>
          可以扫描不在库存的物料码进入此库位
        </em>
      </Space>
    } extra={<LinkButton title='清空' onClick={() => {
      setType(null);
      setData(null);
      clearCode();
    }} />}>
      {
        inkinds.data.length > 0 ?
          <Checkbox.Group
            value={check}
            onChange={(value) => {
              setCheck(value);
            }}
          >
            <Space direction='vertical' style={{ width: '100%' }}>
              {
                inkinds.data.map((items, index) => {
                  return <Space key={index} align='center'>
                    <div style={{ width: '70vw' }}>
                      <Checkbox
                        value={items.inkindId}
                        icon={(check) => {
                          if (check) {
                            return <Icon type='icon-duoxuanxuanzhong1' />;
                          } else {
                            return <Icon type='icon-a-44-110' style={{ color: '#666' }} />;
                          }
                        }}
                        className={style.checkBox}
                        style={{ width: '100%', padding: 8 }}>
                        <List.Item
                          description={
                            <>
                              {items.brand}
                            </>
                          }
                        >
                          {items.sku}
                        </List.Item>
                      </Checkbox>
                    </div>
                    <div style={{ width: '20vw', textAlign: 'center' }}>
                      <Number
                        center
                        disabled={!items.batch}
                        buttonStyle={{
                          padding:'0 8px',
                          border: 'solid #999999 1px',
                          borderRadius: 10,
                          display: 'inline-block',
                        }}
                        color={!items.batch ? 'block' : (items.number <= 0 ? 'red' : 'blue')}
                        width={80}
                        value={items.number}
                        onChange={(value) => {
                          const array = inkinds.data;
                          array[index] = { ...array[index], number: value };
                          setInkinds({ data: array });
                        }} />
                    </div>
                  </Space>;
                })
              }
            </Space>
          </Checkbox.Group>
          :
          <MyEmpty />
      }
    </Card>
    {inkinds.data.length > 0 && <BottomButton
      text='确认库存'
      only
      onClick={() => {

        const inkindParams = inkinds.data.filter((value) => {
          const array = check.filter((id) => {
            return id === value.inkindId;
          });
          return array.length === 1;
        });

        const outStockInkindParams = data.detailsResults ? data.detailsResults.filter((value) => {
          const array = check.filter((id) => {
            return id === value.inkindId;
          });
          return array.length !== 1;
        }) : [];

        const numbers = inkindParams.filter((value) => {
          return value.number <= 0;
        });

        if (numbers.length > 0) {
          return Toast.show({
            content: '请输入正确的数量！',
          });
        }

        if (inkindParams && outStockInkindParams) {
          run({
            data: {
              outStockInkindParams: outStockInkindParams.map((items) => {
                return { inkindId: items.inkindId };
              }),
              storeHouseId: data.storehouseId,
              positionId: data.storehousePositionsId,
              inkindParams: inkindParams.map((items) => {
                return {
                  inkindId: items.inkindId,
                  number: items.number,
                };
              }),
            },
          });
        }
      }}
    />}
  </>;
};

export default PositionsInventory;
