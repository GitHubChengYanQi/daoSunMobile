import React, { useEffect, useState } from 'react';
import MyNavBar from '../../../../../../../../components/MyNavBar';
import OtherData from '../OtherData';
import BottomButton from '../../../../../../../../components/BottomButton';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import { MyLoading } from '../../../../../../../../components/MyLoading';
import { useModel } from 'umi';
import { useHistory } from 'react-router-dom';
import { useRequest } from '../../../../../../../../../util/Request';
import { productionPickListAdd } from '../../../../../../Url';
import { Message } from '../../../../../../../../components/Message';
import { ReceiptsEnums } from '../../../../../../../../Receipts';
import Skus from '../Skus';
import MyCard from '../../../../../../../../components/MyCard';
import Title from '../../../../../../../../components/Title';
import style from '../../../PurchaseOrderInstock/index.less';
import Careful from '../Careful';
import User from '../User';
import Icon from '../../../../../../../../components/Icon';

const AllocationAsk = ({ skus, createType }) => {

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
      title: '调拨申请',
      type: '调拨',
      otherData: [item.brandName || '任意品牌', <div>
        南坡大库 <Icon type='icon-iconset0438' style={{color:'var(--adm-color-primary)'}} /> 车间现场库
      </div>],
      careful: '注意事项',
      disabled: ToolUtil.isArray(params.noticeIds).length === 0 || !params.userId || normalSku.length === 0,
    };
  };

  return <>
    <div style={{ marginBottom: 60 }}>
      <MyNavBar title={createTypeData().title} />
      <MyCard titleBom={<Title className={style.title}>调拨缘由 <span>*</span></Title>}>
        <Careful
          type='allocationCareful'
          value={params.noticeIds}
          onChange={(noticeIds) => {
            setParams({ ...params, noticeIds });
          }}
        />
      </MyCard>
      <User title='负责人' id={params.userId} name={params.userName} onChange={(id, name) => {
        setParams({ ...params, userId: id, userName: name });
      }} />
      <Skus
        skus={skus}
        createTypeData={createTypeData}
        skuList={skuList}
        countNumber={countNumber}
        dataChange={dataChange}
      />

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

    </div>
  </>;
};

export default AllocationAsk;
