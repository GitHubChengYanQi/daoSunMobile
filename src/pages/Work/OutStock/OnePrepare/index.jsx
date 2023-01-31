import React, { useImperativeHandle, useState } from 'react';
import { Divider, Popup } from 'antd-mobile';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import { useBoolean } from 'ahooks';
import { ToolUtil } from '../../../../util/ToolUtil';
import { useRequest } from '../../../../util/Request';
import MySearch from '../../../components/MySearch';
import Icon from '../../../components/Icon';
import { SkuResultSkuJsons } from '../../../Scan/Sku/components/SkuResult_skuJsons';
import { MyLoading } from '../../../components/MyLoading';
import MyEmpty from '../../../components/MyEmpty';
import OutSkuItem
  from '../../../Receipts/ReceiptsDetail/components/ReceiptData/components/OutStockOrder/components/OutSkuAction/compoennts/OutSkuItem';
import Viewpager
  from '../../../Receipts/ReceiptsDetail/components/ReceiptData/components/InstockOrder/components/Viewpager';
import style from '../../Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import MyPositions from '../../../components/MyPositions';
import Prepare
  from '../../../Receipts/ReceiptsDetail/components/ReceiptData/components/OutStockOrder/components/Prepare';

export const checkCode = { url: '/productionPickLists/checkCode', method: 'GET' };
export const outDetailList = { url: '/productionPickListsDetail/noPageList', method: 'POST' };

const OnePrepare = (
  {
    action,
    pickListsId,
    taskId,
    positionIds,
    shopRef,
  }, ref) => {

  const format = (list = []) => {
    let countNumber = 0;
    const actions = [];
    const noAction = [];
    const other = [];

    list.map(item => {
      let perpareNumber = 0;
      ToolUtil.isArray(item.cartResults).map(item => perpareNumber += item.number);

      const received = Number(item.receivedNumber) || 0;
      const collectable = Number(perpareNumber) || 0;
      const notPrepared = Number(item.number - collectable - received) || 0;


      if (item.number > received){
        if (item.number === (received + collectable) || !item.stockNumber) {
          if (notPrepared > 0) {
            other.push({ ...item, perpareNumber, received, collectable, notPrepared });
          } else {
            noAction.push({ ...item, perpareNumber, received, collectable, notPrepared });
          }
        } else {
          actions.push({ ...item, perpareNumber, received, collectable, notPrepared, action: true });
        }
      }
      return countNumber += (item.number || 0);
    });
    return {
      countNumber,
      array: [
        ...actions,
        ...other.sort((a, b) => {
          return a.notPrepared - b.notPrepared;
        }),
        ...noAction,
      ],
    };
  };

  const [data, setData] = useState([]);

  const [defaultData, setDefaultData] = useState([]);

  const [params, setParams] = useState({ pickListsId });

  const { loading, run: getOutDetail, refresh } = useRequest({
    ...outDetailList,
    data: params,
  }, {
    onSuccess: (res) => {
      const { array } = format(ToolUtil.isArray(res));
      setData(array);
      setDefaultData(array);
    },
  });

  const [visible, setVisible] = useState();

  const [positionVisible, setPositionVisible] = useState();

  const [allSku, { toggle }] = useBoolean();
  const [seacrchValue, setSearchValue] = useState();

  useImperativeHandle(ref, () => ({
    refresh,
  }));

  return <div style={{ backgroundColor: '#fff', padding: '12px 0' }}>
    <MySearch
      extraIcon={<Icon
        style={{ fontSize: 20 }}
        type='icon-pandiankuwei1'
        onClick={() => {
          setPositionVisible(true);
        }} />}
      placeholder='请输入物料名称查询'
      style={{ padding: '8px 12px' }}
      onClear={() => setData(defaultData)}
      onChange={(value) => {
        const newData = defaultData.filter(item => {
          const sku = SkuResultSkuJsons({ skuResult: item.skuResult }) || '';
          return ToolUtil.queryString(value, sku);
        });
        setData(newData);
        setSearchValue(value);
      }}
      value={seacrchValue}
    />
    <MyLoading noLoadingTitle title='正在刷新数据，请稍后...' loading={loading}>
      {defaultData.length === 0 &&
      <MyEmpty description={`物料全部出库完成`} image={<Icon style={{ fontSize: 45 }} type='icon-chukuchenggong' />} />}
      {defaultData.length !== 0 && data.length === 0 && <MyEmpty description={`没有找到相关物料`} />}
      {
        data.map((item, index) => {

          if (!allSku && index >= 3) {
            return null;
          }

          if (!action || !item.action) {
            return <OutSkuItem
              item={item}
              index={index}
              dataLength={(data.length > 3 && !allSku) ? 2 : data.length - 1}
              key={index}
            />;
          }

          return <div key={index}>
            <Viewpager
              currentIndex={index}
              onLeft={() => {
                setVisible(item);
              }}
              onRight={() => {
                setVisible(item);
              }}
            >
              <OutSkuItem
                item={item}
                index={index}
                dataLength={(data.length > 3 && !allSku) ? 2 : data.length - 1}
                key={index}
              />
            </Viewpager>
          </div>;
        })
      }
      {data.length > 3 && <Divider className={style.allSku}>
        <div onClick={() => {
          toggle();
        }}>
          {
            allSku ?
              <UpOutline />
              :
              <DownOutline />
          }
        </div>
      </Divider>}
    </MyLoading>

    <Popup
      getContainer={null}
      onMaskClick={() => setVisible(false)}
      visible={visible}
      destroyOnClose
    >
      <Prepare
        taskId={taskId}
        id={pickListsId}
        skuItem={visible}
        dimension='order'
        onSuccess={() => {
          refresh();
          shopRef.current.jump();
        }}
        onClose={() => {
          setVisible(false);
        }}
      />
    </Popup>

    <MyPositions
      title='相关库位'
      showPositionIds={positionIds}
      showAll
      empty
      visible={positionVisible}
      single
      autoFocus
      value={params.positionId ? [{ id: params.positionId }] : []}
      onClose={() => setPositionVisible(false)}
      onSuccess={(value = []) => {
        const positions = value[0] || {};
        setParams({ ...params, positionId: positions.id });
        getOutDetail({ data: { ...params, storehousePositionsId: positions.id } });
        setPositionVisible(false);
      }} />

  </div>;
};

export default React.forwardRef(OnePrepare);
