import React from 'react';
import style from '../Order/index.less';
import { MyDate } from '../../../components/MyDate';
import { RightOutline } from 'antd-mobile-icons';
import { startList } from '../../../Work/ProcessTask/ProcessList';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';
import MyEmpty from '../../../components/MyEmpty';
import { ToolUtil } from '../../../components/ToolUtil';
import { history } from 'umi';

const TaskList = () => {

  const { loading, data } = useRequest({ ...startList, params: { limit: 3, page: 1 } });

  if (loading) {
    return <MyLoading skeleton />;
  }

  if (!data) {
    return <MyEmpty />;
  }

  return <>
    {
      ToolUtil.isArray(data).map((item, index) => {
        const receipts = item.receipts || {};
        const coding = receipts.coding;
        return <div
          key={index}
          className={style.orderInfo}
          onClick={() => {
            history.push(`/Receipts/ReceiptsDetail?id=${item.processTaskId}`);
          }}
        >
          <div className={style.orderName}>{item.taskName} <br /> {coding}</div>
          <div className={style.time}>{MyDate.Show(item.createTime)} <RightOutline /></div>
        </div>;
      })
    }
  </>;
};

export default TaskList;
