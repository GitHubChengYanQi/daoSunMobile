import React, { ReactNode, useEffect, useState } from 'react';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import { useHistory } from 'react-router-dom';
import { useRequest } from '../../../../../../../../../util/Request';
import { productionPickListAdd } from '../../../../../../Url';
import { Message } from '../../../../../../../../components/Message';
import Skus from '../Skus';
import User from '../User';
import MyNavBar from '../../../../../../../../components/MyNavBar';
import BottomButton from '../../../../../../../../components/BottomButton';
import { MyLoading } from '../../../../../../../../components/MyLoading';
import { useModel } from 'umi';
import OtherData from '../OtherData';
import { Dialog } from 'antd-mobile';
import { ReceiptsEnums } from '../../../../../../../../Receipts';

const OutstockAsk = ({ skus, judge, createType }) => {

  const { initialState } = useModel('@@initialState');
  const userInfo = ToolUtil.isObject(initialState).userInfo || {};

  const [data, setData] = useState([]);

  const [params, setParams] = useState({});

  const history = useHistory();

  const normalSku = [];

  let countNumber = 0;

  const skuList = data.map((item, index) => {
    if (item.number > 0) {
      countNumber += (item.number || 0);
      normalSku.push(item);
    }
    return { ...item, key: index };
  });

  const { loading: outLoading, run: outStock } = useRequest(productionPickListAdd, {
    manual: true,
    onSuccess: (res) => {
      Message.successDialog({
        content: '创建出库申请成功!',
        confirmText: '查看详情',
        cancelText: '返回列表',
        onCancel: () => history.goBack(),
        onConfirm: () => {
          history.push(`/Receipts/ReceiptsDetail?type=${ReceiptsEnums.outstockOrder}&formId=${res.pickListsId}`);
        },
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
    setParams({ userId: userInfo.id, userName: userInfo.name });
    dataChange(skus);
  }, []);

  const createTypeData = (item = {}) => {
    return {
      title: '出库申请',
      type: '出库',
      otherData: [item.brandName || '任意品牌'],
      careful: '注意事项',
      disabled: ToolUtil.isArray(params.noticeIds).length === 0 || !params.userId || normalSku.length === 0,
    };
  };


  const content = () => {
    return <>
      <Skus
        skus={skus}
        createTypeData={createTypeData}
        judge={judge}
        skuList={skuList}
        countNumber={countNumber}
        dataChange={dataChange}
      />
      <User title='领料负责人' id={params.userId} name={params.userName} onChange={(id, name) => {
        setParams({ ...params, userId: id, userName: name });
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
        const pickListsDetailParams = [];
        normalSku.map(item => {
          pickListsDetailParams.push(item);
          return null;
        });
        outStock({
          data: {
            source: 'outstock',
            pickListsDetailParams,
            enclosure: ToolUtil.isArray(params.mediaIds).toString(),
            remarks: ToolUtil.isArray(params.noticeIds).toString(),
            note: params.remark,
            userIds: ToolUtil.isArray(params.userIds).toString(),
            userId: params.userId,
          },
        });
      }}
    />

    {
      (outLoading) && <MyLoading />
    }

  </div>;

};

export default OutstockAsk;
