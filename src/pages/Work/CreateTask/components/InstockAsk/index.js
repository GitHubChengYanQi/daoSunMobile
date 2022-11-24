import React, { useEffect, useState } from 'react';
import { ToolUtil } from '../../../../components/ToolUtil';
import { useHistory, useLocation } from 'react-router-dom';
import { useRequest } from '../../../../../util/Request';
import { instockOrderAdd } from '../../../Instock/Url';
import { Message } from '../../../../components/Message';
import Skus from '../Skus';
import MyNavBar from '../../../../components/MyNavBar';
import BottomButton from '../../../../components/BottomButton';
import { MyLoading } from '../../../../components/MyLoading';
import OtherData from '../OtherData';
import { ReceiptsEnums } from '../../../../Receipts';
import Title from '../../../../components/Title';
import style from '../../../Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import MyCard from '../../../../components/MyCard';
import { Input } from 'antd-mobile';
import Customers from '../../../ProcessTask/MyAudit/components/Customers';
import LinkButton from '../../../../components/LinkButton';
import MyPicker from '../../../../components/MyPicker';

export const getInType = (type) => {
  switch (type) {
    case 'PURCHASE_INSTOCK':
      return '采购入库';
    case 'PRODUCTION_INSTOCK':
      return '生产入库';
    case 'PRODUCTION_RETURN':
      return '生产退库';
    case 'CUSTOMER_RETURN':
      return '客户退货';
    default:
      return '';
  }
};

export const InType = [
  { label: '采购入库', value: 'PURCHASE_INSTOCK' },
  { label: '生产入库', value: 'PRODUCTION_INSTOCK' },
  { label: '生产退库', value: 'PRODUCTION_RETURN' },
  { label: '客户退货', value: 'CUSTOMER_RETURN' },
];


const InstockAsk = ({ skus, judge, createType, defaultParams }) => {

  const [data, setData] = useState([]);

  const { query, state } = useLocation();

  console.log(state?.sourId);

  const [hiddenBottom, setHiddenBottom] = useState(false);

  const [params, setParams] = useState(defaultParams || {});

  const [visible, setVisible] = useState(false);

  const [typeVisible, setTypeVisible] = useState(false);

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

  const { loading: instockLoading, run: inStock } = useRequest(instockOrderAdd, {
    manual: true,
    onSuccess: (res) => {
      history.push({
        pathname: '/Receipts/ReceiptsResult',
        state: {
          type: ReceiptsEnums.instockOrder,
          formId: res.instockOrderId,
        },
      });
    },
    onError: () => {
      Message.errorDialog({
        content: '创建入库任务失败!',
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
    dataChange(skus);
  }, []);

  const createTypeData = (item = {}) => {
    return {
      title: '入库申请',
      type: '入库',
      otherData: [item.customerName, item.brandName || '无品牌'],
      more: judge && ToolUtil.isArray(item.positions).map(item => {
        return `${item.name}(${item.number})`;
      }).join('、'),
      careful: '注意事项',
      buttonHidden: judge,
      disabled: (judge ? false : normalSku.length === 0 || !params.theme || !params.customerId || !params.instockType),
    };
  };

  const inStockRun = (directInStock) => {
    const listParams = [];
    (directInStock ? skuList : normalSku).map(item => {
      if (judge) {
        const positions = item.positions || [];
        positions.map(positionItem => {
          if (positionItem.number > 0) {
            listParams.push({
              ...item,
              customerId: params.customerId,
              storehousePositionsId: positionItem.id,
              number: positionItem.number,
            });
          }
          return null;
        });
      } else {
        listParams.push({ ...item, customerId: params.customerId, storehousePositionsId: item.positionId });
      }
      return null;
    });

    inStock({
      data: {
        type: query.submitType,
        customerId: params.customerId,
        shopCardType: createType,
        directInStock,
        module: 'createInstock',
        listParams,
        ...params,
      },
    });
  };

  const content = () => {
    return <Skus
      show={state?.numberStatus === 'disabled'}
      skus={skus}
      createTypeData={createTypeData}
      setHiddenBottom={setHiddenBottom}
      judge={judge}
      skuList={skuList}
      countNumber={countNumber}
      dataChange={dataChange}
    />;
  };

  return <div style={{ marginBottom: 60 }}>

    <MyNavBar title={createTypeData().title} />

    {content()}

    <MyCard titleBom={<Title className={style.title}>主题 <span>*</span></Title>} extra={<Input
      value={params.theme}
      className={style.theme}
      placeholder='请输入'
      onChange={(theme) => setParams({ ...params, theme })} />}
    />

    <MyCard
      titleBom={<Title className={style.title}>供应商 <span>*</span></Title>}
      extra={<LinkButton
        onClick={() => setVisible(true)}>{params.customerId ? params.customerName : '请选择供应商'}</LinkButton>}
    />

    <MyCard titleBom={<Title className={style.title}>入库类型 <span>*</span></Title>} extra={<div onClick={() => {
      setTypeVisible(true);
    }}>
      {getInType(params.instockType) || '请选择'}
    </div>} />

    <OtherData
      createType={createType}
      careful={<Title>注意事项</Title>}
      params={params}
      setParams={setParams}
    />

    {!hiddenBottom && <BottomButton
      leftOnClick={() => {
        history.goBack();
      }}
      rightText='提交'
      rightDisabled={createTypeData().disabled}
      rightOnClick={() => {
        if (judge) {
          return inStockRun(true);
        }
        inStockRun();
      }}
    />}

    {(instockLoading) && <MyLoading />}

    <Customers
      onClose={() => setVisible(false)}
      zIndex={1001}
      value={params.customerId ? [{ customerId: params.customerId, customerName: params.customerName }] : []}
      visible={visible}
      onChange={(customer) => {
        setParams({ ...params, customerId: customer?.customerId, customerName: customer?.customerName });
        setVisible(false);
      }}
    />

    <MyPicker
      onClose={() => setTypeVisible(false)}
      visible={typeVisible}
      value={params.instockType}
      onChange={(option) => {
        setTypeVisible(false);
        setParams({ ...params, instockType: option.value });
      }}
      options={InType}
    />

  </div>;
};

export default InstockAsk;
