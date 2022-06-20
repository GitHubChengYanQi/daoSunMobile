import React, { useEffect, useState } from 'react';
import { useLocation } from 'umi';
import { ToolUtil } from '../../../../components/ToolUtil';
import { useRequest } from '../../../../../util/Request';
import { orderDetail } from '../../../Order/Url';
import MyEmpty from '../../../../components/MyEmpty';
import PurchaseOrderInstock from './components/PurchaseOrderInstock';
import { MyLoading } from '../../../../components/MyLoading';
import InstockSkus from './components/InstockSkus';

const Submit = () => {

  const { query, state } = useLocation();

  const skus = ToolUtil.isArray(state && state.skus);
  const judge = state && state.judge;

  const [data, setData] = useState();

  const { loading: purchaseOrderLoading, run: purchaseOrder } = useRequest(orderDetail, {
    manual: true,
    onSuccess: setData,
  });

  useEffect(() => {
    switch (ToolUtil.isObject(query).type) {
      case 'purchase':
        purchaseOrder({ data: { orderId: ToolUtil.isObject(query).id } });
        break;
      case 'production':
        break;
      case 'outSku':
        break;
      case 'outItem':
        break;
      default:
        break;
    }
  }, []);

  if (purchaseOrderLoading) {
    return <MyLoading skeleton />;
  }

  switch (ToolUtil.isObject(query).type) {
    case 'purchase':
      return <PurchaseOrderInstock data={data} />;
    case 'production':
      return <MyEmpty />;
    case 'outSku':
      return <MyEmpty />;
    case 'outItem':
      return <MyEmpty />;
    default:
      return <InstockSkus skus={skus} createType={query.createType} judge={judge} />;
  }
};

export default Submit;
