import React, { useEffect, useState } from 'react';
import { ToolUtil } from '../../../../../util/ToolUtil';
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
import MyPicker from '../../../../components/MyPicker';

export const getOutType = (type) => {
  switch (type) {
    case 'PRODUCTION_TASK':
      return '生产任务';
    case 'PRODUCTION_LOSS':
      return '生产损耗';
    case 'THREE_GUARANTEES':
      return '三包服务';
    case 'RESERVE_PICK':
      return '备品备料';
    case 'LOSS_REPORTING':
      return '报损出库';
    default:
      return '';
  }
};

export const OutType = [
  { label: '生产任务', value: 'PRODUCTION_TASK' },
  { label: '生产损耗', value: 'PRODUCTION_LOSS' },
  { label: '三包服务', value: 'THREE_GUARANTEES' },
  { label: '备品备料', value: 'RESERVE_PICK' },
  { label: '报损出库', value: 'LOSS_REPORTING' },
];

const OutstockAsk = (
  {
    skus,
    judge,
    createType,
    defaultParams = {},
    success = () => {
    },
  }) => {

  const { initialState } = useModel('@@initialState');
  const userInfo = ToolUtil.isObject(initialState).userInfo || {};

  const [data, setData] = useState([]);

  const [params, setParams] = useState({});

  const [typeVisible, setTypeVisible] = useState();

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
      success();
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
    setParams({
      type: 'task',
      userId: userInfo.id,
      userName: userInfo.name,
      userAvatar: userInfo.avatar,
      dept: userInfo.dept && userInfo.dept[0],
      role: userInfo.role && userInfo.role[0],
      ...defaultParams,
    });
    dataChange(skus);
  }, []);

  const createTypeData = (item = {}) => {
    return {
      title: '出库申请',
      type: '出库',
      otherData: [
        item.brandName || '任意品牌',
        item?.skuResult?.spuResult?.spuClassificationResult?.name,
      ],
      disabled: !params.userId || normalSku.length === 0 || !params.theme || !params.type,
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

      <MyCard titleBom={<Title className={style.title}>主题 <span>*</span></Title>} extra={<Input
        value={params.theme}
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
          dept: params.dept,
          role: params.role,
        }] : []}
        onChange={(users) => {
          const { id, name, avatar, dept, role } = users[0] || {};
          setParams({ ...params, userId: id, userName: name, userAvatar: avatar, dept, role });
        }} />
      <MyCard titleBom={<Title className={style.title}>出库类型 <span>*</span></Title>} extra={<div onClick={() => {
        setTypeVisible(true);
      }}>
        {getOutType(params.type) || '请选择'}
      </div>} />
    </>;
  };

  return <div style={{ marginBottom: 60 }}>
    <MyNavBar title={createTypeData().title} />
    {content()}

    <OtherData
      createType={createType}
      careful={<Title>注意事项</Title>}
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
        outStock({
          data: {
            source: 'outstock',
            pickListsDetailParams: normalSku,
            enclosure: ToolUtil.isArray(params.mediaIds).toString(),
            remarks: ToolUtil.isArray(params.noticeIds).toString(),
            note: params.remark,
            userIds: ToolUtil.isArray(params.userIds).toString(),
            userId: params.userId,
            theme: params.theme,
            type: params.type,
          },
        });
      }}
    />

    <MyPicker
      onClose={() => setTypeVisible(false)}
      visible={typeVisible}
      value={params.type}
      onChange={(option) => {
        setTypeVisible(false);
        setParams({ ...params, type: option.value });
      }}
      options={OutType}
    />

    {
      (outLoading) && <MyLoading />
    }

  </div>;

};

export default OutstockAsk;
