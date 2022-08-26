import React from 'react';
import LinkButton from '../../../components/LinkButton';
import MyCard from '../../../components/MyCard';
import { MyDate } from '../../../components/MyDate';
import { RightOutline } from 'antd-mobile-icons';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';
import { ToolUtil } from '../../../components/ToolUtil';
import { useHistory } from 'react-router-dom';
import Icon from '../../../components/Icon';
import { ERPEnums } from '../../../Work/Stock/ERPEnums';
import style from '../Order/index.less';
import { startList } from '../../../Work/ProcessTask/ProcessList';
import MyEmpty from '../../../components/MyEmpty';
import { ReceiptsEnums } from '../../../Receipts';
import MyEllipsis from '../../../components/MyEllipsis';

export const TaskItem = (
  {
    taskItem = {},
  },
) => {

  const history = useHistory();

  const { loading, data } = useRequest({
    ...startList,
    params: { limit: 3, page: 1 },
    data: { type: taskItem.type },
  });

  if (loading) {
    return <MyLoading skeleton />;
  }

  return <MyCard
    className={style.orderItem}
    headerClassName={style.orderHeader}
    titleBom={<div><Icon type='icon-dian' />{taskItem.title}</div>}
    extra={<LinkButton onClick={() => {
      history.push(`/Report/TaskData?type=${taskItem.type}`);
    }}>更多</LinkButton>}
    bodyClassName={style.orderItemBody}
  >
    {ToolUtil.isArray(data).length === 0 && <MyEmpty />}
    {
      ToolUtil.isArray(data).map((item, index) => {
        const receipts = item.receipts || {};
        return <div key={index} className={style.orderInfo}>
          <div className={style.orderName}>
            <MyEllipsis maxWidth={ToolUtil.viewWidth() / 2}>{item.taskName} / {receipts.coding}</MyEllipsis></div>
          <div className={style.time}>{MyDate.Show(item.createTime)} <RightOutline /></div>
        </div>;
      })
    }
  </MyCard>;
};

const TaskList = () => {

  const orderType = [
    { title: '入库', type: ReceiptsEnums.instockOrder },
    { title: '出库', type: ReceiptsEnums.outstockOrder },
    { title: '盘点', type: ReceiptsEnums.stocktaking },
    { title: '养护', type: ReceiptsEnums.maintenance },
    { title: '调拨', type: ReceiptsEnums.allocation },
  ];

  return <>
    {
      orderType.map((taskItem, taskIndex) => {
        return <TaskItem key={taskIndex} taskItem={taskItem} />;
      })
    }
  </>;
};

export default TaskList;
