import React, { useEffect, useState } from 'react';
import { ToolUtil } from '../../../../components/ToolUtil';
import { useHistory } from 'react-router-dom';
import { useRequest } from '../../../../../util/Request';
import { productionPickListAdd } from '../../../Instock/Url';
import { Message } from '../../../../components/Message';
import Skus from '../Skus';
import User from '../User';
import MyNavBar from '../../../../components/MyNavBar';
import BottomButton from '../../../../components/BottomButton';
import { MyLoading } from '../../../../components/MyLoading';
import { useModel } from 'umi';
import OtherData from '../OtherData';
import { ReceiptsEnums } from '../../../../Receipts';
import Title from '../../../../components/Title';
import style from '../../../Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import MyCard from '../../../../components/MyCard';
import { Input } from 'antd-mobile';

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
      history.push({
        pathname: '/Receipts/ReceiptsResult',
        state: {
          type: ReceiptsEnums.outstockOrder,
          formId: res.pickListsId,
        },
      });
    },
    onError: () => {
      Message.errorDialog({
        content: '创建出库任务失败!',
      });
    },
  });

  const dataChange = (array = []) => {
    if (array.length === 0) {
      if (history.length <= 2) {
        history.push('/');
      } else {
        history.go(-2);
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
      <MyCard title='主题' extra={<Input
        className={style.theme}
        placeholder='请输入'
        onChange={(theme) => setParams({ ...params, theme })} />}
      />
      <User
        title='领料负责人'
        value={params.userId ? [{
          id: params.userId,
          name: params.userName,
          avatar: params.userAvatar,
        }] : []}
        onChange={(users) => {
          const { id, name, avatar } = users[0] || {};
          setParams({ ...params, userId: id, userName: name, userAvatar: avatar });
        }} />

    </>;
  };

  return <div style={{ marginBottom: 60 }}>
    <MyNavBar title={createTypeData().title} />
    {content()}

    <OtherData
      createType={createType}
      careful={<Title className={style.title}>注意事项 <span>*</span></Title>}
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
            theme: params.theme,
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
