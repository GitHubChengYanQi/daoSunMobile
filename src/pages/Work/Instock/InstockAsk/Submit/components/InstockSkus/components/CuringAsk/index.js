import React, { useEffect, useState } from 'react';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import { useHistory } from 'react-router-dom';
import { useRequest } from '../../../../../../../../../util/Request';
import { Message } from '../../../../../../../../components/Message';
import Curing from '../Curing';
import Condition from '../../../../../../../ProcessTask/Create/components/Inventory/compoennts/Condition';
import MyNavBar from '../../../../../../../../components/MyNavBar';
import BottomButton from '../../../../../../../../components/BottomButton';
import { MyLoading } from '../../../../../../../../components/MyLoading';
import { maintenanceAdd } from '../../index';
import OtherData from '../OtherData';
import { ReceiptsEnums } from '../../../../../../../../Receipts';

const CuringAsk = ({ createType, state }) => {

  const [params, setParams] = useState({});

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

  const createTypeData = (item = {}) => {
    const maintenanceDisabled = () => {
      if (!(params.userId && params.startTime && params.endTime && params.nearMaintenance && params.type && ToolUtil.isArray(params.noticeIds).length > 0)) {
        return true;
      }

      const conditions = params.conditions || [];
      if (conditions.length === 0) {
        return true;
      }

      const newConditions = conditions.filter(item => item.data && item.data.key);
      return newConditions.length !== conditions.length;
    };
    return {
      title: '养护申请明细',
      type: '养护',
      careful: '养护缘由',
      buttonHidden: true,
      disabled: maintenanceDisabled(),
    };
  };

  const curingAsk = () => {
    let data = {
      ...params,
      notice: params.noticeIds,
      enclosure: params.mediaIds,
      userIds: ToolUtil.isArray(params.userIds).toString(),
      note: params.remark,
    };
    ToolUtil.isArray(params.conditions).map(item => {
      const dataValue = item.data || {};
      switch (item.value) {
        case 'material':
          data = {
            ...data,
            materialId: dataValue.key,
          };
          break;
        case 'brand':
          data = {
            ...data,
            brandId: dataValue.key,
          };
          break;
        case 'position':
          data = {
            ...data,
            storehousePositionsId: dataValue.key,
          };
          break;
        default:
          return [];
      }
      return null;
    });

    maintenanceRun({
      data,
    });
  };

  const content = () => {
    return <>
      <Curing value={params} onChange={setParams} />
      <Condition noTime type={createType} paddingBottom={3} value={params} onChange={(value) => {
        setParams(value);
      }} />
    </>;
  };

  return <div style={{ marginBottom: 60 }}>
    <MyNavBar title={createTypeData().title} />
    {content()}

    <OtherData createType={createType} careful={createTypeData().careful} params={params} setParams={setParams} />

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
