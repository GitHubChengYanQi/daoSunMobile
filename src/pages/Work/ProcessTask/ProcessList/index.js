import React, { useState } from 'react';
import style from '../MyAudit/index.less';
import MyList from '../../../components/MyList';
import { ClockCircleOutline } from 'antd-mobile-icons';
import { ReceiptsEnums } from '../../../Receipts';
import { SkuResultSkuJsons } from '../../../Scan/Sku/components/SkuResult_skuJsons';
import { useHistory } from 'react-router-dom';
import { MyDate } from '../../../components/MyDate';
import { ToolUtil } from '../../../components/ToolUtil';
import InStockItem from '../../Stock/Task/components/InStockTask/components/InStockItem';
import OutStockItem from '../../Stock/Task/components/OutStockTask/components/OutStockItem';
import MaintenaceItem from '../../Stock/Task/components/MaintenanceTask/components/MaintenaceItem';
import StocktakingItem from '../../Stock/Task/components/StocktakingTask/components/StocktakingItem';


const startList = {
  url: '/activitiProcessTask/auditList',
  method: 'POST',
};

const ProcessList = (
  {
    setNumber = () => {
    },
    listRef,
    api,
    processListRef,
  },
) => {

  const [data, setData] = useState([]);

  const history = useHistory();

  const receiptsData = (item, index) => {
    const receipts = item.receipts || {};
    switch (item.type) {
      case ReceiptsEnums.instockOrder:
        return <InStockItem item={item} index={index} />;
      case ReceiptsEnums.outstockOrder:
        return <OutStockItem item={item} index={index} />;
      case ReceiptsEnums.maintenance:
        return <MaintenaceItem item={item} index={index} />;
      case ReceiptsEnums.stocktaking:
        return <StocktakingItem item={item} index={index} />;
      case ReceiptsEnums.instockError:
        return <div className={style.item} onClick={() => {
          history.push(`/Receipts/ReceiptsDetail?id=${item.processTaskId}`);
        }}>
          <div className={style.header}>
            <div className={style.title}>
              {item.taskName}
            </div>
            <div className={style.status}>
              · {receipts.statusName}
            </div>
          </div>
          <div className={style.content}>
            <div className={style.orderData}>
              <span className={style.coding}>单据编号：{receipts.coding || '-'}</span>
              <span className={style.time}><ClockCircleOutline /> {MyDate.Show(item.createTime)}</span>
            </div>
          </div>
        </div>;

      case 'ErrorForWard':
        return <div className={style.item} onClick={() => {
          history.push(`/Receipts/ReceiptsDetail?id=${item.processTaskId}`);
        }}>
          <div className={style.header}>
            <div className={style.title}>
              {item.taskName}
            </div>
            <div className={style.status}>
              · {receipts.statusName}
            </div>
          </div>
          <div className={style.content}>
            <div className={style.orderData}>
              <span className={style.coding}>关联单据：{ToolUtil.isObject(receipts.orderResult).coding}</span>
              <span className={style.time}><ClockCircleOutline /> {MyDate.Show(item.createTime)}</span>
            </div>
          </div>
        </div>;
      default:
        return <></>;
    }
  };

  return <>
    <div className={style.list} ref={processListRef}>
      <MyList
        ref={listRef}
        api={api || startList}
        params={{ auditType: 'audit' }}
        sorter={{ field: 'createTime', order: 'ascend' }}
        data={data}
        getData={setData}
        response={(res) => {
          setNumber(res.count);
        }}
      >
        {
          data.map((item, index) => {
            return <div key={index}>{receiptsData(item, index)}</div>;
          })
        }
      </MyList>
    </div>
  </>;
};

export default ProcessList;
