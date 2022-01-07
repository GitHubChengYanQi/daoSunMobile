import React from 'react';
import { Card, Space, Toast } from 'antd-mobile';
import BottomButton from '../../../components/BottomButton';
import { getHeader } from '../../../components/GetHeader';
import { storehousePositionsTreeView } from '../../Url';
import { useRequest } from '../../../../util/Request';
import { useDebounceEffect, useSetState } from 'ahooks';
import { connect } from 'dva';
import { MyLoading } from '../../../components/MyLoading';
import { Input, NumberInput } from 'weui-react-v2';
import { ScanOutlined } from '@ant-design/icons';
import MyEmpty from '../../../components/MyEmpty';
import LinkButton from '../../../components/LinkButton';
import TreeSelectSee from '../../../components/TreeSelectSee';
import { DeleteOutline } from 'antd-mobile-icons';
import style from '../../InStock/FreeInstock/index.css';

const FreeOutstock = (props) => {

  const [outstockData, setOutstockData] = useSetState({ data: [] });

  const codeId = props.qrCode && props.qrCode.codeId;

  const clearCode = () => {
    props.dispatch({
      type: 'qrCode/clearCode',
    });
  };

  const clear = () => {
    setOutstockData({ data: [] });
  };

  const { data: storehouseposition } = useRequest(storehousePositionsTreeView);

  const { loading: outstockLoading, run: outstockRun } = useRequest({
    url: '/orCode/batchOutStockByCode',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: () => {
      Toast.show({
        content: '出库成功！',
      });
      clear();
    },
    onError: () => {
      Toast.show({
        content: '出库失败！',
      });
      clear();
    },
  });

  const getSkuResult = (skuResult) => {
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

  const { loading, run: codeRun } = useRequest({
    url: '/orCode/backObject',
    method: 'GET',
  }, {
    manual: true,
    onSuccess: (res) => {
      switch (res.type) {
        case 'item':
          if (
            res.inkindResult
            &&
            res.inkindResult.inkindDetail
          ) {

            const codeIds = outstockData.data.filter((value) => {
              return value.codeId === codeId;
            });
            if (codeIds.length > 0) {
              Toast.show({
                content: '已经扫描过此物料！',
                position: 'bottom',
              });
              break;
            }

            if (res.inkindResult.inkindDetail.stockDetails.number <= 0) {
              Toast.show({
                content: '此物料已全部出库！',
                position: 'bottom',
              });
              break;
            }

            setOutstockData({
              data: [...outstockData.data, {
                stocknumber: res.inkindResult.inkindDetail.stockDetails.number,
                number: res.inkindResult.inkindDetail.stockDetails.number,
                codeId: codeId,
                brand: {
                  label: res.inkindResult.brand.brandName,
                  value: res.inkindResult.brand.brandId,
                },
                storehouse: {
                  label: res.inkindResult.inkindDetail.storehouse.name,
                  value: res.inkindResult.inkindDetail.storehouse.storehouseId,
                },
                storehousepostionId: res.inkindResult.inkindDetail.storehousePositions.storehousePositionsId,
                item: getSkuResult(res.inkindResult.skuResult),
              }],
            });
          }else {
            Toast.show({
              content:'库存不存在此物料！'
            });
          }
          break;
        default:
          Toast.show({
            content: '请扫物料码！',
            position: 'bottom',
          });
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

  if (outstockData.data.length === 0)
    return <MyEmpty description={<Space direction='vertical' align='center'>
      <span style={{ fontSize: 24 }}>
        请扫描物料
      </span>
      {
        getHeader() && <LinkButton onClick={() => {
          props.dispatch({
            type: 'qrCode/wxCpScan',
            payload: {
              action: 'freeOutstock',
            },
          });
        }} title={<><ScanOutlined />点击扫码</>} />
      }
    </Space>} />;

  return <>
    {
      outstockData.data.map((items, index) => {
        return <Card title={`物料${index + 1}`} key={index} extra={
          <LinkButton
            color='danger'
            onClick={() => {
              outstockData.data.splice(index, 1);
              setOutstockData({ data: outstockData.data });
            }}
            disabled={outstockData.data.length === 1}
            title={
              <DeleteOutline />
            } />
        }>
          <Space direction='vertical'>
            <div>
              仓库：{items.storehouse && items.storehouse.label}
            </div>
            <div>
              库位：<TreeSelectSee data={storehouseposition} value={items.storehousepostionId} />
            </div>
            <div>
              供应商(品牌)：{items.brand.label}
            </div>
            <div>
              物料：{items.item}
            </div>
            <Space align='center'>
              <div style={{ width: '50vw' }}>
                仓库数量：{items.stocknumber}
              </div>
              {
                items.stocknumber > 1
                &&
                <Space align='center'>
                  出库数量：
                  <NumberInput
                    precision={0}
                    className={(items.stocknumber < items.number || items.number <= 0) ? style.red : style.blue}
                    style={{
                      width: 100,
                    }}
                    type='amount'
                    value={outstockData.data[index].number}
                    onChange={(value) => {
                      if (items.stocknumber < value || value < 0) {
                        Toast.show({
                          content: '数量不符！',
                        });
                      }

                      const array = outstockData.data;
                      array[index] = { ...array[index], number: parseInt(value) };
                      setOutstockData({ data: array });
                    }} />
                </Space>
              }
            </Space>
          </Space>
        </Card>;
      })
    }

    <MyLoading
      loading={loading || outstockLoading}
      title={outstockLoading ? '出库中...' : '扫描中...'} />


    <BottomButton
      only={!getHeader()}
      leftText='扫码'
      rightText='出库'
      leftOnClick={() => {
        props.dispatch({
          type: 'qrCode/wxCpScan',
          payload: {
            action: 'freeOutstock',
          },
        });
      }}
      rightOnClick={async () => {
        const outstockNumber = outstockData.data.filter((items) => {
          return items.stocknumber < items.number || items.number <= 0;
        });

        if (outstockNumber.length > 0) {
          return Toast.show({
            content: '数量不符！',
          });
        }
        outstockRun({
          data: {
            batchOutStockParams:outstockData.data.map((items)=>{
              return {
                codeId: items.codeId,
                number: items.number,
              }
            }),
          },
        });
      }}
      onClick={() => {
        const outstockNumber = outstockData.data.filter((items) => {
          return items.stocknumber >= items.number || items.number > 0;
        });

        if (outstockNumber.length !== outstockData.data.length) {
          return Toast.show({
            content: '请填入正确的数量!',
            position: 'bottom',
          });
        }

        outstockRun({
          data: {
            type:'自由出库',
            batchOutStockParams:outstockData.data.map((items)=>{
              return {
                codeId: items.codeId,
                number: items.number,
              }
            }),
          },
        });
      }}
      text='出库'
    />
  </>;
};
export default connect(({ qrCode }) => ({ qrCode }))(FreeOutstock);
