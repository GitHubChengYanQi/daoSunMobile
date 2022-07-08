import React, { useState } from 'react';
import style from './index.less';
import { Popup } from 'antd-mobile';
import SkuError from './components/SkuError';
import { ToolUtil } from '../../../../../../components/ToolUtil';
import MyCard from '../../../../../../components/MyCard';
import LinkButton from '../../../../../../components/LinkButton';
import { useHistory } from 'react-router-dom';
import { ReceiptsEnums } from '../../../../../index';
import ErrorItem from './components/ErrorItem';

const InstockError = (
  {
    data = {},
    getAction = () => {
      return {};
    },
    permissions,
    refresh = () => {
    },
  },
) => {

  const [visible, setVisible] = useState();

  const anomalyResults = data.anomalyResults || [];
  const instockOrder = data.instockOrder || {};

  const history = useHistory();

  const masterUser = ToolUtil.isObject(data.masterUser);

  const errorTypeData = () => {
    switch (data.type) {
      case 'instock':
        return {
          receipts: <LinkButton
            className={style.value}
            onClick={() => {
              history.push(`/Receipts/ReceiptsDetail?type=${ReceiptsEnums.instockOrder}&formId=${data.instockOrderId}`);
            }}
          >
            {masterUser.name && `${masterUser.name || '-'}的入库申请 / ${instockOrder.coding || '-'}`}
          </LinkButton>,
          totalTitle: '申请总数',
        };
      case 'Stocktaking':
        return {
          receipts: masterUser.name && `${masterUser.name || '-'}的盘点申请 / ${instockOrder.coding || '-'}`,
          totalTitle: '实际总数',
        };
      default:
        return {};
    }
  };

  return <>
    <MyCard title='物料明细'>
      <div className={style.skuList}>
        {
          anomalyResults.map((item, index) => {
            return <ErrorItem totalTitle={errorTypeData().totalTitle} item={item} key={index} index={index} onClick={() => {
              if (getAction('verify').id && permissions) {
                setVisible(item.anomalyId);
              }
            }} />;
          })
        }
      </div>
    </MyCard>

    <MyCard title='来源'>
      {errorTypeData().receipts}
    </MyCard>

    <Popup onMaskClick={() => setVisible(false)} destroyOnClose visible={visible}>
      <SkuError
        height='80vh'
        anomalyOrderId={data.orderId}
        anomalyId={visible}
        onClose={() => setVisible(false)}
        onSuccess={() => {
          setVisible(false);
          refresh();
        }} />
    </Popup>
  </>;
};

export default InstockError;
