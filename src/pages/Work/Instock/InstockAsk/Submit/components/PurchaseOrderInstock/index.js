import React, { useEffect } from 'react';
import style from './index.less';
import { ToolUtil } from '../../../../../../components/ToolUtil';
import { useRequest } from '../../../../../../../util/Request';
import MyNavBar from '../../../../../../components/MyNavBar';
import CreateTask from '../../../../../CreateTask';

export const contractDetail = { url: '/contract/detail', method: 'POST' };

const PurchaseOrderInstock = ({ data = {} }) => {

  const details = ToolUtil.isArray(data.detailResults);

  const { data: contract, run } = useRequest(contractDetail, { manual: true });

  useEffect(() => {
    if (data.contractId) {
      run({ data: { contractId: data.contractId } });
    }
  }, [data.contractId]);


  return <>
    <MyNavBar title='入库申请' />
    <div className={style.data}>
      <div className={style.label}>供应商</div>
      <div className={style.value}>{ToolUtil.isObject(data.bcustomer).customerName || '-'}</div>
    </div>
    <div className={style.data}>
      <div className={style.label}>合同号</div>
      <div className={style.value}>{ToolUtil.isObject(contract).coding || '-'}</div>
    </div>

    <CreateTask skus={details.map(item => {
      return {
        skuId: ToolUtil.isObject(item.skuResult).skuId,
        skuResult: item.skuResult,
        brandName: ToolUtil.isObject(item.brandResult).brandName,
        brandId: item.brandId,
        customerName: ToolUtil.isObject(data.bcustomer).customerName,
        customerId: data.sellerId,
        number: item.purchaseNumber,
      };
    })} />
  </>;
};

export default PurchaseOrderInstock;
