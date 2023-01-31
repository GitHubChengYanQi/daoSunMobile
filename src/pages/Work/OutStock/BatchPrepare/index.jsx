import React, { useState } from 'react';
import BottomButton from '../../../components/BottomButton';
import styles from './index.less';
import { Message } from '../../../components/Message';
import { useRequest } from '../../../../util/Request';
import { classNames, isArray, ToolUtil } from '../../../../util/ToolUtil';
import {
  outPickListFormat,
} from '../../../Receipts/ReceiptsDetail/components/ReceiptData/components/OutStockOrder/components/OutSkuAction';
import { useLocation } from 'react-router-dom';
import { SkuResultSkuJsons } from '../../../Scan/Sku/components/SkuResult_skuJsons';
import ShopNumber from '../../AddShop/components/ShopNumber';
import { Divider } from 'antd-mobile';
import { MyLoading } from '../../../components/MyLoading';
import { getOutType } from '../../CreateTask/components/OutstockAsk';
import { MyDate } from '../../../components/MyDate';

export const outDetailList = { url: '/productionPickListsDetail/noPageList', method: 'POST' };
export const outDetail = { url: '/productionPickLists/detail', method: 'POST' };
export const autoAdd = { url: '/productionPickListsCart/autoAdd', method: 'POST' };

const BatchPrepare = () => {

  const { query } = useLocation();

  const [data, setData] = useState([]);
  const [countNumber, setCountNumber] = useState(0);

  const { loading, refresh: detailListRefresh } = useRequest({
    ...outDetailList,
    data: { pickListsId: query.pickListsId },
  }, {
    onSuccess: (res) => {
      const { countNumber, array } = outPickListFormat(ToolUtil.isArray(res));
      setCountNumber(countNumber);
      setData(array);
    },
  });

  const { loading: outDetailLoading, data: detail = {} } = useRequest({
    ...outDetail,
    data: { pickListsId: query.pickListsId },
  });

  const { loading: autoAddLoading, run: autoAddRun } = useRequest({
    ...autoAdd,
    data: { pickListsId: query.pickListsId },
  }, {
    manual: true,
    onSuccess: (res) => {
      Message.successDialog({
        content: <div style={{ textAlign: 'center' }}>
          备料成功
          <div>已备{data.length - res.length}个,库存不足{res.length}个</div>
        </div>,
        only: true,
      });
      detailListRefresh();
    },
  });

  if (outDetailLoading) {
    return <MyLoading skeleton />;
  }


  return <div>

    <div className={styles.batchPrepare}>
      <div className={styles.box}>
        <div>
          主题：{query.theme || '无'}
        </div>
        <div>
          负责人：{detail.userResult?.name || '无'}
        </div>
        <div>
          类型：{getOutType(detail.type)}
        </div>
        <div>
          注意事项：{isArray(detail.announcementsResults).length === 0 ? '无' : isArray(detail.announcementsResults).map(item => item.content).join('、')}
        </div>
        <div>
          备注：{detail.note || '无'}
        </div>
      </div>
      <div className={styles.box}>
        <div>
          订单编号：{detail.coding || '无'}
        </div>
        <div>
          申请时间：{MyDate.Show(detail.createTime)}
        </div>
      </div>

      <div className={styles.box}>
        <div className={styles.skuHeader}>
          <div className={styles.skuTitle}>物料</div>
          <div>申请数量</div>
        </div>
        <Divider style={{ margin: '8px 0' }} />
        {
          loading ? <MyLoading skeleton /> : data.map((item, index) => {
            const complete = item.notPrepared === 0;
            return <div key={index} className={classNames(styles.skuContent, complete && styles.complete)}>
              <div className={styles.sku}>
                {SkuResultSkuJsons({ skuResult: item.skuResult })}
              </div>
              <div><ShopNumber show value={item.number} /></div>
            </div>;
          })
        }
      </div>

      <div className={styles.total}>
        合计：&nbsp;&nbsp;{data.length}类&nbsp;&nbsp;{countNumber}件
      </div>
    </div>

    {(query.action === 'true') && <BottomButton
      only
      text='一键备料'
      onClick={() => {
        Message.warningDialog({
          content: '该操作会按照申请数量进行备料，库存不足按照库存数量备料！',
          confirmText: '开始备料',
          only: false,
          onConfirm: () => autoAddRun({ data: { pickListsId: query.pickListsId, taskId: query.taskId } }),
        });
      }}
    />}
  </div>;
};

export default BatchPrepare;
