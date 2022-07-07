import React, { useEffect, useState } from 'react';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import { useHistory } from 'react-router-dom';
import { useRequest } from '../../../../../../../../../util/Request';
import { Message } from '../../../../../../../../components/Message';
import Condition from '../../../../../../../ProcessTask/Create/components/Inventory/compoennts/Condition';
import Stocktaking from '../Stocktaking';
import Skus from '../Skus';
import User from '../User';
import MyNavBar from '../../../../../../../../components/MyNavBar';
import BottomButton from '../../../../../../../../components/BottomButton';
import { MyLoading } from '../../../../../../../../components/MyLoading';
import { inventoryAdd, inventorySelectCondition } from '../../index';
import OtherData from '../OtherData';

const StocktakingAsk = ({ state, skus, createType }) => {

  const [data, setData] = useState([]);

  const [params, setParams] = useState({});

  const history = useHistory();

  const skuList = data.map((item, index) => {
    return { ...item, key: index };
  });

  const { loading: inventoryLoading, run: inventory } = useRequest(inventoryAdd, {
    manual: true,
    onSuccess: () => {
      Message.successToast('创建盘点单成功!',()=>{
        history.goBack();
      });
    },
  });


  const { loading: inventoryConditionLoading, run: inventoryCondition } = useRequest(inventorySelectCondition, {
    manual: true,
    onSuccess: () => {
      Message.successToast('创建盘点单成功!',()=>{
        history.goBack();
      });
    },
  });

  const dataChange = (array = []) => {
    if (array.length === 0) {
      if (history.length <= 2) {
        history.push('/');
      } else {
        history.goBack();
      }
    }
    setData(array);
  };


  useEffect(() => {
    setParams({ method: 'OpenDisc', mode: 'dynamic', ...ToolUtil.isObject(state.data) });
    if (!state.condition) {
      dataChange(skus);
    }
  }, []);

  const createTypeData = (item = {}) => {
    const stocktakingDisabled = () => {
      if (!(params.userId && params.beginTime && params.endTime && params.method && params.mode && params.participantsId && ToolUtil.isArray(params.noticeIds).length > 0)) {
        return true;
      }

      if (!state.condition) {
        return skuList.length <= 0;
      }
      const conditions = params.conditions || [];
      if (conditions.length === 0) {
        return true;
      }

      const newConditions = conditions.filter(item => item.data && item.data.key);
      return newConditions.length !== conditions.length;
    };
    return {
      title: '盘点申请明细',
      type: '盘点',
      careful: '盘点缘由',
      buttonHidden: true,
      disabled: stocktakingDisabled(),
    };
  };

  const stocktaskingAsk = () => {
    let data = {
      ...params,
      participants: [params.participantsId],
      notice: params.noticeIds,
      enclosure: params.mediaIds,
      userIds: ToolUtil.isArray(params.userIds).toString(),
    };
    if (state.condition) {
      ToolUtil.isArray(params.conditions).map(item => {
        const dataValue = item.data || {};
        switch (item.value) {
          case 'sys':
            data = {
              ...data,
              allSku: dataValue.key === 'all',
              AllBom: dataValue.key === 'bom',
            };
            break;
          case 'material':
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
              positionId: dataValue.key,
            };
            break;
          default:
            return [];
        }
        return null;
      });

      inventoryCondition({
        data,
      });
    } else {
      inventory({
        data: {
          ...data,
          detailParams: skuList.map(item => {
            return {
              skuId: item.skuId,
            };
          }),
        },
      });
    }
  };


  const content = () => {
    return <>
      <Stocktaking value={params} onChange={setParams} />
      {state.condition ?
        <Condition noTime type={createType} paddingBottom={3} value={params} onChange={(value) => {
          setParams(value);
        }} />
        :
        <Skus
          skus={skus}
          createTypeData={createTypeData}
          skuList={skuList}
          dataChange={dataChange}
        />}
      <User title='参与人' id={params.participantsId} name={params.participantsName} onChange={(id, name) => {
        setParams({ ...params, participantsId: id, participantsName: name });
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
        stocktaskingAsk();
      }}
    />

    {(inventoryLoading || inventoryConditionLoading) && <MyLoading />}

  </div>;
};

export default StocktakingAsk;
