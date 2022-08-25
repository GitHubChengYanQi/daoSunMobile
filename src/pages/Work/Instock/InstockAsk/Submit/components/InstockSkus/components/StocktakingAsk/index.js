import React, { useEffect, useState } from 'react';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import { useHistory } from 'react-router-dom';
import { useRequest } from '../../../../../../../../../util/Request';
import { Message } from '../../../../../../../../components/Message';
import Stocktaking from '../Stocktaking';
import MyNavBar from '../../../../../../../../components/MyNavBar';
import BottomButton from '../../../../../../../../components/BottomButton';
import { MyLoading } from '../../../../../../../../components/MyLoading';
import OtherData from '../OtherData';
import { ReceiptsEnums } from '../../../../../../../../Receipts';
import style from '../../../PurchaseOrderInstock/index.less';
import Title from '../../../../../../../../components/Title';
import MyCard from '../../../../../../../../components/MyCard';
import SelectSkus from './components/SelectSkus';
import MySwitch from '../../../../../../../../components/MySwitch';

export const InventoryApply = { url: '/inventory/InventoryApply', method: 'POST' };

const StocktakingAsk = ({ createType,backTitle }) => {

  const [params, setParams] = useState({});

  const history = useHistory();

  const { loading: inventoryLoading, run: inventory } = useRequest(InventoryApply, {
    manual: true,
    onSuccess: (res) => {
      history.push({
        pathname: '/Receipts/ReceiptsResult',
        state: {
          type: ReceiptsEnums.stocktaking,
          formId: res.inventoryTaskId,
        },
      });
    },
    onError: () => {
      Message.errorDialog({
        content: '创建盘点任务失败!',
      });
    },
  });

  useEffect(() => {
    setParams({ method: 'OpenDisc' });
  }, []);

  const createTypeData = (item = {}) => {
    const stocktakingDisabled = () => {
      if (!(params.userId && params.beginTime && params.endTime && params.method)) {
        return true;
      }

      if (params.all) {
        return false;
      } else if (ToolUtil.isArray(params.skuList).length === 0) {
        return true;
      }

      return false;
    };
    return {
      title: '盘点申请',
      type: '盘点',
      buttonHidden: true,
      disabled: stocktakingDisabled(),
    };
  };

  const stocktaskingAsk = () => {
    let data = {
      ...params,
      participants: ToolUtil.isArray(params.participants).map(item => item.id),
      notice: params.noticeIds,
      enclosure: params.mediaIds,
      userIds: ToolUtil.isArray(params.userIds).toString(),
    };
    const detailParams = [];
    if (params.all) {
      detailParams.push({ type: 'all' });
    } else {
      ToolUtil.isArray(params.skuList).forEach(item => {
        const params = item.params;
        if (!params) {
          detailParams.push({
            skuId: item.skuResult && item.skuResult.skuId,
            skuIds: item.skuResult && [item.skuResult.skuId],
            realNumber: item.skuNum || 1,
          });
          return;
        }

        const skuClasses = ToolUtil.isArray(params.skuClasses);
        const brands = ToolUtil.isArray(params.brands);
        const positions = ToolUtil.isArray(params.positions);
        const boms = ToolUtil.isArray(params.boms);
        detailParams.push({
          spuIds: params.spuId && [params.spuId],
          spuId: params.spuId && params.spuId,
          classIds: skuClasses.map(item => item.value),
          brandIds: brands.map(item => item.value),
          positionIds: positions.map(item => item.id),
          bomIds: boms.map(item => item.key),
          brandId: item.brandId || 0,
          skuId: item.skuResult && item.skuResult.skuId,
          realNumber: item.skuNum,
        });
      });
    }
    inventory({
      data: {
        ...data,
        detailParams,
      },
    });
  };


  return <div style={{ marginBottom: 60 }}>
    <MyNavBar title={createTypeData().title} />

    <MyCard
      title='全局'
      className={style.noPadding}
      headerClassName={style.cardHeader}
      bodyClassName={style.noPadding}
      extra={
        <MySwitch  checked={params.all} onChange={(checked) => {
          setParams({ ...params, all: checked, mode: checked ? 'staticState' : 'dynamic' });
        }}
        />
      }>
      {!params.all && <SelectSkus backTitle={backTitle} value={params.skuList} onChange={(skuList) => {
        setParams({ ...params, skuList });
      }} />}
    </MyCard>

    <Stocktaking value={params} onChange={setParams} />

    <OtherData
      createType={createType}
      careful={<Title>盘点原因</Title>}
      params={params}
      setParams={setParams}
    />

    <BottomButton
      leftOnClick={() => {
        history.goBack();
      }}
      rightText='提交'
      rightDisabled={createTypeData().disabled}
      rightOnClick={() => {
        stocktaskingAsk();
      }}
    />

    {(inventoryLoading) && <MyLoading />}

  </div>;
};

export default StocktakingAsk;
