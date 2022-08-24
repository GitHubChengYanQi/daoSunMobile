import React, { useEffect, useState } from 'react';
import style from '../MyAudit/index.less';
import MyList from '../../../components/MyList';
import { ReceiptsEnums } from '../../../Receipts';
import InStockItem from '../../Stock/Task/components/InStockTask/components/InStockItem';
import OutStockItem from '../../Stock/Task/components/OutStockTask/components/OutStockItem';
import MaintenaceItem from '../../Stock/Task/components/MaintenanceTask/components/MaintenaceItem';
import StocktakingItem from '../../Stock/Task/components/StocktakingTask/components/StocktakingItem';
import ErrorItem from '../../Stock/Task/components/ErrorkTask/components/ErrorItem';
import ForwardItem from '../../Stock/Task/components/ErrorkTask/components/ForwardItem';
import { history } from 'umi';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';
import { ToolUtil } from '../../../components/ToolUtil';
import AllocationItem from '../../Stock/Task/components/AllocationTask/components/AllocationItem';


export const startList = {
  url: '/activitiProcessTask/auditList',
  method: 'POST',
};

export const getTaskStatus = {
  url: '/activitiProcessTask/getTaskStatus',
  method: 'GET',
};

const ProcessList = (
  {
    manual,
    setNumber = () => {
    },
    listRef,
    api,
    processListRef,
    all,
    ReceiptDom,
  },
) => {

  const [data, setData] = useState([]);

  const { query, pathname } = history.location;

  const { loading, run } = useRequest(getTaskStatus, {
    manual: true,
    onSuccess: (res) => {
      if (ToolUtil.isObject(res).status !== 0 && !all) {
        const newData = data.filter(item => item.processTaskId !== res.processTaskId);
        setData(newData);
      }
    },
  });

  useEffect(() => {
    if (query.actionTaskId) {
      run({ params: { taskId: query.actionTaskId } });
    }
  }, [query.actionTaskId]);

  const onClick = (item) => {
    history.replace({
      pathname,
      query: { ...query, actionTaskId: item.processTaskId },
    });
    history.push(`/Receipts/ReceiptsDetail?id=${item.processTaskId}`);
  };

  const receiptsData = (item, index) => {
    switch (item.type) {
      case ReceiptsEnums.instockOrder:
        return <InStockItem onClick={onClick} item={item} index={index} />;
      case ReceiptsEnums.outstockOrder:
        return <OutStockItem onClick={onClick} item={item} index={index} />;
      case ReceiptsEnums.maintenance:
        return <MaintenaceItem onClick={onClick} item={item} index={index} />;
      case ReceiptsEnums.stocktaking:
        return <StocktakingItem onClick={onClick} item={item} index={index} />;
      case ReceiptsEnums.allocation:
        return <AllocationItem onClick={onClick} item={item} index={index} />;
      case ReceiptsEnums.error:
        return <ErrorItem onClick={onClick} item={item} />;
      case ReceiptsEnums.errorForWard:
        return <ForwardItem onClick={onClick} item={item} />;
      default:
        return <></>;
    }
  };

  return <>
    {loading && <MyLoading />}
    <div className={style.list} ref={processListRef}>
      <MyList
        manual={manual}
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
            if (ReceiptDom) {
              return <ReceiptDom item={item} key={index} />;
            }
            return <div key={index}>{receiptsData(item, index)}</div>;
          })
        }
      </MyList>
    </div>
  </>;
};

export default ProcessList;
