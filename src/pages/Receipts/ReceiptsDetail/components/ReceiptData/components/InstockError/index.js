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
import { MyLoading } from '../../../../../../components/MyLoading';
import BottomButton from '../../../../../../components/BottomButton';
import { useRequest } from '../../../../../../../util/Request';
import { Message } from '../../../../../../components/Message';

export const submit = { url: '/anomalyOrder/submit', method: 'POST' };

const InstockError = (
  {
    data = {},
    getAction = () => {
      return {};
    },
    permissions,
    refresh = () => {
    },
    afertShow = () => {
    },
    loading,
  },
) => {

  const [visible, setVisible] = useState();

  const anomalyResults = data.anomalyResults || [];
  const instockOrder = data.instockOrder || {};

  const history = useHistory();

  const masterUser = ToolUtil.isObject(data.masterUser);

  const complete = anomalyResults.filter(item => item.status === 99);

  const action = getAction('verify').id && permissions;

  const { loading:submitLoading, run } = useRequest(submit, {
    manual: true,
    onSuccess: () => {
      Message.successToast('提交成功！', () => {
        refresh();
      });
    },
  });

  const errorTypeData = (item = {}) => {
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
          otherData: [
            ToolUtil.isObject(item.customer).customerName,
            ToolUtil.isObject(item.brand).brandName || '无品牌',
          ],
        };
      case 'Stocktaking':
        return {
          receipts: masterUser.name && `${masterUser.name || '-'}的盘点申请 / ${instockOrder.coding || '-'}`,
          totalTitle: '账面库存',
          otherData: [
            ToolUtil.isObject(item.brand).brandName || '无品牌',
            ToolUtil.isObject(item.positionsResult).name,
          ],
        };
      case 'timelyInventory':
        return {
          totalTitle: '账面库存',
          otherData: [
            ToolUtil.isObject(item.brand).brandName || '无品牌',
            ToolUtil.isObject(item.positionsResult).name,
          ],
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
            return <ErrorItem
              otherData={errorTypeData(item).otherData}
              totalTitle={errorTypeData().totalTitle}
              item={item}
              key={index}
              index={index}
              show={data.complete === 99}
              buttonHidden={!(action || data.complete === 99)}
              onClick={() => {
                setVisible(item.anomalyId);
              }} />;
          })
        }
      </div>
    </MyCard>

    <MyCard title='来源' hidden={!errorTypeData().receipts}>
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

    {action && <BottomButton
      afertShow={afertShow}
      only
      text='提交处理'
      disabled={complete.length !== anomalyResults.length}
      onClick={() => {
        run({ data: { orderId: data.orderId, actionId: getAction('verify').id } });
      }} />}

    {(loading || submitLoading) && <MyLoading />}
  </>;
};

export default InstockError;
