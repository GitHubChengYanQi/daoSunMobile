import React, { useEffect, useRef, useState } from 'react';
import { Card, List, Stepper, Toast } from 'antd-mobile';
import BottomButton from '../../../components/BottomButton';
import { getHeader } from '../../../components/GetHeader';
import Search from '../../InStock/FreeInstock/components/Search';
import MyTreeSelect from '../../../components/MyTreeSelect';
import { Typography } from 'antd';
import { storehousePositionsTreeView } from '../../Url';
import { useRequest } from '../../../../util/Request';
import { useDebounceEffect } from 'ahooks';
import { connect } from 'dva';
import { MyLoading } from '../../../components/MyLoading';

const FreeOutstock = (props) => {

  const [data, setData] = useState({
    storehouse: {},
    storehousepostionId: null,
    brand: {},
    item: {},
  });

  const [number, setNumber] = useState(1);

  const ref = useRef();
  const treeRef = useRef();

  const codeId = props.qrCode && props.qrCode.codeId;

  const clearCode = () => {
    props.dispatch({
      type: 'qrCode/clearCode',
    });
  };

  const clear = () => {
    setData({
      storehouse: {},
      storehousepostionId: null,
      brand: {},
      item: {},
    });
    setNumber(1);
  };

  const { loading: outstockLoading, run: outstockRun } = useRequest({
    url: '/outstockOrder/freeOutStock',
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
        case 'storehousePositions':
          if (res.result && res.result.storehouseResult) {
            setData({
              ...data,
              storehouse: {
                label: res.result.storehouseResult.name,
                value: res.result.storehouseResult.storehouseId,
              },
              storehousepostionId: res.result.storehousePositionsId,
              item: {},
            });
          }
          break;
        case 'item':
          if (
            res.inkindResult
            &&
            res.inkindResult
            &&
            res.inkindResult.inkindDetail
          ) {
            setData({
              brand: {
                label: res.inkindResult.brand.brandName,
                value: res.inkindResult.brand.brandId,
              },
              storehouse: {
                label: res.inkindResult.inkindDetail.storehouse.name,
                value: res.inkindResult.inkindDetail.storehouse.storehouseId,
              },
              storehousepostionId: res.inkindResult.inkindDetail.storehousePositions.storehousePositionsId,
              item: {
                label: getSkuResult(res.inkindResult.skuResult),
                value: res.inkindResult.inkindDetail.stockDetails.qrCodeid,
                number: res.inkindResult.inkindDetail.stockDetails.number,
              },
            });
          }
          break;
        default:
          Toast.show({
            content: '请扫库位码或物料码！',
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

  useEffect(() => {
    if (data.storehouse.value)
      treeRef.current.run({
        params: {
          ids: data.storehouse.value,
        },
      });
  }, [data.storehouse.value]);

  return <>
    <Card title='物料信息' />
    {/*<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIAQAAAACFI5MzAAACDElEQVR42tWYQW6FMAxEjViwzBFyk3IxJJC4GNwkR2CZBcKdcaD9UvW305ZFBDwWVjweO5i/u+wvk8twjUdf7MP6UrF45SshSe51PCwPl025jn5y8aIkiyEiBLP7acOVVmeAejL7sCWEhW/yr5C0Fsdd9i15kRPk5yOdDf/InIJQkPHye3lRr4BETV42l9ohLNzH8lXBAsL8oE4nA1lZrDNj64UEwRjEgWWjUP3ouUxZR+gPyM+S8TwXYOPjaUoSNmUMEFvSQZ7tGyHpQ5mOJM1eO2TKDDnTET8MHglJhF8PdIphp1B1xBfK0wtCmstArcSdjlxh1aELvrLEb26FqIgZuibKAmE1oVajc8sI8sOXq6Nrrm1yGPzJnIYwNXQobk2OGQLFOpmWOGUCZS7sHTHKNO3oCCeH0iYHxhZlqyNXDA20zNHvycFvv1YRFghTg5cc3djCnjpVEXRIFghL1GOECsPSERQm+wQ2Zm99Gx388WsNCX/YkZAWm/vKOm2zi4o4Dy84y8SBhpnC7iymJNgYijJKFPtE17rVqyJ4Dq8Kf9iPaBuLkLQZFkly9g7ahXGkdR15zrQOmbBvt1FmMSGJswxqozVvu61LSu4TZWWVcIRiflaXE4TVHW1jYorOasLbjX8WODmgaF5OuwLCRk2H4p8FFmtrokISZ9o4UcIf2vKiXgH5n//f3pJPsjydwloXIwIAAAAASUVORK5CYII=' alt='' />*/}
    <List>
      <List.Item title='仓库'>
        <Typography.Link underline onClick={() => {
          ref.current.search({ type: 'storehouse' });
        }}>
          {
            data.storehouse.label || '请选择仓库'
          }
        </Typography.Link>
      </List.Item>
      <List.Item title='库位'>
        <MyTreeSelect
          arrow={false}
          ref={treeRef}
          branch={!data.storehouse.value}
          poputTitle='选择库位'
          branchText='请选择仓库或直接扫码选择库位'
          textType='link'
          resh={data.storehouse.value}
          title={<Typography.Link underline>选择库位</Typography.Link>}
          value={data.storehousepostionId}
          api={storehousePositionsTreeView}
          onChange={(value) => {
            setData({ ...data, storehousepostionId: value });
          }}
        />
      </List.Item>
      <List.Item title='供应商(品牌)'>
        <Typography.Link underline onClick={() => {
          ref.current.search({ type: 'brand' });
        }}>
          {
            data.brand.label || '请选择供应商(品牌)'
          }
        </Typography.Link>
      </List.Item>
      <List.Item title='物料' extra={data.item.number && <>
        ×
        {
          data.item.number
        }
      </>}>
        <Typography.Link underline onClick={() => {
          ref.current.search({
            type: 'items', params: {
              storehousePositionsId: data.storehousepostionId,
              storehouseId: data.storehouse.value,
              brandId: data.brand.value,
            },
          });
        }}>
          {
            data.item.label || '请选择物料'
          }
        </Typography.Link>
      </List.Item>
      {data.item.number > 1
      &&
      <List.Item
        title='出库数量'
        extra={
          <Stepper
            min={1}
            max={data.item.number}
            value={number}
            onChange={value => {
              setNumber(value);
            }}
          />
        }
      />}
    </List>

    <Search ref={ref} onChange={(value) => {
      switch (value.type) {
        case 'brand':
          setData({ ...data, brand: value, item: {} });
          break;
        case 'storehouse':
          setData({ ...data, storehouse: value, storehousepostionId: null, item: {} });
          break;
        case 'items':
          setData({ ...data, item: value });
          break;
        default:
          break;
      }
    }} />

    <MyLoading
      loading={loading || outstockLoading}
      title={outstockLoading ? '出库中...' : '扫描中...'} />


    <BottomButton
      only={!getHeader()}
      leftText='扫码'
      rightText='出库'
      disabled={!data.item.value}
      rightDisabled={!data.item.value}
      leftOnClick={() => {
        props.dispatch({
          type: 'qrCode/wxCpScan',
          payload: {
            action: 'freeOutstock',
          },
        });
      }}
      rightOnClick={() => {
        outstockRun({
          data: {
            codeId: data.item.value,
            number,
          },
        });
      }}
      onClick={() => {
        outstockRun({
          data: {
            codeId: data.item.value,
            number,
          },
        });
      }}
      text='出库'
    />
  </>;
};
export default connect(({ qrCode }) => ({ qrCode }))(FreeOutstock);
