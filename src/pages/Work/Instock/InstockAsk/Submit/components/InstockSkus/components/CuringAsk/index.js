import React, { useEffect, useState } from 'react';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import { useHistory } from 'react-router-dom';
import { useRequest } from '../../../../../../../../../util/Request';
import { Message } from '../../../../../../../../components/Message';
import Curing from '../Curing';
import MyNavBar from '../../../../../../../../components/MyNavBar';
import BottomButton from '../../../../../../../../components/BottomButton';
import { MyLoading } from '../../../../../../../../components/MyLoading';
import { maintenanceAdd } from '../../index';
import OtherData from '../OtherData';
import { ReceiptsEnums } from '../../../../../../../../Receipts';
import Title from '../../../../../../../../components/Title';
import style from '../../../PurchaseOrderInstock/index.less';
import MyCard from '../../../../../../../../components/MyCard';
import SelectSkus from '../StocktakingAsk/components/SelectSkus';

const CuringAsk = ({ createType, state }) => {

  const [params, setParams] = useState({});
  console.log(params);

  const history = useHistory();

  const { loading: maintenanceLoading, run: maintenanceRun } = useRequest(maintenanceAdd, {
    manual: true,
    onSuccess: (res) => {

      Message.successDialog({
        content: '创建养护申请成功!',
        confirmText: '查看详情',
        cancelText: '返回列表',
        onCancel: () => history.goBack(),
        onConfirm: () => {
          history.push(`/Receipts/ReceiptsDetail?type=${ReceiptsEnums.maintenance}&formId=${res.maintenanceId}`);
        },
      });
    },
  });

  useEffect(() => {
    setParams({ ...ToolUtil.isObject(state.data) });
  }, []);

  const createTypeData = () => {
    const maintenanceDisabled = () => {
      if (!(params.userId && params.startTime && params.endTime && params.nearMaintenance && params.type && ToolUtil.isArray(params.noticeIds).length > 0)) {
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

  const curingAsk = () => {
    const selectParams = [];
    ToolUtil.isArray(params.skuList).forEach(item => {
      const params = item.params || {};

      const materials = ToolUtil.isArray(params.materials);
      const skuClasses = ToolUtil.isArray(params.skuClasses);
      const brands = ToolUtil.isArray(params.brands);
      const positions = ToolUtil.isArray(params.positions);
      const bom = ToolUtil.isObject(params.bom);
      selectParams.push({
        materialIds: materials.map(item => item.value),
        spuClassificationIds: skuClasses.map(item => item.value),
        brandIds: brands.map(item => item.value),
        storehousePositionsIds: positions.map(item => item.id),
        partsIds: bom.key && [bom.key],
      });
    });

    let data = {
      ...params,
      notice: params.noticeIds,
      enclosure: params.mediaIds,
      userIds: ToolUtil.isArray(params.userIds).toString(),
      note: params.remark,
      selectParams,
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
      <SelectSkus noChecked value={params.skuList} onChange={(skuList) => {
        setParams({ ...params, skuList });
      }} />
    </MyCard>

    <Curing value={params} onChange={setParams} />

    <OtherData
      createType={createType}
      careful={<Title className={style.title}>养护缘由 <span>*</span></Title>}
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

    {(maintenanceLoading) && <MyLoading />}

  </div>;
};

export default CuringAsk;
