import React, { useEffect, useRef } from 'react';
import { Card, List, Selector, Toast } from 'antd-mobile';
import BottomButton from '../../../../../components/BottomButton';
import { getHeader } from '../../../../../components/GetHeader';
import { stockDetailsList, storehousePositionsTreeView } from '../../../../Url';
import { useRequest } from '../../../../../../util/Request';
import { useSetState } from 'ahooks';
import { connect } from 'dva';
import { MyLoading } from '../../../../../components/MyLoading';
import { ScanOutlined } from '@ant-design/icons';
import LinkButton from '../../../../../components/LinkButton';
import Number from '../../../../../components/Number';
import MyCascader from '../../../../../components/MyCascader';
import BackSkus from '../../../../Sku/components/BackSkus';
import MyEmpty from '../../../../../components/MyEmpty';
import Search from '../../../../InStock/PositionFreeInstock/components/Search';

const fontSize = 18;

const Position = ({scnaData,...props}) => {

  const [inkindIds, setInkindIds] = useSetState({ data: [] });

  const treeRef = useRef();
  const ref = useRef();

  const [data, setData] = useSetState({
    storehouse: {},
    positionId: null,
    skus: [],
  });

  const options = data.skus.map((item, index) => {
    return {
      value: item.inkindId,
      label: <Card
        key={index}
        bodyStyle={{ padding: 0 }}
        title={<div style={{ fontSize,textAlign:'left',display:'inline-block'}}><BackSkus record={item} /> </div>}
        extra={<div
          style={{
            minWidth:80,
            padding: 8,
            border: 'solid #999999 1px',
            borderRadius: 10,
            display: 'inline-block',
          }}
        >
          库存:{item.number}
        </div>}
      >
        <List
          style={{
            '--border-top': 'none',
          }}
        >
          <List.Item
            title='供应商'
            style={{ padding: 0 }}
          >
            <span style={{ fontSize }}>
              {item.customerResult && item.customerResult.customerName}
            </span>
          </List.Item>
          <List.Item
            title='品牌'
            style={{ padding: 0 }}
          >
            <span style={{ fontSize }}>{item.brandResult && item.brandResult.brandName}</span>
          </List.Item>
          <List.Item
            title='出库数量'
            style={{ padding: 0 }}
          >
            <Number
              center
              buttonStyle={{ width: '100%' }}
              color={(item.number < item.outNumber || item.outNumber <= 0) ? 'red' : 'blue'}
              width={100}
              value={item.outNumber}
              onChange={(value) => {
                if (item.number >= value && value > 0) {
                  setInkindIds({ data: [...inkindIds.data, item.inkindId] });
                } else {
                  const array = inkindIds.data.filter((value) => {
                    return value !== item.inkindId;
                  });
                  setInkindIds({ data: array });
                }

                const array = data.skus;
                array[index] = { ...array[index], outNumber: value };
                setData({ ...data, skus: array });
              }} />
          </List.Item>
        </List>
      </Card>,
    };
  });

  const clear = () => {
    setInkindIds({ data: [] });
    setData({
      storehouse: {},
      positionId: null,
      skus: [],
    });
  };

  const { loading: detailLoading, run: detailRun } = useRequest(stockDetailsList, {
    manual: true,
    onSuccess: (res) => {
      setInkindIds({ data: [] });
      setData({
        ...data, skus: res.map((item) => {
          return { ...item, outNumber: 0 };
        }) || [],
      });
    },
  });

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
    },
  });

  useEffect(()=>{
    if (scnaData){
      if (scnaData && scnaData.storehouseResult) {
        setData({
          ...data,
          storehouse: {
            label: scnaData.storehouseResult.name,
            value: scnaData.storehouseResult.storehouseId,
          },
          positionId: scnaData.storehousePositionsId,
        });
      }
      detailRun({
        data: {
          storehousePositionsId: scnaData.storehousePositionsId,
        },
      });
    }
  },[scnaData])


  return <>
    <Card
      title='库位信息'
      extra={getHeader() && <LinkButton
        title={<ScanOutlined />} onClick={() => {
        props.dispatch({
          type: 'qrCode/wxCpScan',
          payload: {
            action: 'freeOutstock',
          },
        });
      }} />}
    >
      <List
        style={{
          '--border-top': 'none',
          '--border-bottom': 'none',
        }}
      >
        <List.Item title='仓库'>
          <LinkButton
            style={{ width: '100vw', fontSize, textAlign: 'left', color: !data.storehouse.value && 'red' }}
            title={
              data.storehouse.label || '请选择仓库'
            } onClick={() => {
            ref.current.search({ type: 'storehouse' });
          }} />
        </List.Item>
        <List.Item title='库位'>
          <MyCascader
            arrow={false}
            ref={treeRef}
            disabled={!data.storehouse.value}
            poputTitle='选择库位'
            branchText='请选择仓库或直接扫码选择库位'
            textType='link'
            title={
              <LinkButton
                style={{ width: '100vw', fontSize, textAlign: 'left', color: !data.postionId && 'red' }}
                title='选择库位'
              />
            }
            value={data.positionId}
            api={storehousePositionsTreeView}
            onChange={(value) => {
              if (value && value !== data.positionId) {
                detailRun({
                  data: {
                    storehousePositionsId: value,
                  },
                });
                setData({ ...data, positionId: value });
              }
            }}
          />
        </List.Item>
      </List>
    </Card>

    {
      options.length > 0
        ?
        <div style={{ padding: 8, paddingBottom: '10vh' }}>
          <Selector
            value={inkindIds.data}
            columns={1}
            options={options || []}
            multiple
          />
        </div>
        :
        <div style={{ marginTop: 16 }}>
          <MyEmpty description='暂无物料' />
        </div>
    }

    <Search ref={ref} onChange={async (value) => {
      switch (value.type) {
        case 'storehouse':
          treeRef.current.run({
            params: {
              ids: value.value,
            },
          });
          setData({ ...data, storehouse: value });
          break;
        default:
          break;
      }
    }}
    />

    <BottomButton
      only
      disabled={inkindIds.data.length === 0}
      onClick={() => {

        const outInkinds = data.skus.filter((items) => {
          return inkindIds.data.includes(items.inkindId);
        });

        const outstockNumber = outInkinds.filter((items) => {
          return items.number >= items.outNumber && items.outNumber > 0;
        });

        if (outstockNumber.length !== outInkinds.length) {
          return Toast.show({
            content: '请检查数量!',
            position: 'bottom',
          });
        }

        outstockRun({
          data: {
            type: '自由出库',
            batchOutStockParams: outInkinds.map((items) => {
              return {
                inkindId: items.inkindId,
                codeId: items.qrCodeId,
                number: items.outNumber,
              };
            }),
          },
        });

      }}
      text='出库'
    />

    {(outstockLoading || detailLoading) && <MyLoading />}

  </>;
};
export default connect(({ qrCode }) => ({ qrCode }))(Position);
