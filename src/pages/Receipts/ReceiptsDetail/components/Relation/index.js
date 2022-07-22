import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../../util/Request';
import { ReceiptsEnums } from '../../../index';
import { MyLoading } from '../../../../components/MyLoading';
import MyEmpty from '../../../../components/MyEmpty';
import { ToolUtil } from '../../../../components/ToolUtil';
import Icon from '../../../../components/Icon';
import style from './index.less';
import { Avatar } from 'antd-mobile';
import { RightOutline } from 'antd-mobile-icons';
import { useHistory } from 'react-router-dom';

export const inStockRelation = { url: '/instockOrder/document', method: 'POST' };

const Relation = ({ type, receipts = {} }) => {

  const history = useHistory();

  const [relations, setRelations] = useState([]);

  const { loading: inStockLoading, run: inStockRun } = useRequest(inStockRelation, {
    manual: true,
    onSuccess: (res) => {
      setRelations(ToolUtil.isArray(res).map(item => {
        const receipts = item.receipts || {};
        return {
          taskId: item.processTaskId,
          user: item.user,
          orderInfo: item.taskName + ' / ' + receipts.coding,
          statusName: receipts.statusName || '进行中',
        };
      }));
    },
  });

  useEffect(() => {
    switch (type) {
      case ReceiptsEnums.instockOrder:
        inStockRun({ data: { instockOrderId: receipts.instockOrderId } });
        break;
        case ReceiptsEnums.stocktaking:
        inStockRun({ data: { inventoryTaskId: receipts.inventoryTaskId } });
        break;
      default:
        break;
    }
  }, []);

  if (inStockLoading) {
    return <MyLoading skeleton />;
  }

  if (relations.length === 0) {
    return <MyEmpty description='暂无关联单据' />;
  }

  return relations.map((item, index) => {
    return <div key={index} className={style.relationItem} onClick={() => {
      history.push(`/Receipts/ReceiptsDetail?id=${item.taskId}`);
    }}>
      <div className={style.info}>
        <Avatar src={ToolUtil.isObject(item.user).avatar || ''} style={{ '--size': '20px' }} />
        <span>{item.orderInfo}</span>
      </div>
      <div className={style.status}>
        <Icon type='icon-dian' /> {item.statusName || '进行中'} <RightOutline />
      </div>
    </div>;
  });
};

export default Relation;
