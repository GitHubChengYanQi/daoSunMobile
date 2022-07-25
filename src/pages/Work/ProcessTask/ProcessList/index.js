import React, { useState } from 'react';
import style from '../MyAudit/index.less';
import MyList from '../../../components/MyList';
import { ReceiptsEnums } from '../../../Receipts';
import InStockItem from '../../Stock/Task/components/InStockTask/components/InStockItem';
import OutStockItem from '../../Stock/Task/components/OutStockTask/components/OutStockItem';
import MaintenaceItem from '../../Stock/Task/components/MaintenanceTask/components/MaintenaceItem';
import StocktakingItem from '../../Stock/Task/components/StocktakingTask/components/StocktakingItem';
import ErrorItem from '../../Stock/Task/components/ErrorkTask/components/ErrorItem';
import ForwardItem from '../../Stock/Task/components/ErrorkTask/components/ForwardItem';


export const startList = {
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

  const receiptsData = (item, index) => {
    switch (item.type) {
      case ReceiptsEnums.instockOrder:
        return <InStockItem item={item} index={index} />;
      case ReceiptsEnums.outstockOrder:
        return <OutStockItem item={item} index={index} />;
      case ReceiptsEnums.maintenance:
        return <MaintenaceItem item={item} index={index} />;
      case ReceiptsEnums.stocktaking:
        return <StocktakingItem item={item} index={index} />;
        case ReceiptsEnums.allocation:
        return <InStockItem item={item} index={index} />;
      case ReceiptsEnums.error:
        return <ErrorItem item={item} />;
      case ReceiptsEnums.errorForWard:
        return <ForwardItem item={item} />;
      default:
        return <></>;
    }
  };

  return <>
    <div className={style.list} ref={processListRef}>
      <MyList
        ref={listRef}
        api={api || startList}
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
