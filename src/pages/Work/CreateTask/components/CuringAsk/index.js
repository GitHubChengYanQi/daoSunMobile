import React, { useEffect, useState } from 'react';
import { ToolUtil } from '../../../../components/ToolUtil';
import { useHistory } from 'react-router-dom';
import { useRequest } from '../../../../../util/Request';
import { Message } from '../../../../components/Message';
import Curing from '../Curing';
import MyNavBar from '../../../../components/MyNavBar';
import BottomButton from '../../../../components/BottomButton';
import { MyLoading } from '../../../../components/MyLoading';
import { maintenanceAdd } from '../../index';
import OtherData from '../OtherData';
import { ReceiptsEnums } from '../../../../Receipts';
import Title from '../../../../components/Title';
import style from '../../../Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import MyCard from '../../../../components/MyCard';
import SelectSkus from '../StocktakingAsk/components/SelectSkus';

export const maintenanceViewDetail = { url: '/maintenance/viewDetail', method: 'POST' };

const CuringAsk = ({ createType, backTitle }) => {

  const [params, setParams] = useState({});

  const history = useHistory();

  const { loading: maintenanceLoading, run: maintenanceRun } = useRequest(maintenanceAdd, {
    manual: true,
    onSuccess: (res) => {
      history.push({
        pathname: '/Receipts/ReceiptsResult',
        state: {
          type: ReceiptsEnums.maintenance,
          formId: res.maintenanceId,
        },
      });
    },
    onError: () => {
      Message.errorDialog({
        content: '创建养护任务失败!',
      });
    },
  });

  const [skuView, setSkuView] = useState([]);

  const [skuTotal, setSkuTotal] = useState(0);

  const { loading: viewLoading, run: viewRun } = useRequest(maintenanceViewDetail, {
    manual: true,
    onSuccess: (res) => {
      const skuList = ToolUtil.isArray(res);
      let total = 0;
      skuList.forEach(item => {
        total += item.number;
      });
      setSkuView(skuList);
      setSkuTotal(total);
    },
  });

  const createTypeData = () => {
    const maintenanceDisabled = () => {
      if (!(params.userId && params.startTime && params.endTime)) {
        return true;
      }

      if (ToolUtil.isArray(params.skuList).length === 0) {
        return true;
      }
    };
    return {
      title: '养护申请明细',
      type: '养护',
      buttonHidden: true,
      disabled: maintenanceDisabled(),
    };
  };

  const getSelectParams = (skuList) => {
    const selectParams = [];

    ToolUtil.isArray(skuList).forEach(item => {
      const params = item.params;
      const skuResult = item.skuResult || {};
      if (!params) {
        if (ToolUtil.isArray(skuResult.inkindIds).length > 0) {
          selectParams.push({
            skuId: skuResult.skuId,
            inkindIds: skuResult.inkindIds,
            realNumber: skuResult.number,
          });
        } else {
          selectParams.push({
            skuId: skuResult.skuId,
            skuIds: skuResult.skuId && [skuResult.skuId],
            realNumber: item.skuNum || 1,
          });
        }
        return;
      }

      const materials = ToolUtil.isArray(params.materials);
      const skuClasses = ToolUtil.isArray(params.skuClasses);
      const brands = ToolUtil.isArray(params.brands);
      const newBrands = brands.filter(item => item.brandId);
      const positions = ToolUtil.isArray(params.positions);
      const boms = ToolUtil.isArray(params.boms);
      if (item.brandId) {
        newBrands.push(item.brandId);
      }
      selectParams.push({
        materialIds: materials.map(item => item.value),
        spuClassificationIds: skuClasses.map(item => item.value),
        brandIds: newBrands,
        storehousePositionsIds: positions.map(item => item.id),
        partsIds: boms.map(item => item.key),
        spuIds: params.spuId && [params.spuId],
        brandId: item.brandId || 0,
        skuId: skuResult.skuId,
        realNumber: item.skuNum,
      });
    });
    return selectParams;
  };

  const curingAsk = () => {


    let data = {
      ...params,
      notice: ToolUtil.isArray(params.noticeIds).toString(),
      enclosure: ToolUtil.isArray(params.mediaIds).toString(),
      userIds: ToolUtil.isArray(params.userIds).toString(),
      note: params.remark,
      selectParams: getSelectParams(params.skuList),
    };
    maintenanceRun({
      data,
    });
  };


  return <div style={{ marginBottom: 60 }}>
    <MyNavBar title={createTypeData().title} />
    <MyCard
      title='添加养护内容'
      className={style.noPadding}
      headerClassName={style.cardHeader}
      bodyClassName={style.noPadding}>
      <SelectSkus backTitle={backTitle} inkind value={params.skuList} onChange={(skuList) => {
        viewRun({ data: { selectParams: getSelectParams(skuList), nearMaintenance: params.nearMaintenance } });
        setParams({ ...params, skuList });
      }} />
    </MyCard>

    <Curing
      skuView={skuView}
      skuTotal={skuTotal}
      value={params}
      onChange={setParams}
      nearMaintenanceChange={(nearMaintenance) => {
        viewRun({ data: { selectParams: getSelectParams(params.skuList), nearMaintenance } });
      }} />

    <OtherData
      createType={createType}
      careful={<Title className={style.title}>养护原因</Title>}
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
        curingAsk();
      }}
    />

    {(maintenanceLoading || viewLoading) && <MyLoading />}

  </div>;
};

export default CuringAsk;
